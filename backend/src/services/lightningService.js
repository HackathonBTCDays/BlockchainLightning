const axios = require('axios');

const lnbitsUrl = process.env.LNBITS_URL;
const invoiceKey = process.env.LNBITS_INVOICE_KEY;

const api = axios.create({
  baseURL: `${lnbitsUrl}/api/v1`,
  headers: {
    'X-Api-Key': invoiceKey,
    'Content-Type': 'application/json',
  },
});

/**
 * Creates a Lightning invoice using the LNbits API.
 * @param {number} amount - The amount in satoshis.
 * @param {string} memo - The description for the invoice.
 * @returns {Promise<object>} The invoice data, including payment_hash and payment_request.
 */
const createInvoice = async (amount, memo) => {
  try {
    const response = await api.post('/payments', {
      out: false, // This signifies it's an invoice we expect to receive payment for
      amount: amount,
      memo: memo,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating LNbits invoice:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create Lightning invoice.');
  }
};

/**
 * Checks the status of a Lightning invoice.
 * @param {string} paymentHash - The payment_hash of the invoice to check.
 * @returns {Promise<object>} The payment details, including the 'paid' status.
 */
const checkInvoice = async (paymentHash) => {
  try {
    const response = await api.get(`/payments/${paymentHash}`);
    return response.data;
  } catch (error) {
    console.error('Error checking LNbits invoice:', error.response ? error.response.data : error.message);
    throw new Error('Failed to check Lightning invoice status.');
  }
};

module.exports = {
  createInvoice,
  checkInvoice,
};
