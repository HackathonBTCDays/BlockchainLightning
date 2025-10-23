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
    const errorMessage = error instanceof Error ? error.message : (error as any).response?.data?.error || 'Failed to fetch certificate types';
    throw new Error(errorMessage);
  }
};

export const createPaymentInvoice = async (amount: Int16Array, certificateType: any, userData: Record<string, any>) => {
  try {
    const response = await api.post('/payments/invoice', {
      amount,
      certificateType,
      userData,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : (error as any).response?.data?.error || 'Failed to create payment invoice';
    throw new Error(errorMessage);
  }
};
export const checkPaymentStatus = async (paymentHash: never) => {
  try {
    const response = await api.get(`/payments/status/${paymentHash}`);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : (error as any).response?.data?.error || 'Failed to check payment status';
    throw new Error(errorMessage);
  }
};

export const generateCertificate = async (paymentHash: null, userData: Record<string, any>, certificateType: any) => {
  try {
    const response = await api.post('/certificates/generate', {
      payment_hash: paymentHash,
      userData,
      certificateType,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : (error as any).response?.data?.error || 'Failed to generate certificate';
    throw new Error(errorMessage);
  }
};
export const downloadCertificate = async (certificateId: any) => {
  try {
    const response = await api.get(`/certificates/${certificateId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : (error as any).response?.data?.error || 'Failed to download certificate';
    throw new Error(errorMessage);
  }
};
export const verifyCertificate = async (certificateId: string, documentHash: string | undefined) => {
  try {
    const response = await api.post('/certificates/verify', {
      certificateId,
      documentHash,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : (error as any).response?.data?.error || 'Failed to verify certificate';
    throw new Error(errorMessage);
  }
};

export default api;
