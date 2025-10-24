import express from 'express';
import { 
  generateCertificate, 
  getCertificate, 
  verifyCertificate,
  getCertificateTypes 
} from '../controllers/certificateController.js';

const router = express.Router();

// Get available certificate types
router.get('/types', getCertificateTypes);

// Generate a certificate after payment
router.post('/generate', generateCertificate);

// Download a certificate
router.get('/:certificateId', getCertificate);

// Verify a certificate
router.post('/verify', verifyCertificate);

export default router;
