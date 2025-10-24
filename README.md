# DioteKo - Administrative Certificates Secured by Bitcoin Lightning

**[English](#english-version) | [Français](#version-française)**

---

<a name="english-version"></a>

# ENGLISH VERSION

## Inspiration

### Screenshots

**User View**
<div align="center">

| Home | Home 2 | New Certificate |
|:---:|:---:|:---:|
| ![HomeUser](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/HomeUser.jpg) | ![HomeUser2](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/HomeUser2.jpg) | ![NewCertificatUser](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/NewCertificatUser.jpg) |

| Payment 1 | Payment 2 | Payment 3 |
|:---:|:---:|:---:|
| ![PaymentUser1](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/PaymentUser1.jpg) | ![PaymentUser2](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/PaymentUser2.jpg) | ![PaymentUser3](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/PaymentUser3.jpg) |

| Scan | Confirmation | Settings |
|:---:|:---:|:---:|
| ![ScanUser](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/ScanUser.jpg) | ![ScrrenConfirmationPayment](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/ScrrenConfirmationPayment.jpg) | ![SettingUser](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/SettingUser.jpg) |

| Verify | Verify Scan |
|:---:|:---:|
| ![VerifyUser](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/VerifyUser.jpg) | ![VerifyUserScan](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/VerifyUserScan.jpg) |

</div>

**User Video Demo**

[Watch the user demo video](https://github.com/HackathonBTCDays/BlockchainLightning/blob/main/frontmobile/Screen/Users/VideoUser.mp4)

**Admin View**
<div align="center">

| Home | Home 2 | Manage User |
|:---:|:---:|:---:|
| ![HomeAdmin](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/HomeAdmin.jpg) | ![HomeAdmin2](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/HomeAdmin2.jpg) | ![MangeUserAdmin](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/MangeUserAdmin.jpg) |

| Settings | Support | TPoS |
|:---:|:---:|:---:|
| ![SettingAdmin](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/SettingAdmin.jpg) | ![SupportAdmin](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/SupportAdmin.jpg) | ![TPoSAdmin](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/TPoSAdmin.jpg) |

</div>

**Admin Video Demo**

[Watch the admin demo video](https://github.com/HackathonBTCDays/BlockchainLightning/blob/main/frontmobile/Screen/Admin/VideoAdmin.mp4)

In Senegal, like many African countries, obtaining a simple administrative certificate is an ordeal. **Endless queues, delays of several days or even weeks, "informal fees" to speed up the process, and the inability to verify document authenticity** are the daily reality for millions of citizens.

We've experienced these frustrations firsthand: a birth certificate that takes a week when you need it tomorrow to open a bank account, hours lost in overcrowded offices, doubts about the authenticity of a document presented by a job candidate.

**The inspiration came from two technological revolutions:**

1. **The Lightning Network**, enabling instant and nearly free Bitcoin micropayments, already successfully used in Africa through solutions like Machankura
2. **W3C Verifiable Credentials standards**, allowing the creation of tamper-proof digital documents that can be verified instantly without a central server

**What if we could revolutionize Senegalese administration by combining these two innovations?** Pay in seconds via Lightning, receive your digital certificate immediately, and allow anyone to verify it instantly with a simple QR scan. **No more queues, no more corruption, no more fake documents.**

---

## What it does

**DioteKo** (meaning "certificate" in Wolof) is a complete administrative certificate management system secured by Bitcoin Lightning and blockchain.

### For Citizens

- **Request in 2 minutes**: Simplified form from your phone (name, date of birth, place, parents)
- **Instant payment**: Scan an LNURL QR code with your Lightning wallet (Phoenix, BlueWallet...) - 1,000 sats (~$1.75 / ~350 FCFA) for a birth certificate
- **Certificate in 5 minutes**: Official PDF automatically generated and anchored on Bitcoin blockchain for proof of authenticity
- **Instant verification**: Anyone can scan the certificate's QR code to verify its authenticity in real-time

### For the Government

- **Complete automation**: No human intervention needed, drastic cost reduction
- **Total transparency**: All payments tracked on Lightning Network
- **Zero corruption**: Automated cryptographic system, fixed prices
- **Modernization**: Image of a digital and innovative administration

### For the Economy

- **Employer/bank verification**: QR scan + immediate confirmation (valid/invalid)
- **Fraud reduction**: Document hash anchored on Bitcoin = impossible to forge
- **Productivity gain**: Millions of hours saved collectively

### Supported Certificate Types

| Certificate Type | Price (sats) | Price (FCFA) |
|---|---|---|
| Birth certificate | 1,000 | ~600 |
| Marriage certificate | 1,500 | ~1,000 |
| Death certificate | 5,000 | ~3,000 |
| Residence certificate | 2,000 | ~2,000 |
| Identity certificate | 600-1,500 | 200-750 |

*Note: Prices are examples and do not represent actual government rates*

---

## How we built it

### Stack Components

#### 1. Lightning Network Payments

- **LNbits**: Open-source Lightning server with 20+ extensions
- **Enabled extensions**: LNURLp (static payments), SatsPay (charges), TPoS (point of sale), User Manager, Bolt Cards
- **LNURL-pay protocol (LUD-06)**: Static QR codes, no need to generate a new invoice each time
- **Webhooks**: Instant payment confirmation via Lightning preimage
- **Dynamic pricing**: Automatic calculation in satoshis based on certificate type

#### 2. Node.js/Express Backend

**Modular services:**
- `LnbitsService`: Lightning payment management
- `BitcoinService`: Certificate blockchain anchoring
- `PDFService`: Official document generation
- `ValidationService`: Senegalese business rules (phone format +221, regions, legal ages)

**Features:**
- State machine: `pending_payment → paid → generating → completed`
- Robust validation: Required fields, formats, specific rules (minimum marriage age 18, etc.)
- Structured logging: Complete traceability of each operation

#### 3. Bitcoin Blockchain

- **Bitcoin Testnet**: Economic and reversible anchoring for MVP
- **SHA-256 hash**: Cryptographic fingerprint of the PDF
- **OP_RETURN transaction**: Hash inscribed in a Bitcoin transaction
- **Verification**: Hash recalculation + transaction existence check via explorer

#### 4. React Native Mobile Frontend

- **Expo**: Fast cross-platform development (iOS + Android)
- **React Navigation**: Smooth navigation between screens
- **Expo Camera**: QR code verification scanner
- **QRCode SVG**: Payment QR code generation
- **AsyncStorage**: Local certificate caching
- **Axios**: REST API communication

#### 5. Open Standards

- **W3C Verifiable Credentials v2.0**: Digital certificate structure
- **Issuer/Holder/Verifier triangle**: State issues → Citizen holds → Third party verifies
- **LNURL**: Lightning protocol for simplified UX
- **Bitcoin OP_RETURN**: Standard for on-chain data anchoring

### Detailed Technical Workflow

#### Phase 1: Request (2 min)

```javascript
POST /api/certificates/request
{
  "userData": {
    "firstName": "Mamadou",
    "lastName": "Diallo",
    "dateOfBirth": "1990-01-01",
    "placeOfBirth": "Dakar",
    "fatherName": "...",
    "motherName": "..."
  },
  "certificateType": "birth"
}
// → Validation → Unique ID generated → Status: pending_payment
```

#### Phase 2: Payment (< 1 min)

```javascript
POST /api/payments/invoice
// → LNbits creates BOLT11 invoice + LNURL-pay
// → QR code displayed in mobile app
// → Scan with Lightning wallet → Instant payment
// → LNbits webhook → Preimage verification → Status: paid
```

#### Phase 3: Generation (2 min)

```javascript
// → Automatic trigger after confirmed payment
// → PDF generation (Senegal header + data + verification QR)
// → SHA-256 hash of PDF
// → Bitcoin testnet transaction with hash in OP_RETURN
// → Broadcast → TXID retrieval → Status: completed
```

#### Phase 4: Delivery & Verification (instant)

```javascript
GET /api/certificates/download/:id
// → PDF download

// Verification via QR scan
GET /api/certificates/verify/:id
// → Existence + integrity + blockchain anchoring verification
// → Result: { verified: true, txid: "...", timestamp: "..." }
```

### DevOps & Deployment

- **Docker & Docker Compose**: Complete containerization
- **Environment variables**: Secure configuration (.env)
- **GitHub**: Versioning and collaboration
- **Production-ready**: Deployable on Render, Railway, VPS

---

## Challenges we ran into

### 1. Lightning Network Learning Curve

**Challenge**: No team member had prior Lightning Network experience. Understanding the difference between on-chain and off-chain, payment channels, BOLT11 invoices, LNURL, preimages, webhooks...

**Solution**: Intensive documentation (docs.lightning.engineering, LNURL specs), testnet testing, using LNbits which abstracts much complexity, and lots of trial-and-error.

**Result**: Sufficient mastery to implement a production-ready payment system in 9 days.

### 2. LNbits Integration: Confusing Project Structure

**Challenge**: Dockerfile and docker-compose.yml are at the ROOT of the LNbits project, not in a subdirectory. Initial confusion about "where to run Docker commands."

**Solution**: Careful reading of the official GitHub repo, understanding this is the expected structure, launching from root.

**Learning**: Always check the official project structure before modifying it.

### 3. Asynchronous State Management

**Challenge**: Coordination between Lightning payment → certificate generation → blockchain anchoring. Race condition issues, timeouts, silent errors.

**Solution**: Implementation of a clear state machine with detailed logs at each step. Added retry logic for blockchain operations.

**Result**: Robust system that handles errors gracefully.

### 4. Senegalese Data Validation

**Challenge**: Specific formats (phone +221, region list, business rules like minimum marriage age, etc.).

**Solution**: Centralized validation service with configurable rules, research of official Senegalese standards.

**Learning**: Adapting technical solutions to local realities is crucial.

### 5. Hackathon Timing: 9 Effective Days

**Challenge**: Between project discovery (October 15) and deadline (October 24), only 9 days with classes/work in parallel.

**Solution**:
- Strict prioritization: MVP first (payments + certificates + verification)
- Modular architecture to add features progressively
- Reuse of existing building blocks (LNbits, W3C standards, proven libraries)
- "Ship fast, iterate later" mode

**Learning**: "Done is better than perfect" in hackathon context. Delivering a functional MVP is better than an ambitious unfinished project.

### 6. Security and Privacy

**Challenge**: Sensitive data (civil status, parents' names, address). Data leak risks, PII storage on-chain.

**Solution**:
- **No PII on-chain**: Only document hash anchored on Bitcoin
- **HTTPS mandatory** in production
- **Selective masking** based on roles (admin vs citizen vs agent)
- **No sensitive data logs**: Only metadata and IDs

**Learning**: Security & privacy by design from the start, not as an afterthought.

### 7. Testing with Real Lightning Wallets

**Challenge**: Need to test payments with real Lightning wallets (Phoenix, BlueWallet) on testnet.

**Solution**: Creation of testnet wallets, use of Bitcoin testnet faucets, repeated tests of complete flow.

**Result**: Confidence in payment system before submission.

---

## Accomplishments that we're proud of

### Complete and Functional System in 9 Days
From zero to a production-ready MVP with backend, mobile frontend, Lightning payments, blockchain anchoring and verification. **Everything works end-to-end.**

### Native Lightning Payments
First administrative certificate system in Africa using Lightning Network. Instant payments, near-zero fees, financial inclusion (no bank account needed).

### Blockchain Anchoring for Security
Each certificate has its hash anchored on Bitcoin Testnet. **Impossible to forge, verifiable by anyone, forever.**

### Simplified UX for Non-Technical Citizens
Intuitive mobile interface: simple form → QR scan → certificate received. Even someone who has never used Bitcoin can get their certificate.

### Open and Interoperable Standards
Use of W3C Verifiable Credentials, LNURL, Bitcoin standards. **Interoperable with global ecosystem, no vendor lock-in.**

### Measurable Social Impact

- **Time saved**: From several days → 5 minutes (99%+ gain)
- **Transparent cost**: Fixed price in sats, no "informal fees"
- **Reduced corruption**: Automated cryptographic system
- **Accessibility**: 24/7, from your phone, anywhere in Senegal

### Intensive Learning
Mastery of Lightning Network, W3C Verifiable Credentials, blockchain anchoring, microservices architecture, and cross-platform mobile development in record time.

### Production-Ready
Clean, modular, documented code. Scalable architecture. Immediately deployable on VPS/cloud for real pilot.

---

## What we learned

### About Lightning Network
- Payment channel architecture off-chain vs on-chain
- BOLT11 (Lightning invoices) and LNURL (simplified UX protocol)
- LNbits: Power of a modular Lightning server with 20+ extensions
- Webhooks and preimages as cryptographic proof of payment
- Micropayments: Ability to pay very small amounts (few hundred sats) with negligible fees
- Financial inclusion: Lightning accessible without bank account, crucial for Africa

### About Verifiable Credentials (W3C)
- W3C VC Data Model v2.0 standards for verifiable digital documents
- Issuer/Holder/Verifier triangle: Decentralized trust architecture
- Selective disclosure: Reveal only necessary information
- Cryptographic signatures: Authenticity without central server
- Difference with blockchain: VC = data structure, blockchain = anchoring for proof of existence

### About Bitcoin and Blockchain Anchoring
- Bitcoin Testnet: Free and reversible test environment
- OP_RETURN: Bitcoin transaction field for anchoring data (max 80 bytes)
- SHA-256 hash: Unique cryptographic fingerprint of a file
- Blockchain explorers: Public transaction verification
- Immutability: Once anchored, a hash cannot be modified

### About Microservices Architecture
- Separation of concerns: Payments / Certificates / Verification / Validation
- Modular services: Facilitates maintenance and evolution
- Docker & Compose: Isolation and reproducibility
- REST API: Standardized communication between services

### About Mobile Development
- React Native + Expo: Cross-platform development speed
- Navigation: Screen and state management
- QR codes: Scanner (expo-camera) and generation (qrcode-svg)
- Local storage: AsyncStorage for offline caching

### About Senegalese Context
- Importance of financial inclusion: Many citizens without bank accounts
- Administrative issues: Delays, corruption, authenticity
- Local adaptation: Phone formats (+221), regions, languages (Wolof), currency (FCFA)
- Impact potential: Millions of citizens affected

### About Project Management
- Prioritization: Focus MVP before advanced features
- Rapid iteration: Ship fast, get feedback, improve
- Documentation: Critical for collaboration and handover
- Testing: Complete flow validation before submission

### About Security
- Security by design: Anticipate risks from the start
- Privacy: Never store PII on-chain
- Validation: Always validate server-side, never trust client
- Logs: Track operations without exposing sensitive data

---

## What's next for DioteKo

### Short Term (1-3 months)

**1. Real Pilot in a Town Hall**
- Deployment in a pilot civil registry office (Dakar or region)
- Agent training
- Real user feedback
- UX adjustments based on field usage

**2. Persistent Database**
- Migration to PostgreSQL for permanent storage
- Automatic backup
- Complete operation history
- User management with authentication

**3. Push Notifications**
- Payment confirmation
- Certificate ready to download
- Expiration reminders (if applicable)

**4. USSD Support (For Basic Phones)**
- USSD menu *123# to request certificates without smartphone
- Inspiration: Machankura (Bitcoin via USSD in Africa)
- SMS for payment confirmation
- Physical certificate pickup with code

**5. Administration Dashboard**
- Web interface for civil registry agents
- Real-time statistics (requests, payments, certificates generated)
- Manual request management (exceptional cases)
- Accounting exports

### Medium Term (3-6 months)

**6. Bitcoin Mainnet Migration**
- Migration from Testnet → Mainnet for production
- Production Lightning wallet with 24/7 monitoring
- Key security (HSM / multi-sig)

**7. Advanced Digital Signature**
- Cryptographic keys for the State
- Post-quantum signatures (resistance to quantum computers)
- Senegalese PKI (Public Key Infrastructure)

**8. Government Database Integration**
- Connection to existing civil registry databases
- Automatic data verification
- Bidirectional synchronization

**9. Document Type Extension**
- Digital driver's license
- School diplomas and certificates
- Property certificates
- Tax attestations

**10. Public Verification API**
- Public endpoint for employers/banks/administrations
- API documentation
- SDK for easy integration
- Rate limiting and authentication

### Long Term (6-12+ months)

**11. West Africa Regional Expansion**
- Deployment in Mali, Burkina Faso, Ivory Coast
- Adaptation to local contexts
- Government partnerships
- Lightning infrastructure sharing

**12. International Interoperability**
- eIDAS compliance (European Union)
- EBSI integration (European Blockchain Services Infrastructure)
- mDL standards (mobile Driving License ISO 18013-5)
- International certificate recognition

**13. Complete Digital Identity (Self-Sovereign Identity)**
- Decentralized identity wallet (DID)
- Total citizen control
- Verifiable attributes (age, nationality, residence)
- Zero-knowledge proofs (prove >18 without exact date)

**14. Tokenization and Incentives**
- Sat rewards for performing agents
- Loyalty programs for citizens
- Government services marketplace

**15. Open Source and Community**
- Complete code publication on GitHub
- Exhaustive technical documentation
- Community contributions
- African developer training

### 5-Year Target Impact

**Quantitative Goals:**
- 5+ million digital certificates issued
- 10+ African countries using DioteKo
- 100+ million hours saved collectively
- 90%+ reduction in certificate acquisition time
- Near-total elimination of corruption in this sector

**Qualitative Goals:**
- Become the African standard for digital certificates
- Serve as a model for public administration digitalization
- Demonstrate the power of Bitcoin/Lightning for financial inclusion
- Contribute to mainstream Bitcoin adoption in Africa

### Ultimate Vision
*An African continent where every citizen possesses sovereign digital identity, where public services are instant, transparent and accessible to all, and where Bitcoin Lightning is the default payment infrastructure.*


## Authors

**Salif Diallo** | Mobile Frontend Developer - React Native & Web React
- GitHub: [@MrSalifDiallo](https://github.com/MrSalifDiallo)
- LinkedIn: [Salif Diallo](https://www.linkedin.com/in/salif-diallo-152650313/)
- Email: [salifdiallo@esp.sn](mailto:salifdiallo@esp.sn)

**Aicha Ndiaye** | Backend Developer
- GitHub: [@AichaNdiaye](https://github.com/AichaNdiaye)
- LinkedIn: [Aicha Ndiaye](https://www.linkedin.com/in/aicha-ndiaye/)
- Email: [aicha.ndiaye@esp.sn](mailto:aicha.ndiaye@esp.sn)

---

## GitHub Project

**Hackathon BTC Days** | DioteKo - Administrative Certificates Secured by Bitcoin Lightning
- GitHub Repository: [@HackathonBTCDays/BlockchainLightning](https://github.com/HackathonBTCDays/BlockchainLightning)


---

**[Back to top](#dioteKo---administrative-certificates-secured-by-bitcoin-lightning) | [Français](#version-française)**

---

<a name="version-française"></a>

# VERSION FRANÇAISE

## Inspiration

### Captures d'écran

**Vue Utilisateur**
<div align="center">

| Accueil | Accueil 2 | Nouveau Certificat |
|:---:|:---:|:---:|
| ![HomeUser](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/HomeUser.jpg) | ![HomeUser2](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/HomeUser2.jpg) | ![NewCertificatUser](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/NewCertificatUser.jpg) |

| Paiement 1 | Paiement 2 | Paiement 3 |
|:---:|:---:|:---:|
| ![PaymentUser1](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/PaymentUser1.jpg) | ![PaymentUser2](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/PaymentUser2.jpg) | ![PaymentUser3](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/PaymentUser3.jpg) |

| Scan | Confirmation | Paramètres |
|:---:|:---:|:---:|
| ![ScanUser](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/ScanUser.jpg) | ![ScrrenConfirmationPayment](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/ScrrenConfirmationPayment.jpg) | ![SettingUser](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/SettingUser.jpg) |

| Vérification | Vérification Scan |
|:---:|:---:|
| ![VerifyUser](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/VerifyUser.jpg) | ![VerifyUserScan](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Users/VerifyUserScan.jpg) |

</div>

**Vidéo de démonstration utilisateur**

[Voir la vidéo de démonstration utilisateur](https://github.com/HackathonBTCDays/BlockchainLightning/blob/main/frontmobile/Screen/Users/VideoUser.mp4)

**Vue Administrateur**
<div align="center">

| Accueil | Accueil 2 | Gérer les utilisateurs |
|:---:|:---:|:---:|
| ![HomeAdmin](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/HomeAdmin.jpg) | ![HomeAdmin2](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/HomeAdmin2.jpg) | ![MangeUserAdmin](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/MangeUserAdmin.jpg) |

| Paramètres | Support | TPoS |
|:---:|:---:|:---:|
| ![SettingAdmin](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/SettingAdmin.jpg) | ![SupportAdmin](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/SupportAdmin.jpg) | ![TPoSAdmin](https://raw.githubusercontent.com/HackathonBTCDays/BlockchainLightning/main/frontmobile/Screen/Admin/TPoSAdmin.jpg) |

</div>

**Vidéo de démonstration administrateur**

[Voir la vidéo de démonstration administrateur](https://github.com/HackathonBTCDays/BlockchainLightning/blob/main/frontmobile/Screen/Admin/VideoAdmin.mp4)

Au Sénégal, comme dans de nombreux pays africains, obtenir un simple certificat administratif est un parcours du combattant. **Des files interminables, des délais de plusieurs jours voire semaines, des "frais informels" pour accélérer le processus, et l'impossibilité de vérifier l'authenticité des documents** sont le quotidien de millions de citoyens.

Nous avons vécu ces frustrations : un extrait de naissance qui prend une semaine alors qu'on en a besoin demain pour ouvrir un compte bancaire, des heures perdues dans des bureaux surchargés, des doutes sur l'authenticité d'un document présenté par un candidat à l'embauche.

**L'inspiration est venue de deux révolutions technologiques :**

1. **Le Lightning Network**, qui permet des micropaiements Bitcoin instantanés et quasi-gratuits, déjà utilisé avec succès en Afrique via des solutions comme Machankura
2. **Les standards W3C Verifiable Credentials**, qui permettent de créer des documents numériques infalsifiables et vérifiables instantanément sans serveur central

**Et si on pouvait révolutionner l'administration sénégalaise en combinant ces deux innovations ?** Payer en quelques secondes via Lightning, recevoir son certificat numérique immédiatement, et permettre à n'importe qui de le vérifier instantanément par un simple scan QR. **Fini les files, fini la corruption, fini les faux documents.**

---

## Ce que ça fait

**DioteKo** (qui signifie "certificat" en wolof) est un système complet de gestion de certificats administratifs sécurisé par Bitcoin Lightning et blockchain.

### Pour les Citoyens

- **Demande en 2 minutes** : Formulaire simplifié depuis son téléphone (nom, date de naissance, lieu, parents)
- **Paiement instantané** : Scan d'un QR code LNURL avec son portefeuille Lightning (Phoenix, BlueWallet...) - 1 000 sats (~1,75$ / ~350 FCFA) pour un extrait de naissance
- **Certificat en 5 minutes** : PDF officiel généré automatiquement et ancré sur la blockchain Bitcoin pour preuve d'authenticité
- **Vérification instantanée** : N'importe qui peut scanner le QR code du certificat pour vérifier son authenticité en temps réel

### Pour l'État

- **Automatisation complète** : Aucune intervention humaine nécessaire, réduction drastique des coûts
- **Transparence totale** : Tous les paiements tracés sur Lightning Network
- **Zéro corruption** : Système cryptographique automatisé, prix fixes
- **Modernisation** : Image d'administration digitale et innovante

### Pour l'Économie

- **Vérification employeurs/banques** : Scan QR + confirmation immédiate (valide/invalide)
- **Réduction fraude** : Hash du document ancré sur Bitcoin = impossible à falsifier
- **Gain de productivité** : Des millions d'heures économisées collectivement

### Types de Certificats Supportés

| Type de Certificat | Prix (sats) | Prix (FCFA) |
|---|---|---|
| Extrait de naissance | 1 000 | ~600 |
| Certificat de mariage | 1 500 | ~1 000 |
| Certificat de décès | 5 000 | ~3 000 |
| Certificat de résidence | 2 000 | ~2 000 |
| Certificat d'identité | 600-1 500 | 200-750 |

*Note : Les prix sont des exemples et ne représentent pas les tarifs gouvernementaux réels*

---

## Comment nous l'avons construit
### Composants de la Stack

#### 1. Paiements Lightning Network

- **LNbits** : Serveur Lightning open-source avec 20+ extensions
- **Extensions activées** : LNURLp (paiements statiques), SatsPay (charges), TPoS (point de vente), User Manager, Bolt Cards
- **Protocole LNURL-pay (LUD-06)** : QR codes statiques, pas besoin de générer une nouvelle facture à chaque fois
- **Webhooks** : Confirmation instantanée des paiements via préimage Lightning
- **Tarification dynamique** : Calcul automatique en satoshis selon le type de certificat

#### 2. Backend Node.js/Express

**Services modulaires :**
- `LnbitsService` : Gestion des paiements Lightning
- `BitcoinService` : Ancrage blockchain des certificats
- `PDFService` : Génération de documents officiels
- `ValidationService` : Règles métier sénégalaises (format téléphone +221, régions, âges légaux)

**Fonctionnalités :**
- Machine d'états : `pending_payment → paid → generating → completed`
- Validation robuste : Champs requis, formats, règles spécifiques (âge minimum mariage 18 ans, etc.)
- Logging structuré : Traçabilité complète de chaque opération

#### 3. Blockchain Bitcoin

- **Bitcoin Testnet** : Ancrage économique et réversible pour le MVP
- **Hash SHA-256** : Empreinte cryptographique du PDF
- **Transaction OP_RETURN** : Hash inscrit dans une transaction Bitcoin
- **Vérification** : Recalcul du hash + vérification de l'existence de la transaction via explorateur

#### 4. Frontend Mobile React Native

- **Expo** : Développement cross-platform rapide (iOS + Android)
- **React Navigation** : Navigation fluide entre écrans
- **Expo Camera** : Scanner de QR codes de vérification
- **QRCode SVG** : Génération de QR codes de paiement
- **AsyncStorage** : Cache local des certificats
- **Axios** : Communication API REST

#### 5. Standards Ouverts

- **W3C Verifiable Credentials v2.0** : Structure des certificats numériques
- **Triangle Issuer/Holder/Verifier** : État émet → Citoyen détient → Tiers vérifie
- **LNURL** : Protocole Lightning pour UX simplifiée
- **Bitcoin OP_RETURN** : Standard d'ancrage de données on-chain

### DevOps & Déploiement

- **Docker & Docker Compose** : Containerisation complète
- **Variables d'environnement** : Configuration sécurisée (.env)
- **GitHub** : Versioning et collaboration
- **Prêt pour la production** : Déployable sur Render, Railway, VPS

---

## Défis rencontrés

### 1. Courbe d'apprentissage Lightning Network

**Défi** : Aucun membre de l'équipe n'avait d'expérience préalable avec Lightning Network. Comprendre la différence entre on-chain et off-chain, les canaux de paiement, les factures BOLT11, LNURL, les préimages, les webhooks...

**Solution** : Documentation intensive (docs.lightning.engineering, spécifications LNURL), tests sur testnet, utilisation de LNbits qui abstrait beaucoup de complexité, et beaucoup d'essais-erreurs.

**Résultat** : Maîtrise suffisante pour implémenter un système de paiement production-ready en 9 jours.

### 2. Intégration LNbits : Structure de Projet Confuse

**Défi** : Le Dockerfile et le docker-compose.yml sont à la RACINE du projet LNbits, pas dans un sous-dossier. Confusion initiale sur "où lancer les commandes Docker".

**Solution** : Lecture attentive du dépôt GitHub officiel, compréhension que c'est la structure attendue, lancement depuis la racine.

**Apprentissage** : Toujours vérifier la structure officielle d'un projet avant de la modifier.

### 3. Gestion des États Asynchrones

**Défi** : Coordination entre paiement Lightning → génération certificat → ancrage blockchain. Problèmes de race conditions, timeouts, erreurs silencieuses.

**Solution** : Implémentation d'une machine d'états claire avec logs détaillés à chaque étape. Ajout de logique de retry pour les opérations blockchain.

**Résultat** : Système robuste qui gère les erreurs gracieusement.

### 4. Validation des Données Sénégalaises

**Défi** : Formats spécifiques (téléphone +221, liste des régions, règles métier comme âge minimum pour mariage, etc.).

**Solution** : Service de validation centralisé avec règles configurables, recherche des standards sénégalais officiels.

**Apprentissage** : Adapter les solutions techniques aux réalités locales est crucial.

### 5. Timing du Hackathon : 9 Jours Effectifs

**Défi** : Entre la découverte du projet (15 octobre) et la deadline (24 octobre), seulement 9 jours avec cours/travail en parallèle.

**Solution** :
- Priorisation stricte : MVP d'abord (paiements + certificats + vérification)
- Architecture modulaire pour ajouter les fonctionnalités progressivement
- Réutilisation de briques existantes (LNbits, standards W3C, librairies éprouvées)
- Mode "Ship fast, iterate later"

**Apprentissage** : "Done is better than perfect" en contexte hackathon. Livrer un MVP fonctionnel vaut mieux qu'un projet ambitieux inachevé.

### 6. Sécurité et Vie Privée

**Défi** : Données sensibles (état civil, noms des parents, adresse). Risques de fuite de données, stockage de PII on-chain.

**Solution** :
- **Pas de PII on-chain** : Seulement le hash du document ancré sur Bitcoin
- **HTTPS obligatoire** en production
- **Masquage sélectif** selon les rôles (admin vs citoyen vs agent)
- **Pas de logs de données sensibles** : Seulement les métadonnées et les IDs

**Apprentissage** : Security & privacy by design dès le début, pas en afterthought.

### 7. Tests avec de Vrais Portefeuilles Lightning

**Défi** : Besoin de tester les paiements avec de vrais portefeuilles Lightning (Phoenix, BlueWallet) sur testnet.

**Solution** : Création de portefeuilles testnet, utilisation de faucets Bitcoin testnet, tests répétés du flow complet.

**Résultat** : Confiance dans le système de paiement avant la soumission.

---

## Réalisations dont nous sommes fiers

### Système Complet et Fonctionnel en 9 Jours
De zéro à un MVP production-ready avec backend, frontend mobile, paiements Lightning, ancrage blockchain et vérification. **Tout fonctionne end-to-end.**

### Paiements Lightning Natifs
Premier système de certificats administratifs en Afrique utilisant Lightning Network. Paiements instantanés, frais quasi-nuls, inclusion financière (pas besoin de compte bancaire).

### Ancrage Blockchain pour la Sécurité
Chaque certificat a son hash ancré sur Bitcoin Testnet. **Impossible à falsifier, vérifiable par n'importe qui, pour toujours.**

### UX Simplifiée pour Citoyens Non-Techniques
Interface mobile intuitive : formulaire simple → scan QR → certificat reçu. Même quelqu'un n'ayant jamais utilisé Bitcoin peut obtenir son certificat.

### Standards Ouverts et Interopérables
Utilisation des standards W3C Verifiable Credentials, LNURL, Bitcoin. **Interopérable avec l'écosystème mondial, pas de verrouillage fournisseur.**

### Impact Social Mesurable

- **Temps économisé** : De plusieurs jours → 5 minutes (gain de 99%+)
- **Coût transparent** : Prix fixe en sats, pas de "frais informels"
- **Réduction corruption** : Système cryptographique automatisé
- **Accessibilité** : 24/7, depuis son téléphone, partout au Sénégal

### Apprentissage Intensif
Maîtrise du Lightning Network, des Verifiable Credentials W3C, de l'ancrage blockchain, de l'architecture microservices, et du développement mobile cross-platform en temps record.

### Prêt pour la Production
Code propre, modulaire, documenté. Architecture scalable. Déployable immédiatement sur VPS/cloud pour pilote réel.

---

## Ce que nous avons appris

### Sur le Lightning Network
- Architecture des canaux de paiement off-chain vs on-chain
- BOLT11 (factures Lightning) et LNURL (protocole UX simplifié)
- LNbits : Puissance d'un serveur Lightning modulaire avec 20+ extensions
- Webhooks et préimages comme preuves cryptographiques de paiement
- Micropaiements : Capacité à payer des montants très faibles (quelques centaines de sats) avec frais négligeables
- Inclusion financière : Lightning accessible sans compte bancaire, crucial pour l'Afrique

### Sur les Verifiable Credentials (W3C)
- Standards W3C VC Data Model v2.0 pour documents numériques vérifiables
- Triangle Issuer/Holder/Verifier : Architecture décentralisée de confiance
- Selective disclosure : Révéler seulement les informations nécessaires
- Signatures cryptographiques : Authentification sans serveur central
- Différence avec blockchain : VC = structure de données, blockchain = ancrage pour preuve d'existence

### Sur Bitcoin et l'Ancrage Blockchain
- Bitcoin Testnet : Environnement de test gratuit et réversible
- OP_RETURN : Champ de transaction Bitcoin pour l'ancrage de données (max 80 bytes)
- Hash SHA-256 : Empreinte cryptographique unique d'un fichier
- Explorateurs blockchain : Vérification publique des transactions
- Immuabilité : Une fois ancré, un hash ne peut pas être modifié

### Sur l'Architecture Microservices
- Séparation des responsabilités : Paiements / Certificats / Vérification / Validation
- Services modulaires : Facilite la maintenance et l'évolution
- Docker & Compose : Isolation et reproductibilité
- API REST : Communication standardisée entre les services

### Sur le Développement Mobile
- React Native + Expo : Rapidité de développement cross-platform
- Navigation : Gestion des écrans et du state
- QR codes : Scanner (expo-camera) et génération (qrcode-svg)
- Stockage local : AsyncStorage pour le caching offline

### Sur le Contexte Sénégalais
- Importance de l'inclusion financière : Beaucoup de citoyens sans compte bancaire
- Problématiques administratives : Délais, corruption, authenticité
- Adaptation locale : Formats téléphone (+221), régions, langues (Wolof), monnaie (FCFA)
- Potentiel d'impact : Millions de citoyens concernés

### Sur la Gestion de Projet
- Priorisation : Focus MVP avant les fonctionnalités avancées
- Itération rapide : Ship fast, get feedback, improve
- Documentation : Critique pour la collaboration et la transmission
- Tests : Validation du flow complet avant la soumission

### Sur la Sécurité
- Security by design : Anticiper les risques dès le début
- Vie privée : Ne jamais stocker de PII on-chain
- Validation : Toujours valider côté serveur, ne jamais faire confiance au client
- Logs : Tracer les opérations sans exposer de données sensibles

---

## Prochaines étapes pour DioteKo

### Court Terme (1-3 mois)

**1. Pilote Réel dans une Mairie**
- Déploiement dans un bureau d'état civil pilote (Dakar ou région)
- Formation des agents
- Retours utilisateurs réels
- Ajustements UX basés sur l'utilisation terrain

**2. Base de Données Persistante**
- Migration vers PostgreSQL pour stockage permanent
- Sauvegarde automatique
- Historique complet des opérations
- Gestion des utilisateurs avec authentification

**3. Notifications Push**
- Confirmation de paiement
- Certificat prêt à télécharger
- Rappels d'expiration (si applicable)

**4. Support USSD (Pour Téléphones Basiques)**
- Menu USSD *123# pour demander des certificats sans smartphone
- Inspiration : Machankura (Bitcoin via USSD en Afrique)
- SMS pour confirmation de paiement
- Retrait physique du certificat avec code

**5. Tableau de Bord d'Administration**
- Interface web pour les agents d'état civil
- Statistiques temps réel (demandes, paiements, certificats générés)
- Gestion des demandes manuelles (cas exceptionnels)
- Exports comptables

### Moyen Terme (3-6 mois)

**6. Migration Bitcoin Mainnet**
- Migration de Testnet → Mainnet pour la production
- Portefeuille Lightning production avec monitoring 24/7
- Sécurité des clés (HSM / multi-sig)

**7. Signature Numérique Avancée**
- Clés cryptographiques pour l'État
- Signatures post-quantiques (résistance aux ordinateurs quantiques)
- PKI Sénégalaise (Public Key Infrastructure)

**8. Intégration Bases de Données Gouvernementales**
- Connexion aux bases de registres d'état civil existantes
- Vérification automatique des données
- Synchronisation bidirectionnelle

**9. Extension des Types de Documents**
- Permis de conduire numérique
- Diplômes et certificats scolaires
- Certificats de propriété
- Attestations fiscales

**10. API Publique de Vérification**
- Endpoint public pour employeurs/banques/administrations
- Documentation API
- SDK pour intégration facile
- Rate limiting et authentification

### Long Terme (6-12+ mois)

**11. Expansion Régionale Afrique de l'Ouest**
- Déploiement au Mali, Burkina Faso, Côte d'Ivoire
- Adaptation aux contextes locaux
- Partenariats gouvernementaux
- Partage d'infrastructure Lightning

**12. Interopérabilité Internationale**
- Conformité eIDAS (Union Européenne)
- Intégration EBSI (European Blockchain Services Infrastructure)
- Standards mDL (mobile Driving License ISO 18013-5)
- Reconnaissance internationale des certificats

**13. Identité Numérique Complète (Self-Sovereign Identity)**
- Portefeuille d'identité décentralisée (DID)
- Contrôle total par le citoyen
- Attributs vérifiables (âge, nationalité, résidence)
- Preuves à divulgation nulle de connaissance (prouver >18 sans date exacte)

**14. Tokenisation et Incitations**
- Récompenses en sats pour les agents performants
- Programmes de fidélité pour les citoyens
- Marketplace de services gouvernementaux

**15. Open Source et Communauté**
- Publication complète du code sur GitHub
- Documentation technique exhaustive
- Contributions communautaires
- Formation des développeurs africains

### Impact Visé à 5 Ans

**Objectifs Quantitatifs :**
- 5+ millions de certificats numériques émis
- 10+ pays africains utilisant DioteKo
- 100+ millions d'heures économisées collectivement
- Réduction de 90%+ du temps d'obtention de certificats
- Élimination quasi-totale de la corruption dans ce secteur

**Objectifs Qualitatifs :**
- Devenir le standard africain pour les certificats numériques
- Servir de modèle pour la digitalisation de l'administration publique
- Démontrer la puissance de Bitcoin/Lightning pour l'inclusion financière
- Contribuer à l'adoption grand public de Bitcoin en Afrique

### Vision Ultime
*Un continent africain où chaque citoyen possède une identité numérique souveraine, où les services publics sont instantanés, transparents et accessibles à tous, et où Bitcoin Lightning est l'infrastructure de paiement par défaut.*

---


## Les Auteurs

**Salif Diallo** **Developpeur Mobile FrontEnd React Native & Web React**
- GitHub: [@MrSalifDiallo](https://github.com/)
- LinkedIn: [Salif Diallo](https://www.linkedin.com/in/salif-diallo-152650313/)
- Mail: [salifdiallo@esp.sn](mailto:salifdiallo@esp.sn)

**Aicha Ndiaye** **Developpeuse Backend**
- GitHub: [@smiley100](https://github.com/smiley100)
- LinkedIn: [Aicha Ndiaye](https://www.linkedin.com/in/ndiaye-aïcha-72ba87331/)
- Mail: [ndiayeaicha0928@gmail.com](mailto:ndiayeaicha0928@gmail.com)


## Github Project 
- GitHubHackathonBTCDays: [@Project Github](https://github.com/HackathonBTCDays/BlockchainLightning)

---
**[Retour en haut](#dioteKo---administrative-certificates-secured-by-bitcoin-lightning) | [English](#english-version)**

---

**DioteKo : Des certificats administratifs du 21ème siècle pour l'Afrique. Rapide. Sûr. Accessible. Propulsé par Bitcoin.**
