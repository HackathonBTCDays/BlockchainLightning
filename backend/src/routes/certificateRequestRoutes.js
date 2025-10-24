import express from 'express';
import certificateRequestController from '../controllers/certificateRequestController.js';

const router = express.Router();

// Créer une demande de certificat
router.post('/requests', certificateRequestController.createCertificateRequest);

// Vérifier le statut d'un paiement
router.get('/payments/:paymentId/status', certificateRequestController.checkPaymentStatus);

// Traiter un webhook de paiement
router.post('/payments/webhook/:paymentId', certificateRequestController.processPaymentWebhook);

// Vérifier un certificat
router.get('/verify/:certificateId', certificateRequestController.verifyCertificate);

// Obtenir l'historique des demandes d'un utilisateur
router.get('/users/:userId/requests', certificateRequestController.getUserRequests);

// Annuler une demande de certificat
router.post('/requests/:certificateId/cancel', certificateRequestController.cancelCertificateRequest);

export default router;
