const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

exports.generate = async ({ name, birthDate, type, certId }) => {
  const doc = new PDFDocument();
  const filename = `cert-${certId}.pdf`;
  const filepath = path.join(process.env.PDF_STORAGE_PATH, filename);
  
  doc.pipe(fs.createWriteStream(filepath));
  
  // En-tête
  doc.fontSize(25).text('RÉPUBLIQUE DU SÉNÉGAL', { align: 'center' });
  doc.fontSize(20).text(`${type}`, { align: 'center' });
  doc.moveDown();
  
  // Contenu
  doc.fontSize(14).text(`Nom: ${name}`);
  doc.text(`Date de naissance: ${birthDate}`);
  doc.text(`Numéro: ${certId}`);
  doc.moveDown();
  
  // QR code vérification
  const qrUrl = `${process.env.BACKEND_URL}/api/verify/${certId}`;
  const qrBuffer = await QRCode.toBuffer(qrUrl);
  doc.image(qrBuffer, { width: 100 });
  
  doc.end();
  
  return new Promise((resolve) => {
    doc.on('end', () => resolve(filepath));
  });
};

exports.hashFile = (filepath) => {
  const file = fs.readFileSync(filepath);
  return crypto.createHash('sha256').update(file).digest('hex');
};
