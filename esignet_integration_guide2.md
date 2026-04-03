# Guide Complet — Intégration MOSIP eSignet (OIDC/OAuth2)

---

## Architecture des Services

### Ports et Services

| Port | Service | Rôle |
|------|---------|------|
| `8088` | **eSignet Core** | Serveur OIDC principal — authorize, token, userinfo |
| `8089` | **eSignet Signup** | Service d'inscription et reset mot de passe *(optionnel)* |
| `3001` | **Ton Backend** | App cliente qui reçoit le callback OAuth2 |

---

## localhost:8089 — eSignet Signup Service

### Pourquoi tu ne le vois pas dans ton docker-compose ?

Le `docker-compose` de base fourni par MOSIP (`mosip/esignet`) **ne contient pas** le service Signup.
C'est un **dépôt séparé** : `github.com/mosip/esignet-signup` qui doit être déployé indépendamment.

### Deux repos distincts

```
mosip/esignet              → eSignet Core (port 8088) ← TON docker-compose actuel
mosip/esignet-signup       → Signup Service (port 8089) ← PAS dans ton docker-compose
```

### C'est quoi exactement ?

`localhost:8089` = **eSignet Signup Service** — gère uniquement :

| URL | Fonction |
|-----|---------|
| `/signup` | Créer un nouveau compte utilisateur |
| `/reset-password` | Mot de passe oublié |
| `/identity-verification` | Vérification eKYC |

Ces URLs apparaissent dans la réponse Authorize uniquement pour informer le frontend
des liens à afficher (bouton "S'inscrire", "Mot de passe oublié").

### Dois-tu le lancer ?

**NON** — si tu utilises Postman pour créer des utilisateurs test.

> La communauté MOSIP recommande d'utiliser le Postman **"Create User"** 
> (dossier User Mgmt) pour créer des utilisateurs de test — c'est plus simple.
> Le Signup Service est uniquement nécessaire si tu veux l'UI complète d'inscription.

### Si tu veux quand même le lancer

```bash
# Cloner le repo séparé
git clone https://github.com/mosip/esignet-signup
cd esignet-signup/docker-compose
docker-compose up -d
# → démarre sur port 8089
```

---

## Concept — Claims, Scopes et Niveaux de Configuration

### La hiérarchie des Claims

```
Niveau 1 — Création Client OIDC (une fois)
  userClaims: ["name","email","gender","phone_number","picture","birthdate"]
  └── Définit les claims MAXIMUM autorisés pour ce client
  └── Pour ajouter de nouveaux claims → Update OIDC Client

Niveau 2 — Requête Authorize (par session)
  claims: {
    "id_token": {"name": {}, "email": {}},
    "userinfo": {"name": {}, "email": {}, "gender": {}, ...}
  }
  └── Claims demandés pour CETTE session
  └── Doit être un sous-ensemble des userClaims enregistrés

Niveau 3 — Auth-Code / Consent (par utilisateur)
  acceptedClaims: ["name", "email", "gender", ...]
  └── Ce que l'UTILISATEUR consent à partager
  └── Doit être un sous-ensemble des claims retournés par Authorize
```

### Scopes vs Claims

```
Scopes → définissent les GROUPES de claims accessibles
Claims → définissent les DONNÉES précises à retourner
```

| Scope | Claims inclus |
|-------|--------------|
| `openid` | `sub` (identifiant unique — obligatoire OIDC) |
| `profile` | `name`, `gender`, `birthdate`, `picture` |
| `email` | `email` |
| `phone` | `phone_number` |

### Rôle des `permittedAuthorizeScopes` dans Auth-Code

Les `permittedAuthorizeScopes` = les scopes que l'utilisateur **autorise** ton app
à utiliser dans les tokens. Cela détermine quels claims seront accessibles via `/userinfo`.

### Peut-on modifier Claims et Scopes ?

**OUI** — mais à chaque niveau de façon différente :

| Action | Comment |
|--------|---------|
| Ajouter un nouveau claim (`address`) | Update OIDC Client → ajouter dans `userClaims` |
| Demander moins de claims par session | Modifier le body Authorize → `claims` |
| L'utilisateur refuse certains claims | Il retire de `acceptedClaims` dans l'écran consent |
| Ajouter un nouveau scope custom | Configurer dans eSignet côté serveur + Update Client |

### Pourquoi `acceptedClaims` était vide ?

La réponse Authorize te retourne :
```json
"essentialClaims": ["name", "email"],
"voluntaryClaims": ["birthdate", "gender", "phone_number", "picture"]
```

`acceptedClaims` = **union des deux** que l'utilisateur accepte de partager.
Si la variable n'était pas settée, le body envoyait un array vide `[]`.

---

## Flow Complet OAuth2 avec PKCE

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│  Postman /  │         │   eSignet    │         │  Ton Backend │
│  Frontend   │         │   :8088      │         │    :3001     │
└──────┬──────┘         └──────┬───────┘         └──────┬───────┘
       │                       │                        │
       │ 1. GET /csrf-token    │                        │
       │──────────────────────>│                        │
       │<── csrfToken ─────────│                        │
       │                       │                        │
       │ 2. POST /authorize/v3/oauth-details            │
       │   (clientId, claims,  │                        │
       │    codeChallenge,     │                        │
       │    redirectUri)       │                        │
       │──────────────────────>│                        │
       │<── transactionId ─────│                        │
       │    (valide 5 min !)   │                        │
       │                       │                        │
       │ 3. POST /send-otp     │                        │
       │   (transactionId,     │                        │
       │    individualId)      │                        │
       │──────────────────────>│                        │
       │<── maskedEmail/phone ─│                        │
       │                       │                        │
       │ 4. POST /authenticate │                        │
       │   (transactionId,     │                        │
       │    OTP reçu)          │                        │
       │──────────────────────>│                        │
       │<── transactionId ─────│                        │
       │                       │                        │
       │ 5. POST /auth-code    │                        │
       │   (transactionId,     │                        │
       │    acceptedClaims)    │                        │
       │──────────────────────>│                        │
       │<── redirectUri?code=X │                        │
       │                       │                        │
       │                       │ 6. POST /token         │
       │                       │   (code, codeVerifier) │
       │                       │<───────────────────────│
       │                       │── access_token ───────>│
       │                       │   id_token             │
       │                       │                        │
       │                       │ 7. GET /userinfo        │
       │                       │<───────────────────────│
       │                       │── user claims ────────>│
```

---

## Étapes Détaillées

### Étape 0 — Pré-requis PKCE (Pre-request script)

```javascript
const codeVerifier = generateRandomString(64);
const codeChallenge = await generateCodeChallenge(codeVerifier);
pm.environment.set("codeVerifier", codeVerifier);
pm.environment.set("codeChallenge", codeChallenge);
pm.environment.set("codeChallengeMethod", "S256");
```

### Étape 1 — GET CSRF Token

```
GET http://localhost:8088/v1/esignet/csrf-token
```

**Post-response script :**
```javascript
var token = pm.response.json().token;
pm.environment.set("csrftoken", token);
```

### Étape 2 — POST Authorize (oauth-details)

```
POST http://localhost:8088/v1/esignet/authorization/v3/oauth-details
Headers:
  X-XSRF-TOKEN: {{csrftoken}}
```

**Body :**
```json
{
    "requestTime": "{{$isoTimestamp}}",
    "request": {
        "clientId": "{{client_id}}",
        "scope": "openid profile email phone",
        "responseType": "code",
        "redirectUri": "{{redirection_url}}",
        "display": "popup",
        "prompt": "login",
        "acrValues": "mosip:idp:acr:generated-code",
        "claims": {
            "id_token": {
                "name": {"essential": true},
                "email": {"essential": true}
            },
            "userinfo": {
                "name": {"essential": true},
                "email": {"essential": true},
                "gender": {"essential": false},
                "phone_number": {"essential": false},
                "picture": {"essential": false},
                "birthdate": {"essential": false}
            }
        },
        "nonce": "{{$randomAlphaNumeric}}",
        "state": "{{state}}",
        "claimsLocales": "en",
        "codeChallenge": "{{codeChallenge}}",
        "codeChallengeMethod": "{{codeChallengeMethod}}"
    }
}
```

**Post-response script :**
```javascript
var jsonData = pm.response.json();
var transactionId = jsonData.response.transactionId;
pm.environment.set("transactionId", transactionId);

// Hash du transactionId pour le header suivant
var hash = CryptoJS.SHA256(transactionId).toString(CryptoJS.enc.Base64url);
pm.environment.set("oauthdetailshash", hash);

// Auto-setter les acceptedClaims depuis la réponse
var essential = jsonData.response.essentialClaims || [];
var voluntary = jsonData.response.voluntaryClaims || [];
var allClaims = essential.concat(voluntary);
pm.environment.set("acceptedClaims", JSON.stringify(allClaims));

console.log("transactionId:", transactionId);
console.log("acceptedClaims:", JSON.stringify(allClaims));
```

> ⚠️ **TIMEOUT = 5 minutes** (`preauth-screen-timeout-in-secs: 300`)
> Enchaîner les étapes 3, 4, 5 en moins de 5 minutes !

### Étape 3 — POST Send OTP

```
POST http://localhost:8088/v1/esignet/authorization/send-otp
Headers:
  X-XSRF-TOKEN: {{csrftoken}}
  oauth-details-key: {{transactionId}}
  oauth-details-hash: {{oauthdetailshash}}
```

**Body :**
```json
{
    "requestTime": "{{$isoTimestamp}}",
    "request": {
        "transactionId": "{{transactionId}}",
        "individualId": "{{individualid}}",
        "otpChannels": ["email", "phone"],
        "captchaToken": "dummy"
    }
}
```

### Étape 4 — POST Authenticate

```
POST http://localhost:8088/v1/esignet/authorization/authenticate
Headers:
  X-XSRF-TOKEN: {{csrftoken}}
  oauth-details-key: {{transactionId}}
  oauth-details-hash: {{oauthdetailshash}}
```

**Body :**
```json
{
    "requestTime": "{{$isoTimestamp}}",
    "request": {
        "transactionId": "{{transactionId}}",
        "individualId": "{{individualid}}",
        "challengeList": [
            {
                "authFactorType": "OTP",
                "challenge": "{{otp}}",
                "format": "alpha-numeric"
            }
        ]
    }
}
```

### Étape 5 — POST Auth-Code (Consent)

```
POST http://localhost:8088/v1/esignet/authorization/auth-code
Headers:
  X-XSRF-TOKEN: {{csrftoken}}
  oauth-details-key: {{transactionId}}
  oauth-details-hash: {{oauthdetailshash}}
```

**Body :**
```json
{
    "requestTime": "{{$isoTimestamp}}",
    "request": {
        "transactionId": "{{transactionId}}",
        "acceptedClaims": {{acceptedClaims}},
        "permittedAuthorizeScopes": ["openid", "profile", "email", "phone"]
    }
}
```

**Post-response script :**
```javascript
var jsonData = pm.response.json();
var code = jsonData.response.code;
pm.environment.set("authCode", code);
console.log("auth code:", code);
```

### Étape 6 — POST Token

```
POST http://localhost:8088/v1/esignet/oauth/v2/token
```

**Body (form-urlencoded) :**
```
code                  = {{authCode}}
client_id             = {{client_id}}
redirect_uri          = {{redirection_url}}
grant_type            = authorization_code
code_verifier         = {{codeVerifier}}
client_assertion_type = urn:ietf:params:oauth:client-assertion-type:jwt-bearer
client_assertion      = {{client_assertion_jwt}}
```

### Étape 7 — GET UserInfo

```
GET http://localhost:8088/v1/esignet/oidc/userinfo
Headers:
  Authorization: Bearer {{access_token}}
```


### Etape 8 User Infos will be encoded in the access_token (JWT) and can be decoded with jwt.io or similar tools.
Parfait ! Ton `userinfo` répond toujours en `application/jwt` avec **116666 bytes**, ce qui est **exactement normal pour eSignet** – ça veut dire que ça marche !. Le "long string" que tu vois dans Postman est le **JWT contenant tes user infos**, pas une erreur. 

#### Format standard
Le guide confirme que `userinfo` renvoie un JWT signé, pas un JSON brut. Il faut **décoder la payload** du JWT pour voir les claims `name`, `email`, etc..

#### Comment voir tes user infos maintenant
1. **Copie le JWT complet** de la réponse `userinfo` (celui de 116666 chars dans l’éditeur Postman).
2. **Va sur jwt.io** et colle-le dans le champ "Encoded".
3. **La partie "Decoded" → "Payload"** te montrera exactement tes infos utilisateur (sub, name, email, gender, phonenumber, picture, birthdate si configurés). 

## Pourquoi c’est long
116666 chars = JWT avec tes données + signature. Le fichier `paste.txt` que tu as joint contient déjà ce JWT décodé, et on y voit bien des claims comme `name: "Siddharth K Mansour"`, `email: "siddhartha.km@gmail.com"`, `gender: "Male"`, `phone_number: "+919427357934"`, `birthdate: "1987/11/25"`. 

---

## Variables d'Environnement Postman

| Variable | Valeur | Description |
|----------|--------|-------------|
| `url` | `http://localhost:8088` | URL eSignet principal |
| `client_id` | Auto (post Create Client) | ID du client OIDC |
| `client_public_key` | Auto (pre-request) | Clé publique JWK |
| `client_private_key` | Auto (pre-request) | Clé privée JWK |
| `redirection_url` | `http://localhost:3001/api/auth/esignet/callback` | Callback ton backend |
| `individualid` | `8267411571` | ID de l'utilisateur test |
| `csrftoken` | Auto (GET /csrf-token) | Token CSRF |
| `transactionId` | Auto (POST /authorize) | ID de transaction |
| `oauthdetailshash` | Auto (SHA256 transactionId) | Hash pour headers |
| `acceptedClaims` | Auto (POST /authorize) | Claims acceptés par l'utilisateur |
| `codeVerifier` | Auto (PKCE pre-request) | PKCE verifier |
| `codeChallenge` | Auto (PKCE pre-request) | PKCE challenge |
| `authCode` | Auto (POST /auth-code) | Code OAuth2 |
| `access_token` | Auto (POST /token) | Token d'accès |

---

## Erreurs Courantes et Solutions

| Erreur | Cause | Solution |
|--------|-------|---------|
| `invalid_transaction` | Transaction expirée (> 5 min) | Relancer depuis /authorize |
| `invalid_redirect_uri` | URI ne correspond pas au client | Vérifier `redirection_url` == URI enregistrée |
| `unknown_error` (claims array) | `claims` en array au lieu d'objet | Utiliser `{"id_token": {...}, "userinfo": {...}}` |
| `unknown_error` (claimsLocales) | `claimsLocales` en array | Utiliser `"claimsLocales": "en"` (string) |
| `unknown_error` (emoji/char) | Caractères spéciaux dans JSON | Ne jamais mettre d'emoji dans le body |
| `invalid_request` (requestTime) | `{{isoTimestamp}}` sans `$` | Utiliser `{{$isoTimestamp}}` |
| `acceptedClaims` vide | Variable non settée | Utiliser le post-response script de l'étape 2 |
