# Quick Start Guide

Get the Lightning Certificate system up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm installed
- LNbits account (free at https://legend.lnbits.com)

## Backend Setup (2 minutes)

```bash
# 1. Clone and navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Edit .env with your LNbits keys
# Get keys from: https://legend.lnbits.com
nano .env

# 5. Start the server
npm run dev
```

You should see:
```
Server running on port 3000
Environment: development
LNbits URL: https://legend.lnbits.com
Bitcoin Network: testnet
```

## Mobile Setup (2 minutes)

Open a new terminal:

```bash
# 1. Navigate to mobile
cd mobile

# 2. Install dependencies
npm install

# 3. Start Metro bundler
npm start

# 4. In another terminal, run the app
npm run ios
# or
npm run android
```

## Test the System (1 minute)

### Test Backend API

```bash
# Open a new terminal
cd backend

# Run test script
./test-api.sh
```

Expected output:
```
✓ PASSED: Health check endpoint
✓ PASSED: Get certificate types
...
```

### Test Mobile App

1. App should open in simulator/emulator
2. You should see "Lightning Certificates" home screen
3. Tap on a certificate type
4. Fill in the form
5. Create a payment invoice

## Common Issues

### Backend won't start

**Error: Port 3000 already in use**
```bash
lsof -i :3000
kill -9 <PID>
```

**Error: Cannot find module**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Mobile won't connect to backend

**iOS Simulator:**
- Use `http://localhost:3000/api` in config

**Android Emulator:**
- Use `http://10.0.2.2:3000/api` in config

**Physical Device:**
```bash
# Find your computer's IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Update mobile/src/config/config.js
export const API_BASE_URL = 'http://YOUR_IP:3000/api';
```

### LNbits connection fails

1. Go to https://legend.lnbits.com
2. Create a wallet (or use existing)
3. Click "API Info"
4. Copy both keys:
   - Admin Key
   - Invoice/Read Key
5. Update `.env` file
6. Restart backend: `npm run dev`

## Next Steps

### For Development

1. Read [SETUP.md](SETUP.md) for detailed instructions
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand the code
3. Check [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) for API details
4. Read [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

### For Testing

1. Get a Lightning wallet:
   - **iOS**: Phoenix Wallet, Blue Wallet
   - **Android**: Phoenix Wallet, Breez
   
2. Test the complete flow:
   - Select certificate type
   - Fill in personal information
   - Generate Lightning invoice
   - Pay with your wallet
   - Receive certificate

### For Production

1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Set up production database
3. Configure production LNbits instance
4. Deploy backend to cloud
5. Build mobile apps for stores

## File Structure

```
BlockchainLightning/
├── backend/               # Node.js backend
│   ├── src/              # Source code
│   ├── .env.example      # Environment template
│   └── package.json      # Dependencies
│
├── mobile/               # React Native app
│   ├── src/              # Source code
│   ├── App.js           # Main component
│   └── package.json     # Dependencies
│
├── README.md            # Project overview
├── QUICKSTART.md        # This file
├── SETUP.md             # Detailed setup
└── ARCHITECTURE.md      # System design
```

## Quick Commands Reference

### Backend

```bash
npm run dev          # Start development server
npm start            # Start production server
./test-api.sh       # Run API tests
```

### Mobile

```bash
npm start           # Start Metro bundler
npm run ios         # Run on iOS
npm run android     # Run on Android
```

### Testing

```bash
# Test backend health
curl http://localhost:3000/health

# Get certificate types
curl http://localhost:3000/api/certificates/types
```

## Getting Help

- **Detailed Setup**: See [SETUP.md](SETUP.md)
- **API Docs**: See [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: Open a GitHub issue

## Success Checklist

- [ ] Backend starts without errors
- [ ] Can access http://localhost:3000/health
- [ ] Mobile app builds and runs
- [ ] Can navigate between screens
- [ ] Certificate types load in home screen
- [ ] Can create payment invoice

If all items are checked, you're ready to go! 🎉

## Demo Flow

1. **Home Screen** → Select "Birth Certificate"
2. **Form Screen** → Enter:
   - Full Name: John Doe
   - Date of Birth: 01/01/1990
3. **Payment Screen** → View invoice, tap "Show QR Code"
4. **QR Screen** → Scan with Lightning wallet and pay
5. **Payment Screen** → Tap "Check Payment Status"
6. **PDF Viewer** → View generated certificate
7. **Verification** → Verify certificate with ID

---

**Need help?** Check the other documentation files or open an issue!

Happy building with Lightning! ⚡🪙📜
