// Simple in-memory database for demo purposes
// In production, use a real database like MongoDB or PostgreSQL

class Database {
  constructor() {
    this.certificates = new Map();
    this.payments = new Map();
  }

  // Certificate operations
  saveCertificate(certificateId, data) {
    this.certificates.set(certificateId, {
      ...data,
      createdAt: new Date().toISOString(),
    });
  }

  getCertificate(certificateId) {
    return this.certificates.get(certificateId);
  }

  // Payment operations
  savePayment(paymentHash, data) {
    this.payments.set(paymentHash, {
      ...data,
      createdAt: new Date().toISOString(),
    });
  }

  getPayment(paymentHash) {
    return this.payments.get(paymentHash);
  }

  updatePaymentStatus(paymentHash, status, certificateId = null) {
    const payment = this.payments.get(paymentHash);
    if (payment) {
      payment.status = status;
      payment.updatedAt = new Date().toISOString();
      if (certificateId) {
        payment.certificateId = certificateId;
      }
      this.payments.set(paymentHash, payment);
    }
  }

  // Get all certificates (for admin purposes)
  getAllCertificates() {
    return Array.from(this.certificates.values());
  }

  // Get all payments (for admin purposes)
  getAllPayments() {
    return Array.from(this.payments.values());
  }
}

export default new Database();
