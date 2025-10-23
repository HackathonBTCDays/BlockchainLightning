import axios from 'axios';
import { API_BASE_URL } from '../config/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Certificate Types
export const getCertificateTypes = async () => {
  try {
    const response = await api.get('/certificates/types');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch certificate types');
  }
};

// Payment APIs
export const createPaymentInvoice = async (amount, certificateType, userData) => {
  try {
    const response = await api.post('/payments/invoice', {
      amount,
      certificateType,
      userData,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create payment invoice');
  }
};

export const checkPaymentStatus = async (paymentHash) => {
  try {
    const response = await api.get(`/payments/status/${paymentHash}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to check payment status');
  }
};

// Certificate APIs
export const generateCertificate = async (paymentHash, userData, certificateType) => {
  try {
    const response = await api.post('/certificates/generate', {
      payment_hash: paymentHash,
      userData,
      certificateType,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate certificate');
  }
};

export const downloadCertificate = async (certificateId) => {
  try {
    const response = await api.get(`/certificates/${certificateId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to download certificate');
  }
};

export const verifyCertificate = async (certificateId, documentHash) => {
  try {
    const response = await api.post('/certificates/verify', {
      certificateId,
      documentHash,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to verify certificate');
  }
};

export default api;
