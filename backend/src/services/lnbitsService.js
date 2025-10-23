import axios from 'axios';
import { config } from '../config/config.js';

class LNbitsService {
  constructor() {
    this.baseURL = config.lnbits.url;
    this.adminKey = config.lnbits.adminKey;
    this.invoiceKey = config.lnbits.invoiceKey;
  }

  async createInvoice(amount, memo, webhookUrl = null) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/v1/payments`,
        {
          out: false,
          amount: amount,
          memo: memo,
          webhook: webhookUrl,
        },
        {
          headers: {
            'X-Api-Key': this.invoiceKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        payment_hash: response.data.payment_hash,
        payment_request: response.data.payment_request,
        checking_id: response.data.checking_id,
      };
    } catch (error) {
      console.error('Error creating invoice:', error.response?.data || error.message);
      throw new Error('Failed to create Lightning invoice');
    }
  }

  async checkInvoiceStatus(paymentHash) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/payments/${paymentHash}`,
        {
          headers: {
            'X-Api-Key': this.invoiceKey,
          },
        }
      );

      return {
        paid: response.data.paid,
        details: response.data,
      };
    } catch (error) {
      console.error('Error checking invoice status:', error.response?.data || error.message);
      throw new Error('Failed to check invoice status');
    }
  }

  async generateLNURL(amount, description) {
    // Generate LNURL-pay link
    // This is a simplified version - in production you'd use proper LNURL encoding
    try {
      const invoice = await this.createInvoice(amount, description);
      return {
        lnurl: invoice.payment_request,
        paymentHash: invoice.payment_hash,
        checkingId: invoice.checking_id,
      };
    } catch (error) {
      console.error('Error generating LNURL:', error.message);
      throw error;
    }
  }
}

export default new LNbitsService();
