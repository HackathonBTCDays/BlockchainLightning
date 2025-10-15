import lnbitsService from '../services/lnbitsService.js';
import database from '../utils/database.js';

export const createPaymentInvoice = async (req, res) => {
  try {
    const { amount, certificateType, userData } = req.body;

    if (!amount || !certificateType) {
      return res.status(400).json({ error: 'Amount and certificate type are required' });
    }

    const memo = `Payment for ${certificateType} certificate`;
    
    // Create invoice via LNbits
    const invoice = await lnbitsService.createInvoice(amount, memo);

    // Store payment information
    database.savePayment(invoice.payment_hash, {
      amount,
      certificateType,
      userData,
      status: 'pending',
      paymentRequest: invoice.payment_request,
      checkingId: invoice.checking_id,
    });

    res.json({
      success: true,
      payment_hash: invoice.payment_hash,
      payment_request: invoice.payment_request,
      checking_id: invoice.checking_id,
    });
  } catch (error) {
    console.error('Error creating payment invoice:', error.message);
    res.status(500).json({ error: 'Failed to create payment invoice' });
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const { payment_hash } = req.params;

    if (!payment_hash) {
      return res.status(400).json({ error: 'Payment hash is required' });
    }

    // Check status with LNbits
    const status = await lnbitsService.checkInvoiceStatus(payment_hash);

    // Update local database
    if (status.paid) {
      database.updatePaymentStatus(payment_hash, 'paid');
    }

    res.json({
      success: true,
      paid: status.paid,
      details: status.details,
    });
  } catch (error) {
    console.error('Error checking payment status:', error.message);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
};

export const generateLNURL = async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const lnurl = await lnbitsService.generateLNURL(amount, description || 'Certificate payment');

    res.json({
      success: true,
      lnurl: lnurl.lnurl,
      payment_hash: lnurl.paymentHash,
      checking_id: lnurl.checkingId,
    });
  } catch (error) {
    console.error('Error generating LNURL:', error.message);
    res.status(500).json({ error: 'Failed to generate LNURL' });
  }
};
