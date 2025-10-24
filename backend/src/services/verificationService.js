import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bitcoinService from './bitcoinService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VerificationService {
  constructor() {
    this.certificatesDir = path.join(__dirname, '../../certificates');
    this.verificationLogs = new Map(); // En production, utiliser une base de données
  }

  /**
   * Vérifie l'authenticité d'un certificat
   * @param {string} certificateId - ID du certificat
   * @param {string} documentHash - Hash du document (optionnel)
   * @param {Object} verificationOptions - Options de vérification
   * @returns {Object} Résultat de la vérification
   */
  async verifyCertificate(certificateId, documentHash = null, verificationOptions = {}) {
    try {
      // Étape 1: Vérifier l'existence du certificat
      const certificateExists = await this.checkCertificateExists(certificateId);
      if (!certificateExists.exists) {
        return {
          valid: false,
          error: 'Certificat non trouvé',
          code: 'CERTIFICATE_NOT_FOUND',
          timestamp: new Date().toISOString()
        };
      }

      // Étape 2: Vérifier l'intégrité du fichier
      const integrityCheck = await this.verifyFileIntegrity(certificateId);
      if (!integrityCheck.valid) {
        return {
          valid: false,
          error: 'Intégrité du certificat compromise',
          code: 'INTEGRITY_CHECK_FAILED',
          timestamp: new Date().toISOString()
        };
      }

      // Étape 3: Vérifier l'ancrage blockchain
      const blockchainVerification = await this.verifyBlockchainAnchor(certificateId, documentHash);
      if (!blockchainVerification.valid) {
        return {
          valid: false,
          error: 'Vérification blockchain échouée',
          code: 'BLOCKCHAIN_VERIFICATION_FAILED',
          timestamp: new Date().toISOString()
        };
      }

      // Étape 4: Vérifier les métadonnées
      const metadataVerification = await this.verifyMetadata(certificateId);
      if (!metadataVerification.valid) {
        return {
          valid: false,
          error: 'Métadonnées invalides',
          code: 'METADATA_VERIFICATION_FAILED',
          timestamp: new Date().toISOString()
        };
      }

      // Étape 5: Vérifier la signature numérique (si implémentée)
      const signatureVerification = await this.verifyDigitalSignature(certificateId);
      
      // Enregistrer la vérification
      this.logVerification(certificateId, {
        valid: true,
        verificationSteps: {
          certificateExists,
          integrityCheck,
          blockchainVerification,
          metadataVerification,
          signatureVerification
        },
        timestamp: new Date().toISOString(),
        options: verificationOptions
      });

      return {
        valid: true,
        certificateId,
        documentHash: blockchainVerification.documentHash,
        transactionId: blockchainVerification.transactionId,
        verifiedAt: new Date().toISOString(),
        verificationSteps: {
          fileIntegrity: integrityCheck.valid,
          blockchainAnchor: blockchainVerification.valid,
          metadata: metadataVerification.valid,
          digitalSignature: signatureVerification.valid
        },
        message: 'Certificat vérifié avec succès'
      };

    } catch (error) {
      console.error('Error verifying certificate:', error.message);
      return {
        valid: false,
        error: 'Erreur de vérification interne',
        code: 'VERIFICATION_ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Vérifie l'existence d'un certificat
   * @param {string} certificateId - ID du certificat
   * @returns {Object} Résultat de la vérification
   */
  async checkCertificateExists(certificateId) {
    try {
      const filename = `certificate_${certificateId}.pdf`;
      const filepath = path.join(this.certificatesDir, filename);
      
      const exists = fs.existsSync(filepath);
      
      if (exists) {
        const stats = fs.statSync(filepath);
        return {
          exists: true,
          filepath,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      }
      
      return { exists: false };
    } catch (error) {
      console.error('Error checking certificate existence:', error.message);
      return { exists: false, error: error.message };
    }
  }

  /**
   * Vérifie l'intégrité du fichier certificat
   * @param {string} certificateId - ID du certificat
   * @returns {Object} Résultat de la vérification
   */
  async verifyFileIntegrity(certificateId) {
    try {
      const filename = `certificate_${certificateId}.pdf`;
      const filepath = path.join(this.certificatesDir, filename);
      
      if (!fs.existsSync(filepath)) {
        return { valid: false, error: 'Fichier non trouvé' };
      }

      // Calculer le hash du fichier
      const fileBuffer = fs.readFileSync(filepath);
      const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      
      // Vérifier que le fichier n'est pas vide
      if (fileBuffer.length === 0) {
        return { valid: false, error: 'Fichier vide' };
      }

      // Vérifier que c'est bien un PDF
      if (!fileBuffer.toString('ascii', 0, 4).startsWith('%PDF')) {
        return { valid: false, error: 'Format de fichier invalide' };
      }

      return {
        valid: true,
        fileHash,
        fileSize: fileBuffer.length,
        format: 'PDF'
      };
    } catch (error) {
      console.error('Error verifying file integrity:', error.message);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Vérifie l'ancrage blockchain
   * @param {string} certificateId - ID du certificat
   * @param {string} documentHash - Hash du document
   * @returns {Object} Résultat de la vérification
   */
  async verifyBlockchainAnchor(certificateId, documentHash = null) {
    try {
      // En production, cette fonction vérifierait réellement la blockchain
      // Pour la démo, nous simulons la vérification
      
      const mockTransactionId = `tx_${crypto.randomBytes(16).toString('hex')}`;
      const mockDocumentHash = documentHash || crypto.randomBytes(32).toString('hex');
      
      // Simuler la vérification blockchain
      const blockchainCheck = await bitcoinService.verifyDocumentHash(mockDocumentHash, {
        certificateId,
        transactionId: mockTransactionId
      });

      return {
        valid: blockchainCheck.valid,
        documentHash: mockDocumentHash,
        transactionId: mockTransactionId,
        network: 'bitcoin-testnet',
        blockHeight: 2500000, // Simulé
        confirmationCount: 6 // Simulé
      };
    } catch (error) {
      console.error('Error verifying blockchain anchor:', error.message);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Vérifie les métadonnées du certificat
   * @param {string} certificateId - ID du certificat
   * @returns {Object} Résultat de la vérification
   */
  async verifyMetadata(certificateId) {
    try {
      // En production, les métadonnées seraient stockées dans une base de données
      // Pour la démo, nous simulons la vérification
      
      const mockMetadata = {
        certificateId,
        type: 'birth', // Simulé
        issuer: 'Mairie de Dakar',
        issuedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 an
        status: 'active'
      };

      // Vérifier que le certificat n'a pas expiré
      const now = new Date();
      const validUntil = new Date(mockMetadata.validUntil);
      
      if (now > validUntil) {
        return {
          valid: false,
          error: 'Certificat expiré',
          metadata: mockMetadata
        };
      }

      // Vérifier le statut
      if (mockMetadata.status !== 'active') {
        return {
          valid: false,
          error: 'Certificat non actif',
          metadata: mockMetadata
        };
      }

      return {
        valid: true,
        metadata: mockMetadata
      };
    } catch (error) {
      console.error('Error verifying metadata:', error.message);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Vérifie la signature numérique (simulée)
   * @param {string} certificateId - ID du certificat
   * @returns {Object} Résultat de la vérification
   */
  async verifyDigitalSignature(certificateId) {
    try {
      // En production, cette fonction vérifierait une vraie signature numérique
      // Pour la démo, nous simulons la vérification
      
      return {
        valid: true,
        signatureAlgorithm: 'ECDSA',
        signer: 'CertiFast Authority',
        signedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error verifying digital signature:', error.message);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Enregistre une vérification dans les logs
   * @param {string} certificateId - ID du certificat
   * @param {Object} verificationResult - Résultat de la vérification
   */
  logVerification(certificateId, verificationResult) {
    try {
      const logEntry = {
        certificateId,
        ...verificationResult,
        id: crypto.randomBytes(16).toString('hex')
      };
      
      this.verificationLogs.set(certificateId, logEntry);
      
      // En production, sauvegarder dans une base de données
      console.log('Verification logged:', logEntry.id);
    } catch (error) {
      console.error('Error logging verification:', error.message);
    }
  }

  /**
   * Obtient l'historique des vérifications d'un certificat
   * @param {string} certificateId - ID du certificat
   * @returns {Array} Historique des vérifications
   */
  getVerificationHistory(certificateId) {
    try {
      const history = [];
      
      // En production, récupérer depuis la base de données
      if (this.verificationLogs.has(certificateId)) {
        history.push(this.verificationLogs.get(certificateId));
      }
      
      return history;
    } catch (error) {
      console.error('Error getting verification history:', error.message);
      return [];
    }
  }

  /**
   * Génère un rapport de vérification détaillé
   * @param {string} certificateId - ID du certificat
   * @returns {Object} Rapport de vérification
   */
  async generateVerificationReport(certificateId) {
    try {
      const verification = await this.verifyCertificate(certificateId);
      const history = this.getVerificationHistory(certificateId);
      
      return {
        certificateId,
        verification,
        history,
        reportGeneratedAt: new Date().toISOString(),
        reportId: crypto.randomBytes(16).toString('hex')
      };
    } catch (error) {
      console.error('Error generating verification report:', error.message);
      return {
        error: 'Erreur lors de la génération du rapport',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Vérifie si un utilisateur peut masquer certaines informations
   * @param {string} certificateId - ID du certificat process
   * @param {Object} userData - Données utilisateur
   * @returns {Object} Résultat de la vérification
   */
  canHideInformation(certificateId, userData) {
    try {
      // Règles pour masquer des informations selon le type de certificat
      const hidingRules = {
        birth: {
          allowedToHide: ['phone', 'email', 'address'],
          requiredToShow: ['firstName', 'lastName', 'dateOfBirth', 'placeOfBirth'],
          countrySpecific: {
            'SN': {
              allowedToHide: ['phone', 'email', 'address', 'fatherName', 'motherName'],
              requiredToShow: ['firstName', 'lastName', 'dateOfBirth', 'placeOfBirth']
            }
          }
        },
        marriage: {
          allowedToHide: ['phone', 'email', 'address'],
          requiredToShow: ['spouse1Name', 'spouse2Name', 'marriageDate', 'marriagePlace']
        },
        death: {
          allowedToHide: ['phone', 'email', 'address'],
          requiredToShow: ['deceasedName', 'deathDate', 'deathPlace']
        },
        residence: {
          allowedToHide: ['phone', 'email'],
          requiredToShow: ['fullName', 'address', 'residenceDate']
        },
        identity: {
          allowedToHide: ['phone', 'email'],
          requiredToShow: ['fullName', 'dateOfBirth', 'placeOfBirth', 'nationality']
        }
      };

      // Pour la démo, nous simulons la vérification
      return {
        canHide: true,
        allowedFields: ['phone', 'email', 'address'],
        requiredFields: ['firstName', 'lastName', 'dateOfBirth', 'placeOfBirth'],
        message: 'Certaines informations peuvent être masquées selon les règles de confidentialité'
      };
    } catch (error) {
      console.error('Error checking information hiding permissions:', error.message);
      return {
        canHide: false,
        error: 'Erreur de vérification des permissions'
      };
    }
  }
}

export default new VerificationService();
