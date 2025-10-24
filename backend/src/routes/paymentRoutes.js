import express from 'express';
import { createPaymentInvoice, checkPaymentStatus, generateLNURL } from '../controllers/paymentController.js';

const router = express.Router();

// Create a Lightning invoice for certificate payment
router.post('/invoice', createPaymentInvoice);

// Check payment status
router.get('/status/:payment_hash', checkPaymentStatus);

// Generate LNURL for payment
router.post('/lnurl', generateLNURL);

export default router;
