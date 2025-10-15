# Architecture Documentation

This document describes the architecture and design decisions for the Lightning Certificate system.

## System Overview

The Lightning Certificate system consists of two main components:

1. **Backend (Node.js + Express)**: Handles business logic, payment processing, and certificate generation
2. **Mobile App (React Native)**: User interface for certificate requests and payments

```
┌─────────────────┐
│   Mobile App    │
│  (React Native) │
└────────┬────────┘
         │ REST API
         │ (HTTP/JSON)
         ▼
┌─────────────────┐       ┌──────────────┐
│  Backend Server │◄─────►│   LNbits     │
│   (Express.js)  │       │   Service    │
└────────┬────────┘       └──────────────┘
         │
         │ Document Hash
         ▼
┌─────────────────┐
│  Bitcoin Network│
│    (Testnet)    │
└─────────────────┘
```

## Backend Architecture

### Layer Structure

```
┌──────────────────────────────────────┐
│           API Routes                 │  ← HTTP Endpoints
├──────────────────────────────────────┤
│          Controllers                 │  ← Request Handling
├──────────────────────────────────────┤
│           Services                   │  ← Business Logic
├──────────────────────────────────────┤
│      Utils & Configuration           │  ← Support Functions
└──────────────────────────────────────┘
```

### Component Breakdown

#### 1. Configuration Layer (`src/config/`)
- **config.js**: Environment variables and application settings
- Loads from `.env` file
- Provides centralized configuration access

#### 2. Routes Layer (`src/routes/`)
- **paymentRoutes.js**: Lightning payment endpoints
- **certificateRoutes.js**: Certificate management endpoints
- Maps HTTP requests to controller methods

#### 3. Controllers Layer (`src/controllers/`)
- **paymentController.js**: Handles payment-related requests
  - Creates Lightning invoices
  - Checks payment status
  - Generates LNURL
  
- **certificateController.js**: Handles certificate operations
  - Generates certificates
  - Retrieves certificates
  - Verifies certificates
  - Returns available types

#### 4. Services Layer (`src/services/`)

**lnbitsService.js** - Lightning Network Integration
```javascript
// Responsibilities:
- Create Lightning invoices via LNbits API
- Check payment status
- Generate LNURL-pay links
- Handle LNbits authentication
```

**certificateService.js** - Certificate Generation
```javascript
// Responsibilities:
- Generate PDF certificates using PDFKit
- Create document hashes
- Store certificates on filesystem
- Verify certificate authenticity
```

**bitcoinService.js** - Blockchain Integration
```javascript
// Responsibilities:
- Create SHA-256 document hashes
- Anchor hashes to Bitcoin testnet
- Verify documents against blockchain
- Query transaction status
```

#### 5. Utils Layer (`src/utils/`)
- **database.js**: In-memory data storage
  - Stores payment information
  - Stores certificate metadata
  - Manages relationships between entities

### Data Flow

#### Certificate Purchase Flow

```
1. User Selects Certificate Type
   ↓
2. Backend Creates Payment Invoice (LNbits)
   ↓
3. User Pays Lightning Invoice
   ↓
4. Backend Polls Payment Status
   ↓
5. Payment Confirmed
   ↓
6. Generate Certificate PDF
   ↓
7. Create Document Hash
   ↓
8. Anchor Hash to Bitcoin Testnet
   ↓
9. Return Certificate to User
```

#### Certificate Verification Flow

```
1. User Provides Certificate ID
   ↓
2. Backend Looks Up Certificate
   ↓
3. Retrieve Document Hash
   ↓
4. Verify Against Blockchain
   ↓
5. Return Verification Result
```

## Mobile App Architecture

### Component Structure

```
┌─────────────────────────────────────┐
│        Navigation Container          │
├─────────────────────────────────────┤
│           App Context                │  ← Global State
├─────────────────────────────────────┤
│            Screens                   │  ← UI Components
├─────────────────────────────────────┤
│           Services                   │  ← API Calls
└─────────────────────────────────────┘
```

### Screen Components

1. **HomeScreen**
   - Displays available certificate types
   - Fetches from `/api/certificates/types`
   - Navigation to form or verification

2. **CertificateFormScreen**
   - User information input form
   - Validation of required fields
   - Saves data to context
   - Navigation to payment

3. **PaymentScreen**
   - Creates Lightning invoice
   - Displays payment amount and invoice
   - Polls payment status
   - Navigation to QR scanner
   - Triggers certificate generation on payment

4. **QRScannerScreen**
   - Displays Lightning invoice as QR code
   - Allows copying invoice string
   - Instructions for wallet payment

5. **PDFViewerScreen**
   - Displays certificate details
   - Shows blockchain anchor information
   - Download certificate option
   - Verification status

6. **VerificationScreen**
   - Input certificate ID
   - Call verification API
   - Display verification results
   - Show blockchain details

### State Management

**AppContext** (React Context API)
```javascript
{
  selectedCertificateType: Object,  // Current certificate being purchased
  userData: Object,                  // Form data from user
  paymentInfo: Object,               // Payment invoice details
  certificateInfo: Object,           // Generated certificate details
  resetState: Function               // Clear all state
}
```

### API Service Layer

**src/services/api.js**
- Axios-based HTTP client
- Centralized API endpoint definitions
- Error handling and response parsing
- Timeout management

## Data Models

### Payment Model
```javascript
{
  payment_hash: String,      // Unique payment identifier
  amount: Number,            // Amount in satoshis
  certificateType: String,   // Type of certificate
  userData: Object,          // Associated user data
  status: String,            // pending | paid | completed
  paymentRequest: String,    // BOLT11 invoice
  checkingId: String,        // LNbits internal ID
  createdAt: String,         // ISO timestamp
  updatedAt: String,         // ISO timestamp
  certificateId: String      // Generated certificate ID (after completion)
}
```

### Certificate Model
```javascript
{
  certificateId: String,     // Unique certificate identifier
  filename: String,          // PDF filename
  filepath: String,          // Full path to PDF
  documentHash: String,      // SHA-256 hash of document
  blockchainAnchor: {
    txId: String,            // Bitcoin transaction ID
    hash: String,            // Document hash
    network: String,         // testnet | mainnet
    timestamp: String,       // ISO timestamp
    blockHeight: Number,     // Block height (null until confirmed)
    metadata: Object         // Additional metadata
  },
  userData: Object,          // User information
  certificateType: String,   // Type of certificate
  paymentHash: String,       // Associated payment
  createdAt: String          // ISO timestamp
}
```

## Security Considerations

### Current Implementation (Demo)
- No authentication
- In-memory storage
- Open CORS policy
- Simulated blockchain anchoring

### Production Requirements

1. **Authentication & Authorization**
   - Implement JWT tokens
   - API key authentication
   - Rate limiting per user

2. **Data Storage**
   - Use MongoDB or PostgreSQL
   - Encrypt sensitive data
   - Backup strategy

3. **Network Security**
   - HTTPS only
   - Restricted CORS
   - Input sanitization
   - SQL injection prevention

4. **Blockchain Integration**
   - Real Bitcoin transaction creation
   - OP_RETURN data embedding
   - Transaction confirmation monitoring
   - Proper key management

5. **Monitoring & Logging**
   - Request logging
   - Error tracking (Sentry)
   - Performance monitoring
   - Audit trail

## Scalability Considerations

### Current Limitations
- Single server instance
- In-memory storage
- No load balancing
- No caching

### Scaling Strategy

1. **Horizontal Scaling**
   - Deploy multiple backend instances
   - Use load balancer (nginx)
   - Shared database
   - Session management

2. **Caching**
   - Redis for session storage
   - Cache certificate types
   - Cache payment status
   - CDN for static assets

3. **Database**
   - Connection pooling
   - Read replicas
   - Indexes on frequently queried fields
   - Pagination for large datasets

4. **Queue System**
   - RabbitMQ or Redis for job queue
   - Async certificate generation
   - Background blockchain anchoring
   - Webhook processing

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **PDF Generation**: PDFKit
- **Bitcoin**: bitcoinjs-lib
- **HTTP Client**: Axios
- **Environment**: dotenv

### Mobile
- **Framework**: React Native
- **Navigation**: React Navigation
- **State**: Context API
- **HTTP Client**: Axios
- **UI**: React Native components

### External Services
- **Lightning**: LNbits
- **Blockchain**: Bitcoin Testnet
- **API**: Blockstream Testnet API

## Design Patterns

1. **Service Layer Pattern**
   - Business logic separated from controllers
   - Reusable service methods
   - Easy to test and mock

2. **Repository Pattern**
   - Data access abstraction
   - Easy to switch databases
   - Centralized data operations

3. **Dependency Injection**
   - Services imported as needed
   - Testable components
   - Loose coupling

4. **MVC Pattern**
   - Model: Data structures and services
   - View: Mobile app screens
   - Controller: Request handlers

## Future Enhancements

1. **Multi-language Support**
   - i18n internationalization
   - Multiple certificate languages
   - Localized dates and formats

2. **Advanced Features**
   - Batch certificate generation
   - Certificate templates
   - Custom branding
   - Digital signatures with private keys

3. **Integration Options**
   - Webhook notifications
   - REST API for third parties
   - GraphQL API
   - WebSocket for real-time updates

4. **Mobile Features**
   - Offline support
   - Local certificate storage
   - Push notifications
   - Biometric authentication

5. **Analytics**
   - Usage statistics
   - Payment analytics
   - User behavior tracking
   - Performance metrics

## Development Workflow

```
1. Feature Development
   ↓
2. Local Testing
   ↓
3. Code Review
   ↓
4. Integration Testing
   ↓
5. Deployment to Staging
   ↓
6. User Acceptance Testing
   ↓
7. Production Deployment
```

## Testing Strategy

1. **Unit Tests**
   - Service layer methods
   - Utility functions
   - Data models

2. **Integration Tests**
   - API endpoints
   - Database operations
   - External service mocks

3. **E2E Tests**
   - Complete user flows
   - Payment scenarios
   - Certificate generation

4. **Manual Testing**
   - UI/UX validation
   - Cross-platform testing
   - Payment with real wallets

## Deployment Architecture

### Development
```
Local Machine → Backend (localhost:3000)
             → Mobile (Simulator/Emulator)
```

### Production
```
GitHub → CI/CD Pipeline → Docker Container → Cloud Provider
                                          → Load Balancer → Multiple Instances
                                          → Database Cluster
                                          → File Storage (S3)
```

## Monitoring & Operations

### Key Metrics
- Request rate (req/sec)
- Response time (ms)
- Error rate (%)
- Payment success rate (%)
- Certificate generation time (sec)
- Database query time (ms)

### Logging
- Application logs → Centralized logging (ELK Stack)
- Access logs → Analysis and monitoring
- Error logs → Alerting and notification

### Alerts
- High error rate
- Slow response time
- Payment failures
- Certificate generation failures
- Database connection issues

## Conclusion

This architecture provides a solid foundation for a Lightning Network-powered certificate system. It's designed to be:

- **Modular**: Easy to modify or replace components
- **Scalable**: Can handle increased load with proper infrastructure
- **Maintainable**: Clear separation of concerns
- **Testable**: Services can be unit tested independently
- **Extensible**: New features can be added without major refactoring

For production use, implement the security and scalability enhancements outlined above.
