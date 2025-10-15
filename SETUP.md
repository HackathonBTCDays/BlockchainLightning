# Complete Setup Guide

This guide walks you through setting up the complete Lightning Certificate system from scratch.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Lightning wallet app on your phone (Phoenix, Breez, Blue Wallet, etc.)

For mobile development, you'll also need:
- [ ] Xcode (for iOS development) or Android Studio (for Android)
- [ ] iOS Simulator or Android Emulator set up

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/HackathonBTCDays/BlockchainLightning.git
cd BlockchainLightning
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` file with your preferred text editor:

```bash
# macOS/Linux
nano .env

# or
vim .env

# Windows
notepad .env
```

#### Get LNbits Credentials

1. Visit https://legend.lnbits.com
2. Click "New Wallet" or use an existing wallet
3. Once in the wallet, click on "API Info" or look for API keys
4. Copy the following:
   - **Admin Key**: Full access key
   - **Invoice/Read Key**: Key for creating and reading invoices

5. Update your `.env` file:
```env
LNBITS_ADMIN_KEY=your_actual_admin_key_here
LNBITS_INVOICE_KEY=your_actual_invoice_key_here
```

#### Test the Backend

```bash
# Start in development mode
npm run dev

# Server should start on http://localhost:3000
# You should see:
# Server running on port 3000
# Environment: development
# LNbits URL: https://legend.lnbits.com
# Bitcoin Network: testnet
```

#### Verify Backend is Working

Open a new terminal and test:

```bash
# Test health check
curl http://localhost:3000/health

# Should return: {"status":"ok","message":"Server is running"}

# Test certificate types
curl http://localhost:3000/api/certificates/types

# Should return a JSON array of certificate types
```

### 3. Mobile App Setup

#### Install Dependencies

Open a new terminal (keep backend running):

```bash
cd ../mobile
npm install
```

#### Configure API Connection

Edit `mobile/src/config/config.js`:

```javascript
// For iOS Simulator (default)
export const API_BASE_URL = 'http://localhost:3000/api';

// For Android Emulator
// export const API_BASE_URL = 'http://10.0.2.2:3000/api';

// For Physical Device (use your computer's local IP)
// export const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

To find your local IP address:

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

Look for IPv4 Address (e.g., 192.168.1.100)

#### Start Metro Bundler

```bash
npm start
```

#### Run on iOS (macOS only)

In a new terminal:

```bash
cd mobile
npm run ios
```

#### Run on Android

In a new terminal:

```bash
cd mobile
npm run android
```

### 4. Testing the Complete Flow

#### Test Backend Independently

```bash
# Create a payment invoice
curl -X POST http://localhost:3000/api/payments/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "certificateType": "birth",
    "userData": {
      "fullName": "Test User",
      "dateOfBirth": "01/01/1990"
    }
  }'

# Note the payment_hash from the response
# Check payment status (replace with actual hash)
curl http://localhost:3000/api/payments/status/YOUR_PAYMENT_HASH
```

#### Test Mobile App Flow

1. Open the app in simulator/emulator
2. Select a certificate type (e.g., Birth Certificate)
3. Fill in the form with test data
4. On the payment screen, note the Lightning invoice
5. Use your Lightning wallet to scan and pay
6. The app should detect payment and generate the certificate

### 5. Troubleshooting

#### Backend Won't Start

**Error: Port 3000 already in use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Error: LNbits connection failed**
- Verify your API keys in `.env`
- Check internet connection
- Try accessing https://legend.lnbits.com in browser

#### Mobile App Won't Connect to Backend

**iOS Simulator:**
- Use `http://localhost:3000/api`
- Ensure backend is running

**Android Emulator:**
- Use `http://10.0.2.2:3000/api` instead of localhost
- Check firewall settings

**Physical Device:**
- Use your computer's local IP address
- Ensure device and computer are on same WiFi network
- Check firewall allows connections on port 3000

**Certificate Not Displaying:**
- Check console logs for errors
- Verify payment was completed
- Check backend logs for certificate generation errors

#### Metro Bundler Issues

```bash
# Clear cache and restart
npm start -- --reset-cache

# If still having issues
rm -rf node_modules
npm install
npm start
```

#### React Native Build Errors

**iOS:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

**Android:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### 6. Development Tips

#### Hot Reload

Both backend and mobile support hot reload:
- Backend: Uses nodemon, changes auto-restart server
- Mobile: Metro bundler enables hot reload (Cmd+R on iOS, RR on Android)

#### Debugging

**Backend:**
- Check terminal logs
- Use `console.log()` for debugging
- API responses include error messages

**Mobile:**
- Open React Native Debugger (Cmd+D on iOS, Cmd+M on Android)
- Enable "Debug JS Remotely"
- Check Chrome DevTools console

#### API Testing Tools

Install and use Postman or Insomnia for API testing:
- Import endpoints from `backend/README.md`
- Test each endpoint independently
- Verify response formats

### 7. Next Steps

Once everything is working:

1. Test the complete user flow multiple times
2. Try different certificate types
3. Test payment with real Lightning wallet
4. Verify certificate generation
5. Test verification screen

For production deployment:
- See `README.md` for production considerations
- Implement proper authentication
- Use production LNbits instance
- Deploy backend to cloud platform
- Build and publish mobile apps

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend and mobile README files
3. Check server logs for errors
4. Ensure all prerequisites are met
5. Open an issue on GitHub with:
   - Steps to reproduce
   - Error messages
   - Environment details (OS, Node version, etc.)

## Quick Reference Commands

```bash
# Backend
cd backend
npm run dev              # Start development server
npm start               # Start production server

# Mobile
cd mobile
npm start               # Start Metro bundler
npm run ios            # Run on iOS
npm run android        # Run on Android

# Testing
curl http://localhost:3000/health                    # Test backend
curl http://localhost:3000/api/certificates/types   # Get certificate types
```

## Success Checklist

You know everything is working when:

- [ ] Backend starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] Certificate types endpoint returns data
- [ ] Mobile app builds and runs
- [ ] Can navigate between screens
- [ ] Can create payment invoice
- [ ] Can scan QR code with wallet
- [ ] Payment is detected after paying
- [ ] Certificate is generated
- [ ] Can view certificate details
- [ ] Verification screen works

Congratulations! You now have a fully functional Lightning Network certificate system! 🎉
