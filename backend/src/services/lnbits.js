const axios = require('axios');
const { LNBITS_API_URL, LNBITS_API_KEY } = process.env;

const api = axios.create({
  baseURL: LNBITS_API_URL,
  headers: { 'X-Api-Key': LNBITS_API_KEY }
});

// Vérifier paiement par préimage
exports.verifyPayment = async (preimage) => {
  const { data } = await api.get('/api/v1/payments');
  return data.some(p => p.preimage === preimage && p.paid);
};

// Créer invoice LNURL-pay
exports.createCharge = async (amount, description) => {
  const { data } = await api.post('/satspay/api/v1/charge', {
    amount,
    description
  });
  return data;
};

// Créer lien LNURL-pay statique
exports.createLNURLp = async (name, amount) => {
  const { data } = await api.post('/lnurlp/api/v1/links', {
    description: name,
    amount
  });
  return data;
};
