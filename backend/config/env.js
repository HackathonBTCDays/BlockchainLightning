import {config} from 'dotenv';
config({path:`.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
    PORT, 
    NODE_ENV,
    LNBITS_API_URL,
    LNBITS_API_KEY,
    BITCOIN_RPC_URL,
    BITCOIN_RPC_USER,
    BITCOIN_RPC_PASSWORD,
    PDF_STORAGE_PATH

} = process.env;

// You can add more environment variables as needed