import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const config = {
  // Configuration du serveur
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8081'
  },

  // Configuration LNbits
  lnbits: {
    url: process.env.LNBITS_URL || 'http://localhost:5000',
    apiKey: process.env.LNBITS_API_KEY || ''
  },

  // Configuration Bitcoin
  bitcoin: {
    network: process.env.BITCOIN_NETWORK || 'testnet'
  }
};

export default config;
