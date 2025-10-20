import express from 'express';
const router = express.Router();
const lnbits = require('../services/lnbits');
const pdf = require('../services/pdf');
const bitcoin = require('../services/bitcoin');

router.post('/', async (req: express.Request, res: express.Response) => {
  const { name, birthDate, preimage } = req.body;
  // 1. Vérifier paiement LNbits
  const paid = await lnbits.verifyPayment(preimage);
  if (!paid) return res.status(400).json({ error: 'Paiement non trouvé' });
  // 2. Générer PDF
  const pdfPath = await pdf.generate({ name, birthDate });
  // 3. Hash PDF
  const hash = await bitcoin.hashFile(pdfPath);
  // 4. Ancrer sur Bitcoin testnet
  const txid = await bitcoin.anchorHash(hash);
  // 5. Retourner infos
  res.json({ pdfUrl: pdfPath, txid });
});
module.exports = router;
