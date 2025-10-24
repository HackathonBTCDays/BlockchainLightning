import axios from 'axios';
import crypto from 'crypto';

class PaymentService {
  constructor() {
    this.lnbitsUrl = process.env.LNBITS_URL || 'http://localhost:5000';
    this.lnbitsApiKey = process.env.LNBITS_API_KEY || 'your-lnbits-api-key';
    this.paymentRequests = new Map(); // En production, utiliser une base de données
    this.paymentStatuses = new Map(); // En production, utiliser une base de données
  }

  /**
   * Crée une facture Lightning pour un certificat
   * @param {Object} certificateData - Données du certificat
   * @param {number} amountSats - Montant en satoshis
   * @param {Object} userData - Données utilisateur
   * @returns {Object} Résultat de la création de facture
   */
  async createPaymentInvoice(certificateData, amountSats, userData) {
    try {
      // Générer un ID de paiement unique
      const paymentId = crypto.randomBytes(16).toString('hex');
      
      // Créer la facture Lightning via LNbits
      const invoiceData = {
        out: false,
        amount: amountSats,
        memo: `Certificat ${certificateData.type} - ${userData.firstName} ${userData.lastName}`,
        webhook: `${process.env.API_URL}/api/payments/webhook/${paymentId}`,
        extra: {
          certificateId: certificateData.id,
          userId: userData.id,
          certificateType: certificateData.type
        }
      };

      const response = await axios.post(
        `${this.lnbitsUrl}/api/v1/payments`,
        invoiceData,
        {
          headers: {
            'X-Api-Key': this.lnbitsApiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.payment_request) {
        // Enregistrer la demande de paiement
        this.paymentRequests.set(paymentId, {
          paymentId,
          certificateId: certificateData.id,
          userId: userData.id,
          amount: amountSats,
          paymentRequest: response.data.payment_request,
          paymentHash: response.data.payment_hash,
          status: 'pending',
          createdAt: new Date().toISOString(),
          userData,
          certificateData
        });

        return {
          success: true,
          paymentId,
          paymentRequest: response.data.payment_request,
          paymentHash: response.data.payment_hash,
          amount: amountSats,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
        };
      } else {
        throw new Error('Réponse invalide de LNbits');
      }

    } catch (error) {
      console.error('Error creating payment invoice:', error.message);
      return {
        success: false,
        error: 'Erreur lors de la création de la facture',
        details: error.message
      };
    }
  }

  /**
   * Vérifie le statut d'un paiement
   * @param {string} paymentId - ID du paiement
   * @returns {Object} Statut du paiement
   */
  async checkPaymentStatus(paymentId) {
    try {
      const paymentRequest = this.paymentRequests.get(paymentId);
      
      if (!paymentRequest) {
        return {
          success: false,
          error: 'Demande de paiement non trouvée'
        };
      }

      // Vérifier le statut via LNbits
      const response = await axios.get(
        `${this.lnbitsUrl}/api/v1/payments/${paymentRequest.paymentHash}`,
        {
          headers: {
            'X-Api-Key': this.lnbitsApiKey
          }
        }
      );

      if (response.data) {
        const isPaid = response.data.paid || false;
        const paidAt = response.data.paid_at || null;
        
        // Mettre à jour le statut
        if (isPaid && paymentRequest.status === 'pending') {
          paymentRequest.status = 'paid';
          paymentRequest.paidAt = paidAt;
          paymentRequest.verifiedAt = new Date().toISOString();
          
          // Enregistrer le statut
          this.paymentStatuses.set(paymentId, {
            paymentId,
            status: 'paid',
            paidAt,
            verifiedAt: new Date().toISOString(),
            certificateId: paymentRequest.certificateId,
            userId: paymentRequest.userId
          });
        }

        return {
          success: true,
          paymentId,
          status: isPaid ? 'paid' : 'pending',
          paid: isPaid,
          paidAt,
          amount: paymentRequest.amount,
          paymentRequest: paymentRequest.paymentRequest
        };
      } else {
        return {
          success: false,
          error: 'Impossible de vérifier le statut du paiement'
        };
      }

    } catch (error) {
      console.error('Error checking payment status:', error.message);
      return {
        success: false,
        error: 'Erreur lors de la vérification du paiement',
        details: error.message
      };
    }
  }

  /**
   * Traite un webhook de paiement
   * @param {string} paymentId - ID du paiement
   * @param {Object} webhookData - Données du webhook
   * @returns {Object} Résultat du traitement
   */
  async processPaymentWebhook(paymentId, webhookData) {
    try {
      const paymentRequest = this.paymentRequests.get(paymentId);
      
      if (!paymentRequest) {
        return {
          success: false,
          error: 'Demande de paiement non trouvée'
        };
      }

      // Vérifier que le paiement est confirmé
      if (webhookData.paid && webhookData.payment_hash === paymentRequest.paymentHash) {
        // Mettre à jour le statut
        paymentRequest.status = 'paid';
        paymentRequest.paidAt = webhookData.paid_at || new Date().toISOString();
        paymentRequest.verifiedAt = new Date().toISOString();
        
        // Enregistrer le statut
        this.paymentStatuses.set(paymentId, {
          paymentId,
          status: 'paid',
          paidAt: paymentRequest.paidAt,
          verifiedAt: paymentRequest.verifiedAt,
          certificateId: paymentRequest.certificateId,
          userId: paymentRequest.userId
        });

        // Déclencher la génération du certificat
        await this.triggerCertificateGeneration(paymentRequest);

        return {
          success: true,
          message: 'Paiement confirmé et certificat en cours de génération',
          paymentId,
          certificateId: paymentRequest.certificateId
        };
      }

      return {
        success: false,
        error: 'Paiement non confirmé'
      };

    } catch (error) {
      console.error('Error processing payment webhook:', error.message);
      return {
        success: false,
        error: 'Erreur lors du traitement du webhook',
        details: error.message
      };
    }
  }

  /**
   * Déclenche la génération du certificat après paiement
   * @param {Object} paymentRequest - Demande de paiement
   * @returns {Object} Résultat de la génération
   */
  async triggerCertificateGeneration(paymentRequest) {
    try {
      // Importer le service de certificat
      const certificateService = await import('./certificateService.js');
      
      // Générer le certificat
      const certificateResult = await certificateService.default.generateCertificate(
        paymentRequest.certificateData,
        paymentRequest.certificateData.type
      );

      // Enregistrer le certificat généré
      paymentRequest.certificateGenerated = true;
      paymentRequest.certificateResult = certificateResult;

      return {
        success: true,
        certificateId: certificateResult.certificateId,
        message: 'Certificat généré avec succès'
      };

    } catch (error) {
      console.error('Error triggering certificate generation:', error.message);
      return {
        success: false,
        error: 'Erreur lors de la génération du certificat',
        details: error.message
      };
    }
  }

  /**
   * Génère un LNURL pour le paiement
   * @param {Object} certificateData - Données du certificat
   * @param {number} amountSats - Montant en satoshis
   * @returns {Object} LNURL généré
   */
  async generateLNURL(certificateData, amountSats) {
    try {
      const paymentId = crypto.randomBytes(16).toString('hex');
      
      // Créer le LNURL
      const lnurlData = {
        tag: 'payRequest',
        callback: `${process.env.API_URL}/api/payments/lnurl/${paymentId}`,
        maxSendable: amountSats * 1000, // en millisats
        minSendable: amountSats * 1000,
        metadata: JSON.stringify([
          ['text/plain', `Certificat ${certificateData.type}`],
          ['text/long-desc', `Paiement pour certificat ${certificateData.type}`]
        ])
      };

      // Encoder en LNURL
      const lnurl = this.encodeLNURL(lnurlData);
      
      // Enregistrer le LNURL
      this.paymentRequests.set(paymentId, {
        paymentId,
        certificateId: certificateData.id,
        amount: amountSats,
        lnurl,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      return {
        success: true,
        paymentId,
        lnurl,
        qrCode: `lightning:${lnurl}`,
        amount: amountSats
      };

    } catch (error) {
      console.error('Error generating LNURL:', error.message);
      return {
        success: false,
        error: 'Erreur lors de la génération du LNURL',
        details: error.message
      };
    }
  }

  /**
   * Encode les données en LNURL
   * @param {Object} data - Données à encoder
   * @returns {string} LNURL encodé
   */
  encodeLNURL(data) {
    const json = JSON.stringify(data);
    const encoded = Buffer.from(json).toString('base64');
    return `lnurl${encoded}`;
  }

  /**
   * Décode un LNURL
   * @param {string} lnurl - LNURL à décoder
   * @returns {Object} Données décodées
   */
  decodeLNURL(lnurl) {
    try {
      const encoded = lnurl.replace('lnurl', '');
      const json = Buffer.from(encoded, 'base64').toString('utf8');
      return JSON.parse(json);
    } catch (error) {
      throw new Error('LNURL invalide');
    }
  }

  /**
   * Obtient l'historique des paiements d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Array} Historique des paiements
   */
  getUserPaymentHistory(userId) {
    try {
      const history = [];
      
      for (const [paymentId, paymentRequest] of this.paymentRequests.entries()) {
        if (paymentRequest.userId === userId) {
          history.push({
            paymentId,
            certificateId: paymentRequest.certificateId,
            amount: paymentRequest.amount,
            status: paymentRequest.status,
            createdAt: paymentRequest.createdAt,
            paidAt: paymentRequest.paidAt
          });
        }
      }
      
      return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error getting user payment history:', error.message);
      return [];
    }
  }

  /**
   * Annule une demande de paiement
   * @param {string} paymentId - ID du paiement
   * @returns {Object} Résultat de l'annulation
   */
  async cancelPaymentRequest(paymentId) {
    try {
      const paymentRequest = this.paymentRequests.get(paymentId);
      
      if (!paymentRequest) {
        return {
          success: false,
          error: 'Demande de paiement non trouvée'
        };
      }

      if (paymentRequest.status === 'paid') {
        return {
          success: false,
          error: 'Impossible d\'annuler un paiement déjà effectué'
        };
      }

      // Marquer comme annulé
      paymentRequest.status = 'cancelled';
      paymentRequest.cancelledAt = new Date().toISOString();

      return {
        success: true,
        message: 'Demande de paiement annulée',
        paymentId
      };

    } catch (error) {
      console.error('Error cancelling payment request:', error.message);
      return {
        success: false,
        error: 'Erreur lors de l\'annulation du paiement',
        details: error.message
      };
    }
  }
}

export default new PaymentService();
