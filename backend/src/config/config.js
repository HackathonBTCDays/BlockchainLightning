import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  lnbits: {
    url: process.env.LNBITS_URL || 'https://legend.lnbits.com',
    adminKey: process.env.LNBITS_ADMIN_KEY || '',
    invoiceKey: process.env.LNBITS_INVOICE_KEY || '',
  },
  bitcoin: {
    network: process.env.BITCOIN_NETWORK || 'testnet',
    rpcUrl: process.env.BITCOIN_RPC_URL || 'https://blockstream.info/testnet/api',
  },
  env: process.env.NODE_ENV || 'development',
};
