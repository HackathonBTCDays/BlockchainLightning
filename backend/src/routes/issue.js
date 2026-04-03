const express = require('express');
const router = express.Router();
const fiatPayment = require('../services/fiatPayment');
const pdf = require('../services/pdf');
const bitcoin = require('../services/bitcoin');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  try {
    const { name, birthDate, type, transactionId } = req.body;
    
    // 1. Vérifier la gratuité et le paiement bancaire / mobile
    if (!fiatPayment.isFreeDocument(type)) {
      const paid = await fiatPayment.verifyPayment(transactionId);
      if (!paid) {
        return res.status(400).json({ error: 'Paiement requis ou transaction introuvable' });
      }
    }
    
    // 2. Générer ID unique
    const certId = uuidv4();
    
    // 3. Générer PDF
    const pdfPath = await pdf.generate({ name, birthDate, type, certId });
    
    // 4. Hash PDF
    const hash = pdf.hashFile(pdfPath);
    
    // 5. Ancrer sur Bitcoin testnet
    const txid = await bitcoin.anchorHash(hash);
    
    // 6. Retourner infos
    res.json({
      certId,
      pdfUrl: `/pdfs/cert-${certId}.pdf`,
      hash,
      txid,
      verified: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
