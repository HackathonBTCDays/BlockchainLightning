# BlockchainLightning

A React Native mobile application for paying for administrative certificates (birth extracts, marriage certificates, etc.) using the Bitcoin Lightning Network. The system provides instant, signed, and blockchain-verified PDF certificates.

## 🚀 Features

### Mobile App (React Native)
- Browse and select certificate types
- User-friendly form for personal information
- Lightning Network payment integration
- QR code display for wallet scanning
- PDF certificate viewer
- Certificate verification screen
- Real-time payment status checking

### Backend (Node.js + Express)
- LNbits/LNURL-pay integration
- Lightning invoice generation
- PDF certificate generation with PDFKit
- Bitcoin testnet anchoring for document hashes
- Certificate verification API
- RESTful API architecture

### Blockchain Integration
- Document hash anchoring on Bitcoin testnet
- Cryptographic verification of certificates
- Immutable proof of authenticity
- Transaction ID tracking

## 📋 Prerequisites

- Node.js 18+ and npm
- React Native development environment
- LNbits instance (or access to legend.lnbits.com)
- Lightning wallet for testing (Phoenix, Breez, etc.)
- iOS Simulator or Android Emulator (optional)

## 🛠️ Installation

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your LNbits credentials
# Get your keys from https://legend.lnbits.com

# Start the server
npm run dev
```

The backend will run on http://localhost:3000

### Mobile App Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Update API_BASE_URL in src/config/config.js
# Then start the app
npm start
```

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

## 🏗️ Project Structure

```
BlockchainLightning/
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # API controllers
│   │   ├── routes/         # Route definitions
│   │   ├── services/       # Business logic
│   │   │   ├── lnbitsService.js      # LNbits integration
│   │   │   ├── bitcoinService.js     # Bitcoin anchoring
│   │   │   └── certificateService.js # PDF generation
│   │   ├── utils/          # Utilities
│   │   └── index.js        # Entry point
│   ├── certificates/       # Generated PDFs
│   └── README.md
│
├── mobile/                  # React Native mobile app
│   ├── src/
│   │   ├── screens/        # App screens
│   │   │   ├── HomeScreen.js
│   │   │   ├── CertificateFormScreen.js
│   │   │   ├── PaymentScreen.js
│   │   │   ├── QRScannerScreen.js
│   │   │   ├── PDFViewerScreen.js
│   │   │   └── VerificationScreen.js
│   │   ├── navigation/     # Navigation setup
│   │   ├── services/       # API services
│   │   ├── context/        # State management
│   │   └── config/         # Configuration
│   ├── App.js
│   └── README.md
│
└── README.md               # This file
```

## 🔧 Configuration

### Backend Configuration (.env)

```env
PORT=3000
LNBITS_URL=https://legend.lnbits.com
LNBITS_ADMIN_KEY=your_admin_key_here
LNBITS_INVOICE_KEY=your_invoice_key_here
BITCOIN_NETWORK=testnet
BITCOIN_RPC_URL=https://blockstream.info/testnet/api
NODE_ENV=development
```

### Mobile Configuration

Update `mobile/src/config/config.js`:
```javascript
export const API_BASE_URL = 'http://localhost:3000/api';
// For physical device, use your computer's IP:
// export const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

## 📱 Usage Flow

1. **Select Certificate Type**: Choose from birth, marriage, death, residence, or identity certificates
2. **Fill Form**: Enter required personal information
3. **Create Payment**: Generate Lightning invoice for the certificate cost
4. **Pay Invoice**: Scan QR code with Lightning wallet and complete payment
5. **Receive Certificate**: Certificate is automatically generated after payment confirmation
6. **Download PDF**: View and download the signed PDF certificate
7. **Verify**: Use the verification screen to check certificate authenticity on blockchain

## 🔌 API Endpoints

### Certificates
- `GET /api/certificates/types` - Get available certificate types
- `POST /api/certificates/generate` - Generate certificate after payment
- `GET /api/certificates/:id` - Download certificate PDF
- `POST /api/certificates/verify` - Verify certificate authenticity

### Payments
- `POST /api/payments/invoice` - Create Lightning invoice
- `GET /api/payments/status/:hash` - Check payment status
- `POST /api/payments/lnurl` - Generate LNURL

## 🧪 Testing

### Test the Backend
```bash
cd backend
npm run dev

# Test API
curl http://localhost:3000/api/certificates/types
```

### Test the Mobile App
1. Start the backend server
2. Launch the mobile app in simulator/emulator
3. Navigate through the flow
4. Use a testnet Lightning wallet for payments

## 🔐 Security Notes

- Never commit `.env` files with real credentials
- Use environment-specific configurations
- Implement rate limiting in production
- Add authentication for sensitive endpoints
- Validate all user inputs
- Use HTTPS in production

## 🚀 Production Deployment

### Backend
- Deploy to cloud provider (AWS, Heroku, DigitalOcean)
- Use proper database (MongoDB, PostgreSQL)
- Implement actual Bitcoin transaction creation
- Set up monitoring and logging
- Configure proper CORS policies

### Mobile App
- Build production APK/IPA
- Submit to Google Play Store / Apple App Store
- Configure proper app signing
- Set up crash reporting (Sentry, Firebase)
- Implement analytics

## 📚 Additional Resources

- [LNbits Documentation](https://lnbits.com/docs)
- [Lightning Network](https://lightning.network/)
- [React Native Documentation](https://reactnative.dev/)
- [Bitcoin Developer Guide](https://developer.bitcoin.org/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 🙏 Acknowledgments

- LNbits for Lightning Network integration
- Bitcoin community for testnet access
- React Native community for mobile framework

## 📞 Support

For issues and questions, please open an issue in the GitHub repository.

---

**Note**: This is a demo/hackathon project. For production use, implement proper security measures, use a real database, and thoroughly test all components.