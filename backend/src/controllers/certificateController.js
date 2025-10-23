import certificateService from '../services/certificateService.js';
import database from '../utils/database.js';

export const generateCertificate = async (req, res) => {
  try {
    const { payment_hash, userData, certificateType } = req.body;

    if (!payment_hash || !userData || !certificateType) {
      return res.status(400).json({ error: 'Payment hash, user data, and certificate type are required' });
    }

    // Verify payment was completed
    const payment = database.getPayment(payment_hash);
    if (!payment || payment.status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Generate certificate
    const certificate = await certificateService.generateCertificate(userData, certificateType);

    // Save certificate to database
    database.saveCertificate(certificate.certificateId, {
      ...certificate,
      userData,
      certificateType,
      paymentHash: payment_hash,
    });

    // Update payment with certificate ID
    database.updatePaymentStatus(payment_hash, 'completed', certificate.certificateId);

    res.json({
      success: true,
      certificateId: certificate.certificateId,
      documentHash: certificate.documentHash,
      blockchainAnchor: certificate.blockchainAnchor,
    });
  } catch (error) {
    console.error('Error generating certificate:', error.message);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
};

export const getCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({ error: 'Certificate ID is required' });
    }

    const filepath = certificateService.getCertificateFile(certificateId);
    if (!filepath) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.download(filepath, `certificate_${certificateId}.pdf`);
  } catch (error) {
    console.error('Error getting certificate:', error.message);
    res.status(500).json({ error: 'Failed to get certificate' });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId, documentHash } = req.body;

    if (!certificateId) {
      return res.status(400).json({ error: 'Certificate ID is required' });
    }

    const verification = await certificateService.verifyCertificate(certificateId, documentHash);

    res.json({
      success: true,
      ...verification,
    });
  } catch (error) {
    console.error('Error verifying certificate:', error.message);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
};

export const getCertificateTypes = async (req, res) => {
  try {
    const types = [
      { id: 'birth', name: 'Birth Certificate Extract', price: 50000 },
      { id: 'marriage', name: 'Marriage Certificate Extract', price: 50000 },
      { id: 'death', name: 'Death Certificate Extract', price: 50000 },
      { id: 'residence', name: 'Certificate of Residence', price: 30000 },
      { id: 'identity', name: 'Identity Certificate', price: 40000 },
    ];

    res.json({
      success: true,
      types,
    });
    console.log('Certificate types sent successfully');
  } catch (error) {
    console.error('Error getting certificate types:', error.message);
    res.status(500).json({ error: 'Failed to get certificate types' });
  }
};
