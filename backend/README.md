# Lightning Certificate Backend

Node.js Express backend for the Lightning Network certificate payment system.

## Features

- Lightning Network payment integration via LNbits
- LNURL-pay support
- PDF certificate generation
- Bitcoin testnet anchoring for document hashes
- Certificate verification

## Prerequisites

- Node.js 18+ and npm
- LNbits instance (or access to legend.lnbits.com)
- Bitcoin testnet access (optional)

## Installation

```bash
cd backend
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
PORT=3000
LNBITS_URL=https://legend.lnbits.com
LNBITS_ADMIN_KEY=your_admin_key_here
LNBITS_INVOICE_KEY=your_invoice_key_here
BITCOIN_NETWORK=testnet
BITCOIN_RPC_URL=https://blockstream.info/testnet/api
NODE_ENV=development
```

### Getting LNbits Keys

1. Go to https://legend.lnbits.com (or your LNbits instance)
2. Create a new wallet or use an existing one
3. Copy the Admin Key and Invoice/Read Key from the API Info section

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on http://localhost:3000

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Certificate Types
- `GET /api/certificates/types` - Get available certificate types

### Payment
- `POST /api/payments/invoice` - Create a Lightning invoice
  ```json
  {
    "amount": 50000,
    "certificateType": "birth",
    "userData": { ... }
  }
  ```

- `GET /api/payments/status/:payment_hash` - Check payment status

- `POST /api/payments/lnurl` - Generate LNURL for payment

### Certificates
- `POST /api/certificates/generate` - Generate certificate after payment
  ```json
  {
    "payment_hash": "...",
    "userData": { ... },
    "certificateType": "birth"
  }
  ```

- `GET /api/certificates/:certificateId` - Download certificate PDF

- `POST /api/certificates/verify` - Verify certificate authenticity
  ```json
  {
    "certificateId": "...",
    "documentHash": "..."
  }
  ```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   │   ├── lnbitsService.js    # LNbits integration
│   │   ├── bitcoinService.js   # Bitcoin anchoring
│   │   └── certificateService.js # Certificate generation
│   ├── utils/          # Utility functions
│   └── index.js        # Express app entry point
├── certificates/       # Generated PDFs (gitignored)
├── .env.example        # Environment variables template
└── package.json
```

## Testing

You can test the API using curl or tools like Postman:

```bash
# Get certificate types
curl http://localhost:3000/api/certificates/types

# Create a payment invoice
curl -X POST http://localhost:3000/api/payments/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "certificateType": "birth",
    "userData": {
      "fullName": "John Doe",
      "dateOfBirth": "01/01/1990"
    }
  }'
```

## Notes

- The Bitcoin anchoring is simulated for demo purposes
- In production, implement actual Bitcoin transaction creation with OP_RETURN
- Consider using a proper database instead of in-memory storage
- Add authentication and rate limiting for production use
