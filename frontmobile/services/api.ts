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

// Mock API calls
const mockApiCall = (data: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
};

export const getCertificateStats = async () => {
  return mockApiCall({
    total: { value: 15, change: '+10%' },
    valid: { value: 8, change: '+5%' },
    pending: { value: 5, change: '-2%' },
    expiringSoon: { value: 2, change: '+1%' },
  });
};

export const getRecentCertificates = async () => {
  return mockApiCall([
    { id: '1', name: 'Software Engineering Degree', date: '2023-10-25', timeline: { currentStep: 3, steps: [{ title: 'Data Validation', description: '' }, { title: 'Certificate Issuance', description: '' }, { title: 'Blockchain Anchoring', description: '' }] }, issuer: 'Tech University', status: 'Verified', image: 'https://img.freepik.com/vecteurs-libre/certificat-luxe-dore-gradient_52683-70557.jpg?semt=ais_hybrid&w=740&q=80' },
    { id: '2', name: 'Project Management Professional', date: '2023-10-20', timeline: { currentStep: 1, steps: [{ title: 'Data Validation', description: '' }, { title: 'Certificate Issuance', description: '' }, { title: 'Blockchain Anchoring', description: '' }] }, issuer: 'Global PM Institute', status: 'Verified', image: 'https://img.freepik.com/vecteurs-libre/certificat-luxe-dore-gradient_52683-70557.jpg?semt=ais_hybrid&w=740&q=80' },
    { id: '3', name: 'Data Science Certification', date: '2023-10-15', timeline: { currentStep: 2, steps: [{ title: 'Data Validation', description: '' }, { title: 'Certificate Issuance', description: '' }, { title: 'Blockchain Anchoring', description: '' }] }, issuer: 'Data Academy', status: 'Pending', image: 'https://img.freepik.com/vecteurs-libre/certificat-luxe-dore-gradient_52683-70557.jpg?semt=ais_hybrid&w=740&q=80' },
  ]);
};

export const getAllCertificates = async () => {
  return mockApiCall([
    { id: '1', name: 'Software Engineering Degree', status: 'Valid' },
    { id: '2', name: 'Project Management Professional', status: 'Valid' },
    { id: '3', name: 'Data Science Certification', status: 'Pending' },
    { id: '4', name: 'Cybersecurity Specialist', status: 'Expired' },
    { id: '5', name: 'Advanced Cryptography', status: 'Valid' },
    { id: '6', name: 'Blockchain Developer', status: 'Expiring Soon' },
    { id: '7', name: 'AI and Machine Learning', status: 'Refused', reason: 'Invalid documentation provided.' },
  ]);
};

export const getCertificateDetails = async (id: string) => {
  return mockApiCall({
    issuer: 'Tech University',
    id,
    issuedDate: '15 mars 2024, 10:30',
    hash: '1234...7890',
    txid: '0xabcdef...123456',
    qrValue: `https://example.com/verify/${id}`,
    status: 'Valid',
    reason: '',
    timeline: {
      currentStep: 3,
      steps: [
        { title: 'Data Validation', description: 'Verifying document integrity and data accuracy.' },
        { title: 'Certificate Issuance', description: 'Generating the cryptographic certificate.' },
        { title: 'Blockchain Anchoring', description: 'Securing the certificate on the blockchain.' },
      ],
    },
  });
};

export const getServices = async () => {
  return mockApiCall([
    { id: '1', title: 'Extrait de naissance', name: 'Birth Certificate', priceSats: 1000, priceFcfa: 350, image: 'https://cmsphoto.ww-cdn.com/superstatic/16216/art/grande/42887493-35586288.jpg?v=1582029747' },
    { id: '2', title: 'Casier judiciaire', name: 'Criminal Record', priceSats: 2000, priceFcfa: 700, image: 'https://cmsphoto.ww-cdn.com/superstatic/16216/art/grande/42887493-35586288.jpg?v=1582029747' },
    { id: '3', title: 'Extrait de mariage', name: 'Marriage Certificate', priceSats: 1500, priceFcfa: 525, image: 'https://cmsphoto.ww-cdn.com/superstatic/16216/art/grande/42887493-35586288.jpg?v=1582029747' },
    { id: '4', title: 'Certificat de résidence', name: 'Residence Certificate', priceSats: 800, priceFcfa: 280, image: 'https://cmsphoto.ww-cdn.com/superstatic/16216/art/grande/42887493-35586288.jpg?v=1582029747' },
    { id: '5', title: 'Certificat d\'identité', name: 'Identity Certificate', priceSats: 1200, priceFcfa: 420, image: 'https://cmsphoto.ww-cdn.com/superstatic/16216/art/grande/42887493-35586288.jpg?v=1582029747' },
  ]);
};

// LNbits Extensions API
export const getLnbitsExtensions = async () => {
  return mockApiCall({
    extensions: [
      { name: 'LNURLp', enabled: true, description: 'Paiements Lightning statiques' },
      { name: 'SatsPay', enabled: true, description: 'Gestion de charges et paiements' },
      { name: 'TPoS', enabled: true, description: 'Terminal Point de Vente' },
      { name: 'User Manager', enabled: true, description: 'Gestion multi-utilisateurs' },
      { name: 'Bolt Cards', enabled: false, description: 'Paiements NFC' },
      { name: 'Decoder', enabled: true, description: 'Analyse des factures Lightning' },
      { name: 'Support Tickets', enabled: true, description: 'Système de support client' },
      { name: 'Events', enabled: false, description: 'Gestion des événements' },
      { name: 'SMTP', enabled: true, description: 'Envoi d\'emails' },
      { name: 'Split Payments', enabled: false, description: 'Répartition des paiements' },
      { name: 'Offline Shop', enabled: false, description: 'Boutique hors ligne' },
      { name: 'Stream Alert', enabled: true, description: 'Notifications en temps réel' },
      { name: 'Invoices', enabled: true, description: 'Facturation avancée' },
      { name: 'Server Scrub', enabled: true, description: 'Filtrage et sécurité' },
      { name: 'LN Calendar', enabled: false, description: 'Calendrier Lightning' },
      { name: 'Scheduler', enabled: true, description: 'Programmation des paiements' },
      { name: 'Auction House', enabled: false, description: 'Système d\'enchères' },
      { name: 'Paid Review', enabled: false, description: 'Revues payantes' },
      { name: 'Sellcoins', enabled: false, description: 'Vente de cryptomonnaies' },
      { name: 'LNPoS', enabled: false, description: 'Terminal point de vente offline' },
    ]
  });
};

export const toggleLnbitsExtension = async (extensionName: string, enabled: boolean) => {
  return mockApiCall({
    success: true,
    extension: extensionName,
    enabled: enabled,
    message: `Extension ${extensionName} ${enabled ? 'activée' : 'désactivée'} avec succès`
  });
};

// TPoS (Terminal Point of Sale) API
export const getTPoSTerminals = async () => {
  return mockApiCall([
    { id: '1', name: 'Terminal Principal', location: 'Mairie de Dakar', status: 'active', transactions: 156 },
    { id: '2', name: 'Terminal Annex', location: 'Mairie de Thiès', status: 'active', transactions: 89 },
    { id: '3', name: 'Terminal Mobile', location: 'Service Mobile', status: 'inactive', transactions: 23 },
  ]);
};

export const createTPoSTerminal = async (terminalData: any) => {
  return mockApiCall({
    success: true,
    terminal: { id: '4', ...terminalData, status: 'active', transactions: 0 }
  });
};

// User Manager API
export const getUsers = async () => {
  return mockApiCall([
    { id: '1', name: 'Amadou Diallo', email: 'amadou@example.com', role: 'admin', status: 'active' },
    { id: '2', name: 'Fatou Sarr', email: 'fatou@example.com', role: 'agent', status: 'active' },
    { id: '3', name: 'Moussa Ba', email: 'moussa@example.com', role: 'user', status: 'pending' },
  ]);
};

export const createUser = async (userData: any) => {
  return mockApiCall({
    success: true,
    user: { id: '4', ...userData, status: 'pending' }
  });
};

export const updateUserRole = async (userId: string, role: string) => {
  return mockApiCall({
    success: true,
    message: `Rôle de l'utilisateur mis à jour vers ${role}`
  });
};

// Support Tickets API
export const getSupportTickets = async () => {
  return mockApiCall([
    { id: '1', title: 'Problème de paiement', status: 'open', priority: 'high', category: 'technical' },
    { id: '2', title: 'Certificat non reçu', status: 'resolved', priority: 'medium', category: 'billing' },
  ]);
};

export const createSupportTicket = async (ticketData: any) => {
  return mockApiCall({
    success: true,
    ticket: { id: '3', ...ticketData, status: 'open', createdAt: new Date().toISOString() }
  });
};

// Bolt Cards API
export const getBoltCards = async () => {
  return mockApiCall([
    { id: '1', name: 'Carte Principale', status: 'active', balance: 50000, lastUsed: '2024-01-15' },
    { id: '2', name: 'Carte Backup', status: 'inactive', balance: 0, lastUsed: '2024-01-10' },
  ]);
};

export const createBoltCard = async (cardData: any) => {
  return mockApiCall({
    success: true,
    card: { id: '3', ...cardData, status: 'active', balance: 0 }
  });
};

// SMTP API
export const sendEmail = async (emailData: any) => {
  return mockApiCall({
    success: true,
    message: 'Email envoyé avec succès'
  });
};

export const getEmailTemplates = async () => {
  return mockApiCall([
    { id: '1', name: 'Confirmation de certificat', subject: 'Votre certificat est prêt', template: 'certificate_confirmation' },
    { id: '2', name: 'Rappel de paiement', subject: 'Paiement en attente', template: 'payment_reminder' },
  ]);
};

// Stream Alert API
export const getStreamAlerts = async () => {
  return mockApiCall([
    { id: '1', name: 'Paiement reçu', enabled: true, webhook: 'https://example.com/webhook' },
    { id: '2', name: 'Certificat généré', enabled: true, webhook: 'https://example.com/webhook' },
  ]);
};

export const createStreamAlert = async (alertData: any) => {
  return mockApiCall({
    success: true,
    alert: { id: '3', ...alertData, enabled: true }
  });
};

export default api;
