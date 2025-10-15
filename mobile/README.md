# Lightning Certificate Mobile App

React Native mobile application for paying for administrative certificates using the Bitcoin Lightning Network.

## Features

- Browse available certificate types
- Fill in personal information form
- Pay with Lightning Network (via LNURL-pay)
- QR code display for wallet scanning
- Receive signed, verifiable PDF certificates
- Verify certificate authenticity via blockchain

## Prerequisites

- Node.js 18+ and npm
- React Native development environment set up
- iOS Simulator or Android Emulator (or physical device)
- Backend server running (see backend/README.md)

## Installation

```bash
cd mobile
npm install
```

## Configuration

Update the API base URL in `src/config/config.js`:

```javascript
export const API_BASE_URL = 'http://localhost:3000/api';
// For physical device, use your computer's IP address:
// export const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

## Running the App

### iOS (macOS only)
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Development Server
```bash
npm start
```

## App Flow

1. **Home Screen**: Browse and select certificate type
2. **Certificate Form**: Enter personal information
3. **Payment Screen**: Create Lightning invoice and pay
4. **QR Scanner**: Display QR code for wallet scanning
5. **PDF Viewer**: View and download generated certificate
6. **Verification**: Verify certificate authenticity

## Project Structure

```
mobile/
├── src/
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.js
│   │   ├── CertificateFormScreen.js
│   │   ├── PaymentScreen.js
│   │   ├── QRScannerScreen.js
│   │   ├── PDFViewerScreen.js
│   │   └── VerificationScreen.js
│   ├── navigation/        # Navigation setup
│   ├── services/          # API services
│   ├── context/           # React Context for state
│   ├── config/            # App configuration
│   └── components/        # Reusable components
├── App.js                 # Root component
├── index.js              # Entry point
└── package.json
```

## Dependencies

- **@react-navigation/native**: Navigation between screens
- **axios**: HTTP client for API calls
- **react-native-qrcode-scanner**: QR code scanning
- **react-native-pdf**: PDF viewing
- **react-native-safe-area-context**: Safe area handling

## Notes

### QR Code Generation
To display actual QR codes, install:
```bash
npm install react-native-qrcode-svg react-native-svg
```

Then update `QRScannerScreen.js` to use the library.

### PDF Viewing
The PDF viewer requires platform-specific setup. For full functionality:

**iOS**:
```bash
cd ios && pod install
```

**Android**:
Additional configuration may be needed in `android/app/build.gradle`

### Camera Permissions
For QR scanning functionality, add permissions:

**iOS** (`ios/YourApp/Info.plist`):
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan Lightning invoices</string>
```

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Build Errors
```bash
cd android && ./gradlew clean
# or
cd ios && rm -rf Pods && pod install
```

### API Connection Issues
- Ensure backend server is running
- Check API_BASE_URL points to correct address
- On physical device, use your computer's local IP address
- Ensure firewall allows connections on port 3000

## Testing

The app can be tested with:
1. Mock LNbits credentials in backend
2. Bitcoin testnet for blockchain anchoring
3. Test Lightning wallets (e.g., Phoenix, Breez)

## Production Considerations

Before deploying to production:

1. Update API_BASE_URL to production backend
2. Implement proper error handling and logging
3. Add analytics and crash reporting
4. Implement secure storage for sensitive data
5. Add proper loading states and offline support
6. Test thoroughly on both iOS and Android
7. Follow app store guidelines for both platforms
