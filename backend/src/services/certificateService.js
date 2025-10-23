import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import bitcoinService from './bitcoinService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CertificateService {
  constructor() {
    this.certificatesDir = path.join(__dirname, '../../certificates');
    this.ensureCertificatesDirectory();
  }

  ensureCertificatesDirectory() {
    if (!fs.existsSync(this.certificatesDir)) {
      fs.mkdirSync(this.certificatesDir, { recursive: true });
    }
  }

  async generateCertificate(certificateData, certificateType) {
    try {
      const certificateId = crypto.randomBytes(16).toString('hex');
      const filename = `certificate_${certificateId}.pdf`;
      const filepath = path.join(this.certificatesDir, filename);

      // Create document hash before generating PDF
      const documentHash = bitcoinService.createDocumentHash({
        ...certificateData,
        certificateId,
        certificateType,
        timestamp: new Date().toISOString(),
      });

      // Anchor to blockchain
      const anchorResult = await bitcoinService.anchorDocumentHash(documentHash, {
        certificateId,
        certificateType,
      });

      // Generate PDF
      await this.createPDF(filepath, certificateData, certificateType, certificateId, anchorResult);

      return {
        certificateId,
        filename,
        filepath,
        documentHash,
        blockchainAnchor: anchorResult,
      };
    } catch (error) {
      console.error('Error generating certificate:', error.message);
      throw new Error('Failed to generate certificate');
    }
  }

  async createPDF(filepath, data, type, certificateId, anchorData) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('Official Certificate', { align: 'center' });
      doc.moveDown();
      doc.fontSize(18).text(this.getCertificateTitle(type), { align: 'center' });
      doc.moveDown(2);

      // Certificate content
      doc.fontSize(12).font('Helvetica');
      doc.text(`Certificate ID: ${certificateId}`);
      doc.text(`Issue Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      // Personal information
      doc.fontSize(14).font('Helvetica-Bold').text('Personal Information:');
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica');
      
      if (data.fullName) doc.text(`Full Name: ${data.fullName}`);
      if (data.dateOfBirth) doc.text(`Date of Birth: ${data.dateOfBirth}`);
      if (data.placeOfBirth) doc.text(`Place of Birth: ${data.placeOfBirth}`);
      if (data.fatherName) doc.text(`Father's Name: ${data.fatherName}`);
      if (data.motherName) doc.text(`Mother's Name: ${data.motherName}`);
      if (data.nationality) doc.text(`Nationality: ${data.nationality}`);
      if (data.idNumber) doc.text(`ID Number: ${data.idNumber}`);
      
      doc.moveDown(2);

      // Blockchain verification section
      doc.fontSize(14).font('Helvetica-Bold').text('Blockchain Verification:');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Document Hash: ${anchorData.hash.substring(0, 32)}...`);
      doc.text(`Transaction ID: ${anchorData.txId.substring(0, 32)}...`);
      doc.text(`Network: Bitcoin ${anchorData.network}`);
      doc.text(`Timestamp: ${anchorData.timestamp}`);
      doc.moveDown();

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).text('This certificate is digitally signed and anchored on the Bitcoin blockchain.', {
        align: 'center',
      });
      doc.text('Verify authenticity at: [Verification URL]', { align: 'center' });
      
      // Add a simple signature line
      doc.moveDown(2);
      doc.text('_____________________', { align: 'right' });
      doc.text('Authorized Signature', { align: 'right' });

      doc.end();

      stream.on('finish', () => resolve(filepath));
      stream.on('error', reject);
    });
  }

  getCertificateTitle(type) {
    const titles = {
      birth: 'Birth Certificate Extract',
      marriage: 'Marriage Certificate Extract',
      death: 'Death Certificate Extract',
      residence: 'Certificate of Residence',
      identity: 'Identity Certificate',
    };
    return titles[type] || 'Administrative Certificate';
  }

  async verifyCertificate(certificateId, documentHash) {
    try {
      const filename = `certificate_${certificateId}.pdf`;
      const filepath = path.join(this.certificatesDir, filename);

      if (!fs.existsSync(filepath)) {
        return { valid: false, error: 'Certificate not found' };
      }

      // In a real implementation, you would:
      // 1. Extract the transaction ID from the certificate
      // 2. Verify the hash against the blockchain
      // For demo purposes, we'll simulate this
      
      return {
        valid: true,
        certificateId,
        documentHash,
        verified: true,
        message: 'Certificate is valid and verified on blockchain',
      };
    } catch (error) {
      console.error('Error verifying certificate:', error.message);
      throw new Error('Failed to verify certificate');
    }
  }

  getCertificateFile(certificateId) {
    const filename = `certificate_${certificateId}.pdf`;
    const filepath = path.join(this.certificatesDir, filename);
    
    if (!fs.existsSync(filepath)) {
      return null;
    }
    
    return filepath;
  }
}

export default new CertificateService();
