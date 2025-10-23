# API Documentation

Complete API reference for the Lightning Certificate Backend.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, no authentication is required. For production, implement API key authentication or JWT tokens.

## Response Format

All responses are in JSON format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "error": "Error message description"
}
```

## Endpoints

### Health Check

#### GET /health

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## Certificate Endpoints

### Get Certificate Types

#### GET /api/certificates/types

Retrieve all available certificate types and their prices.

**Response:**
```json
{
  "success": true,
  "types": [
    {
      "id": "birth",
      "name": "Birth Certificate Extract",
      "price": 50000
    },
    {
      "id": "marriage",
      "name": "Marriage Certificate Extract",
      "price": 50000
    },
    {
      "id": "death",
      "name": "Death Certificate Extract",
      "price": 50000
    },
    {
      "id": "residence",
      "name": "Certificate of Residence",
      "price": 30000
    },
    {
      "id": "identity",
      "name": "Identity Certificate",
      "price": 40000
    }
  ]
}
```

**Price Units:** Satoshis (1 BTC = 100,000,000 sats)

---

### Generate Certificate

#### POST /api/certificates/generate

Generate a PDF certificate after payment is confirmed.

**Request Body:**
```json
{
  "payment_hash": "abc123...",
  "userData": {
    "fullName": "John Doe",
    "dateOfBirth": "01/01/1990",
    "placeOfBirth": "New York",
    "fatherName": "James Doe",
    "motherName": "Jane Doe",
    "nationality": "American",
    "idNumber": "123456789"
  },
  "certificateType": "birth"
}
```

**Required Fields:**
- `payment_hash` (string): Payment hash from completed Lightning payment
- `userData` (object): Personal information for the certificate
  - `fullName` (string, required)
  - `dateOfBirth` (string, required)
  - Other fields are optional
- `certificateType` (string): One of: birth, marriage, death, residence, identity

**Response:**
```json
{
  "success": true,
  "certificateId": "a1b2c3d4e5f6...",
  "documentHash": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  "blockchainAnchor": {
    "txId": "def456...",
    "hash": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    "network": "testnet",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "blockHeight": null,
    "metadata": {
      "certificateId": "a1b2c3d4e5f6...",
      "certificateType": "birth"
    }
  }
}
```

**Error Responses:**

*400 Bad Request:*
```json
{
  "error": "Payment hash, user data, and certificate type are required"
}
```

*400 Bad Request:*
```json
{
  "error": "Payment not completed"
}
```

---

### Download Certificate

#### GET /api/certificates/:certificateId

Download the generated PDF certificate.

**URL Parameters:**
- `certificateId` (string): The unique certificate ID

**Response:**
- Content-Type: `application/pdf`
- File download: `certificate_{certificateId}.pdf`

**Error Responses:**

*404 Not Found:*
```json
{
  "error": "Certificate not found"
}
```

**Example:**
```bash
curl -O http://localhost:3000/api/certificates/a1b2c3d4e5f6
# Downloads: certificate_a1b2c3d4e5f6.pdf
```

---

### Verify Certificate

#### POST /api/certificates/verify

Verify the authenticity of a certificate against the blockchain.

**Request Body:**
```json
{
  "certificateId": "a1b2c3d4e5f6...",
  "documentHash": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
}
```

**Required Fields:**
- `certificateId` (string): The certificate ID to verify

**Optional Fields:**
- `documentHash` (string): The document hash for additional verification

**Response:**
```json
{
  "success": true,
  "valid": true,
  "certificateId": "a1b2c3d4e5f6...",
  "documentHash": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  "verified": true,
  "message": "Certificate is valid and verified on blockchain"
}
```

**Error Response (Invalid Certificate):**
```json
{
  "success": true,
  "valid": false,
  "error": "Certificate not found"
}
```

---

## Payment Endpoints

### Create Payment Invoice

#### POST /api/payments/invoice

Create a Lightning Network invoice for certificate payment.

**Request Body:**
```json
{
  "amount": 50000,
  "certificateType": "birth",
  "userData": {
    "fullName": "John Doe",
    "dateOfBirth": "01/01/1990"
  }
}
```

**Required Fields:**
- `amount` (number): Payment amount in satoshis
- `certificateType` (string): Type of certificate being purchased

**Optional Fields:**
- `userData` (object): User information to associate with payment

**Response:**
```json
{
  "success": true,
  "payment_hash": "abc123def456...",
  "payment_request": "lnbc500n1p3f2h...",
  "checking_id": "xyz789..."
}
```

**Fields Explained:**
- `payment_hash`: Unique identifier for this payment
- `payment_request`: Lightning invoice (BOLT11) to be paid
- `checking_id`: LNbits internal checking ID

**Error Responses:**

*400 Bad Request:*
```json
{
  "error": "Amount and certificate type are required"
}
```

*500 Internal Server Error:*
```json
{
  "error": "Failed to create payment invoice"
}
```

---

### Check Payment Status

#### GET /api/payments/status/:payment_hash

Check if a Lightning payment has been completed.

**URL Parameters:**
- `payment_hash` (string): The payment hash from invoice creation

**Response (Unpaid):**
```json
{
  "success": true,
  "paid": false,
  "details": {
    "payment_hash": "abc123def456...",
    "checking_id": "xyz789...",
    "pending": true,
    "amount": 50000,
    "memo": "Payment for birth certificate"
  }
}
```

**Response (Paid):**
```json
{
  "success": true,
  "paid": true,
  "details": {
    "payment_hash": "abc123def456...",
    "checking_id": "xyz789...",
    "pending": false,
    "amount": 50000,
    "memo": "Payment for birth certificate",
    "time": 1705318200,
    "bolt11": "lnbc500n1p3f2h..."
  }
}
```

**Error Responses:**

*400 Bad Request:*
```json
{
  "error": "Payment hash is required"
}
```

---

### Generate LNURL

#### POST /api/payments/lnurl

Generate an LNURL for Lightning Network payment.

**Request Body:**
```json
{
  "amount": 50000,
  "description": "Payment for birth certificate"
}
```

**Required Fields:**
- `amount` (number): Payment amount in satoshis

**Optional Fields:**
- `description` (string): Payment description

**Response:**
```json
{
  "success": true,
  "lnurl": "lnbc500n1p3f2h...",
  "payment_hash": "abc123def456...",
  "checking_id": "xyz789..."
}
```

**Note:** This is a simplified LNURL implementation. Production apps should implement full LNURL-pay protocol.

---

## Complete Flow Example

### 1. Get Available Certificate Types

```bash
curl http://localhost:3000/api/certificates/types
```

### 2. Create Payment Invoice

```bash
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

Response will include `payment_request` (Lightning invoice) and `payment_hash`.

### 3. Pay the Invoice

Use a Lightning wallet to pay the `payment_request`.

### 4. Check Payment Status

```bash
curl http://localhost:3000/api/payments/status/abc123def456...
```

Poll this endpoint until `paid: true`.

### 5. Generate Certificate

```bash
curl -X POST http://localhost:3000/api/certificates/generate \
  -H "Content-Type: application/json" \
  -d '{
    "payment_hash": "abc123def456...",
    "userData": {
      "fullName": "John Doe",
      "dateOfBirth": "01/01/1990",
      "placeOfBirth": "New York",
      "fatherName": "James Doe",
      "motherName": "Jane Doe",
      "nationality": "American",
      "idNumber": "123456789"
    },
    "certificateType": "birth"
  }'
```

Response includes `certificateId`.

### 6. Download Certificate

```bash
curl -O http://localhost:3000/api/certificates/a1b2c3d4e5f6...
```

### 7. Verify Certificate

```bash
curl -X POST http://localhost:3000/api/certificates/verify \
  -H "Content-Type: application/json" \
  -d '{
    "certificateId": "a1b2c3d4e5f6...",
    "documentHash": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
  }'
```

---

## Rate Limits

Currently, no rate limits are implemented. For production:
- Implement rate limiting (e.g., 100 requests per minute per IP)
- Use Redis for distributed rate limiting
- Return 429 Too Many Requests when limit exceeded

## Error Handling

Standard HTTP status codes:
- `200 OK`: Successful request
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

All errors include descriptive error messages in the response body.

## CORS

CORS is enabled for all origins. For production:
- Restrict to specific domains
- Configure in `src/index.js`

## Security Considerations

For production deployment:

1. **Authentication**: Implement API key or JWT authentication
2. **HTTPS**: Use HTTPS for all endpoints
3. **Input Validation**: Validate and sanitize all inputs
4. **Rate Limiting**: Prevent abuse with rate limits
5. **Logging**: Log all requests and errors
6. **Monitoring**: Set up monitoring and alerts
7. **Database**: Use proper database instead of in-memory storage
8. **Environment Variables**: Never commit secrets to version control

## Testing with Postman

Import this collection into Postman for easy testing:

1. Create a new collection: "Lightning Certificates"
2. Add environment variable: `base_url` = `http://localhost:3000/api`
3. Add the endpoints listed above
4. Save payment_hash as environment variable after invoice creation
5. Use saved payment_hash in subsequent requests

## Webhooks (Future Enhancement)

For production, consider implementing webhooks:
- Payment confirmation webhook
- Certificate generation webhook
- Blockchain confirmation webhook

This allows real-time notifications to connected clients.
