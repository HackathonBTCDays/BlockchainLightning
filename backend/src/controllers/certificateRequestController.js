import validationService from '../services/validationService.js';
import paymentService from '../services/paymentService.js';
import verificationService from '../services/verificationService.js';

class CertificateRequestController {
  /**
   * Crée une demande de certificat avec validation
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async createCertificateRequest(req, res) {
    try {
      const { userData, certificateType, country = 'SN' } = req.body;

      // Étape 1: Valider les données utilisateur
      const validationResult = validationService.validateCertificateData(
        userData,
        certificateType,
        country
      );

      if (!validationResult.valid) {
        return res.status(400).json({
          success: false,
          error: 'Données de validation invalides',
          details: validationResult.errors,
          code: validationResult.code
        });
      }

      // Étape 2: Vérifier si l'utilisateur peut demander ce certificat
      const eligibilityCheck = validationService.canRequestCertificate(
        userData,
        certificateType
      );

      if (!eligibilityCheck.canRequest) {
        return res.status(403).json({
          success: false,
          error: 'Demande non autorisée',
          reason: eligibilityCheck.reason,
          details: eligibilityCheck.errors
        });
      }

      // Étape 3: Créer les données du certificat
      const certificateData = {
        id: eligibilityCheck.validationId,
        type: certificateType,
        userData: eligibilityCheck.validatedData,
        country,
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
        validationResult
      };

      // Étape 4: Calculer le prix (en satoshis)
      const priceSats = this.calculateCertificatePrice(certificateType, country);

      // Étape 5: Créer la facture de paiement
      const paymentResult = await paymentService.createPaymentInvoice(
        certificateData,
        priceSats,
        eligibilityCheck.validatedData
      );

      if (!paymentResult.success) {
        return res.status(500).json({
          success: false,
          error: 'Erreur lors de la création de la facture',
          details: paymentResult.error
        });
      }

      // Étape 6: Créer le LNURL pour le paiement
      const lnurlResult = await paymentService.generateLNURL(
        certificateData,
        priceSats
      );

      // Retourner la réponse
      res.status(201).json({
        success: true,
        certificateRequest: {
          certificateId: certificateData.id,
          type: certificateType,
          status: 'pending_payment',
          priceSats,
          priceFcfa: this.convertSatsToFcfa(priceSats),
          paymentId: paymentResult.paymentId,
          paymentRequest: paymentResult.paymentRequest,
          lnurl: lnurlResult.lnurl,
          qrCode: lnurlResult.qrCode,
          expiresAt: paymentResult.expiresAt,
          validationWarnings: validationResult.warnings
        },
        message: 'Demande de certificat créée avec succès. Veuillez effectuer le paiement.'
      });

    } catch (error) {
      console.error('Error creating certificate request:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Vérifie le statut d'un paiement
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async checkPaymentStatus(req, res) {
    try {
      const { paymentId } = req.params;

      const statusResult = await paymentService.checkPaymentStatus(paymentId);

      if (!statusResult.success) {
        return res.status(404).json({
          success: false,
          error: statusResult.error
        });
      }

      res.json({
        success: true,
        payment: {
          paymentId,
          status: statusResult.status,
          paid: statusResult.paid,
          paidAt: statusResult.paidAt,
          amount: statusResult.amount,
          paymentRequest: statusResult.paymentRequest
        }
      });

    } catch (error) {
      console.error('Error checking payment status:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Traite un webhook de paiement
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async processPaymentWebhook(req, res) {
    try {
      const { paymentId } = req.params;
      const webhookData = req.body;

      const result = await paymentService.processPaymentWebhook(
        paymentId,
        webhookData
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        message: result.message,
        paymentId,
        certificateId: result.certificateId
      });

    } catch (error) {
      console.error('Error processing payment webhook:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Vérifie un certificat
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async verifyCertificate(req, res) {
    try {
      const { certificateId } = req.params;
      const { documentHash, hideInformation } = req.query;

      // Vérifier le certificat
      const verificationResult = await verificationService.verifyCertificate(
        certificateId,
        documentHash
      );

      if (!verificationResult.valid) {
        return res.status(404).json({
          success: false,
          error: verificationResult.error,
          code: verificationResult.code,
          timestamp: verificationResult.timestamp
        });
      }

      // Si l'utilisateur demande à masquer certaines informations
      let responseData = verificationResult;
      
      if (hideInformation === 'true') {
        const hidingResult = verificationService.canHideInformation(
          certificateId,
          req.body.userData || {}
        );
        
        if (hidingResult.canHide) {
          responseData = {
            ...verificationResult,
            hiddenFields: hidingResult.allowedFields,
            requiredFields: hidingResult.requiredFields
          };
        }
      }

      res.json({
        success: true,
        verification: responseData,
        message: 'Certificat vérifié avec succès'
      });

    } catch (error) {
      console.error('Error verifying certificate:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Obtient l'historique des demandes d'un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getUserRequests(req, res) {
    try {
      const { userId } = req.params;
      const { status, type } = req.query;

      // En production, récupérer depuis la base de données
      const userRequests = await this.getUserCertificateRequests(userId, status, type);

      res.json({
        success: true,
        requests: userRequests,
        total: userRequests.length
      });

    } catch (error) {
      console.error('Error getting user requests:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Annule une demande de certificat
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async cancelCertificateRequest(req, res) {
    try {
      const { certificateId } = req.params;
      const { userId } = req.body;

      // Vérifier que l'utilisateur peut annuler cette demande
      const canCancel = await this.canUserCancelRequest(certificateId, userId);

      if (!canCancel) {
        return res.status(403).json({
          success: false,
          error: 'Impossible d\'annuler cette demande'
        });
      }

      // Annuler la demande
      const cancelResult = await this.cancelRequest(certificateId);

      if (!cancelResult.success) {
        return res.status(400).json({
          success: false,
          error: cancelResult.error
        });
      }

      res.json({
        success: true,
        message: 'Demande annulée avec succès',
        certificateId
      });

    } catch (error) {
      console.error('Error cancelling certificate request:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Calcule le prix d'un certificat
   * @param {string} certificateType - Type de certificat
   * @param {string} country - Pays
   * @returns {number} Prix en satoshis
   */
  calculateCertificatePrice(certificateType, country) {
    const prices = {
      'SN': {
        birth: 5000, // 5000 sats
        marriage: 7000,
        death: 5000,
        residence: 3000,
        identity: 4000
      },
      'default': {
        birth: 10000,
        marriage: 15000,
        death: 10000,
        residence: 8000,
        identity: 12000
      }
    };

    const countryPrices = prices[country] || prices.default;
    return countryPrices[certificateType] || 5000;
  }

  /**
   * Convertit les satoshis en FCFA
   * @param {number} sats - Montant en satoshis
   * @returns {number} Montant en FCFA
   */
  convertSatsToFcfa(sats) {
    // Taux de change approximatif (à ajuster selon le cours réel)
    const btcToFcfa = 35000000; // 1 BTC = 35,000,000 FCFA
    const satsToBtc = sats / 100000000; // 100,000,000 sats = 1 BTC
    return Math.round(satsToBtc * btcToFcfa);
  }

  /**
   * Obtient les demandes de certificats d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {string} status - Statut filtré
   * @param {string} type - Type filtré
   * @returns {Array} Demandes de certificats
   */
  async getUserCertificateRequests(userId, status, type) {
    try {
      // En production, récupérer depuis la base de données
      // Pour la démo, retourner des données simulées
      return [
        {
          certificateId: 'cert_123',
          type: 'birth',
          status: 'pending_payment',
          priceSats: 5000,
          priceFcfa: 1750,
          createdAt: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error getting user certificate requests:', error.message);
      return [];
    }
  }

  /**
   * Vérifie si un utilisateur peut annuler une demande
   * @param {string} certificateId - ID du certificat
   * @param {string} userId - ID de l'utilisateur
   * @returns {boolean} Peut annuler
   */
  async canUserCancelRequest(certificateId, userId) {
    try {
      // En production, vérifier dans la base de données
      // Pour la démo, retourner true
      return true;
    } catch (error) {
      console.error('Error checking cancel permission:', error.message);
      return false;
    }
  }

  /**
   * Annule une demande de certificat
   * @param {string} certificateId - ID du certificat
   * @returns {Object} Résultat de l'annulation
   */
  async cancelRequest(certificateId) {
    try {
      // En production, mettre à jour dans la base de données
      // Pour la démo, retourner un succès
      return {
        success: true,
        message: 'Demande annulée'
      };
    } catch (error) {
      console.error('Error cancelling request:', error.message);
      return {
        success: false,
        error: 'Erreur lors de l\'annulation'
      };
    }
  }
}

export default new CertificateRequestController();
