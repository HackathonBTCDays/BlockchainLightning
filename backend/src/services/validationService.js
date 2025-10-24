import crypto from 'crypto';

class ValidationService {
  constructor() {
    // Règles de validation pour chaque type de certificat
    this.validationRules = {
      birth: {
        required: ['firstName', 'lastName', 'dateOfBirth', 'placeOfBirth'],
        optional: ['fatherName', 'motherName', 'nationality'],
        countrySpecific: {
          'SN': { // Sénégal
            required: ['fatherName', 'motherName'],
            nationality: 'Sénégalaise',
            allowedRegions: ['Dakar', 'Thiès', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Ziguinchor']
          }
        }
      },
      marriage: {
        required: ['spouse1Name', 'spouse2Name', 'marriageDate', 'marriagePlace'],
        optional: ['witness1Name', 'witness2Name'],
        countrySpecific: {
          'SN': {
            required: ['spouse1Name', 'spouse2Name', 'marriageDate', 'marriagePlace'],
            allowedRegions: ['Dakar', 'Thiès', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Ziguinchor']
          }
        }
      },
      death: {
        required: ['deceasedName', 'deathDate', 'deathPlace'],
        optional: ['causeOfDeath', 'informantName'],
        countrySpecific: {
          'SN': {
            required: ['deceasedName', 'deathDate', 'deathPlace'],
            allowedRegions: ['Dakar', 'Thiès', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Ziguinchor']
          }
        }
      },
      residence: {
        required: ['fullName', 'address', 'residenceDate'],
        optional: ['landlordName', 'witnessName'],
        countrySpecific: {
          'SN': {
            required: ['fullName', 'address', 'residenceDate'],
            allowedRegions: ['Dakar', 'Thiès', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Ziguinchor']
          }
        }
      },
      identity: {
        required: ['fullName', 'dateOfBirth', 'placeOfBirth', 'nationality'],
        optional: ['idNumber', 'profession'],
        countrySpecific: {
          'SN': {
            required: ['fullName', 'dateOfBirth', 'placeOfBirth'],
            nationality: 'Sénégalaise',
            allowedRegions: ['Dakar', 'Thiès', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Ziguinchor']
          }
        }
      }
    };
  }

  /**
   * Valide les données d'un certificat selon les règles définies
   * @param {Object} userData - Données utilisateur
   * @param {string} certificateType - Type de certificat
   * @param {string} country - Pays (par défaut 'SN' pour Sénégal)
   * @returns {Object} Résultat de la validation
   */
  validateCertificateData(userData, certificateType, country = 'SN') {
    try {
      const rules = this.validationRules[certificateType];
      if (!rules) {
        return {
          valid: false,
          error: 'Type de certificat non supporté',
          code: 'INVALID_CERTIFICATE_TYPE'
        };
      }

      const countryRules = rules.countrySpecific[country];
      if (!countryRules) {
        return {
          valid: false,
          error: 'Pays non supporté',
          code: 'UNSUPPORTED_COUNTRY'
        };
      }

      const errors = [];
      const warnings = [];

      // Validation des champs requis
      const requiredFields = [...rules.required, ...countryRules.required];
      for (const field of requiredFields) {
        if (!userData[field] || userData[field].trim() === '') {
          errors.push(`Le champ ${field} est requis`);
        }
      }

      // Validation spécifique au pays
      if (countryRules.nationality && userData.nationality !== countryRules.nationality) {
        errors.push(`La nationalité doit être ${countryRules.nationality}`);
      }

      // Validation des régions pour le Sénégal
      if (country === 'SN' && countryRules.allowedRegions) {
        if (userData.placeOfBirth && !countryRules.allowedRegions.includes(userData.placeOfBirth)) {
          warnings.push(`La région ${userData.placeOfBirth} n'est pas reconnue`);
        }
        if (userData.marriagePlace && !countryRules.allowedRegions.includes(userData.marriagePlace)) {
          warnings.push(`La région ${userData.marriagePlace} n'est pas reconnue`);
        }
        if (userData.deathPlace && !countryRules.allowedRegions.includes(userData.deathPlace)) {
          warnings.push(`La région ${userData.deathPlace} n'est pas reconnue`);
        }
      }

      // Validation des dates
      if (userData.dateOfBirth) {
        const birthDate = new Date(userData.dateOfBirth);
        const today = new Date();
        if (birthDate > today) {
          errors.push('La date de naissance ne peut pas être dans le futur');
        }
        if (today.getFullYear() - birthDate.getFullYear() > 120) {
          warnings.push('L\'âge semble anormalement élevé');
        }
      }

      if (userData.marriageDate) {
        const marriageDate = new Date(userData.marriageDate);
        const today = new Date();
        if (marriageDate > today) {
          errors.push('La date de mariage ne peut pas être dans le futur');
        }
        if (userData.dateOfBirth) {
          const birthDate = new Date(userData.dateOfBirth);
          const ageAtMarriage = marriageDate.getFullYear() - birthDate.getFullYear();
          if (ageAtMarriage < 18) {
            errors.push('L\'âge minimum pour le mariage est de 18 ans');
          }
        }
      }

      if (userData.deathDate) {
        const deathDate = new Date(userData.deathDate);
        const today = new Date();
        if (deathDate > today) {
          errors.push('La date de décès ne peut pas être dans le futur');
        }
      }

      // Validation des noms
      if (userData.firstName && userData.firstName.length < 2) {
        errors.push('Le prénom doit contenir au moins 2 caractères');
      }
      if (userData.lastName && userData.lastName.length < 2) {
        errors.push('Le nom de famille doit contenir au moins 2 caractères');
      }

      // Validation de l'email si fourni
      if (userData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          errors.push('Format d\'email invalide');
        }
      }

      // Validation du téléphone si fourni
      if (userData.phone) {
        const phoneRegex = /^(\+221|221)?[0-9]{9}$/;
        if (!phoneRegex.test(userData.phone.replace(/\s/g, ''))) {
          errors.push('Format de téléphone invalide (format attendu: +221 XX XXX XX XX)');
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        validatedData: this.sanitizeData(userData),
        validationId: this.generateValidationId()
      };

    } catch (error) {
      console.error('Error validating certificate data:', error.message);
      return {
        valid: false,
        error: 'Erreur de validation interne',
        code: 'VALIDATION_ERROR'
      };
    }
  }

  /**
   * Nettoie et sécurise les données utilisateur
   * @param {Object} userData - Données utilisateur
   * @returns {Object} Données nettoyées
   */
  sanitizeData(userData) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(userData)) {
      if (typeof value === 'string') {
        // Supprimer les caractères dangereux et normaliser
        sanitized[key] = value
          .trim()
          .replace(/[<>\"'&]/g, '') // Supprimer les caractères HTML dangereux
          .replace(/\s+/g, ' '); // Normaliser les espaces
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * Génère un ID de validation unique
   * @returns {string} ID de validation
   */
  generateValidationId() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Vérifie si un utilisateur peut demander un certificat
   * @param {Object} userData - Données utilisateur
   * @param {string} certificateType - Type de certificat
   * @returns {Object} Résultat de la vérification
   */
  canRequestCertificate(userData, certificateType) {
    try {
      // Vérifier si l'utilisateur a déjà demandé ce type de certificat récemment
      const validationResult = this.validateCertificateData(userData, certificateType);
      
      if (!validationResult.valid) {
        return {
          canRequest: false,
          reason: 'Données de validation invalides',
          errors: validationResult.errors
        };
      }

      // Vérifications supplémentaires selon le type de certificat
      switch (certificateType) {
        case 'birth':
          if (!userData.dateOfBirth) {
            return {
              canRequest: false,
              reason: 'Date de naissance requise pour un extrait de naissance'
            };
          }
          break;
          
        case 'marriage':
          if (!userData.spouse1Name || !userData.spouse2Name) {
            return {
              canRequest: false,
              reason: 'Noms des deux époux requis pour un certificat de mariage'
            };
          }
          break;
          
        case 'death':
          if (!userData.deceasedName) {
            return {
              canRequest: false,
              reason: 'Nom du défunt requis pour un certificat de décès'
            };
          }
          break;
      }

      return {
        canRequest: true,
        validationId: validationResult.validationId,
        validatedData: validationResult.validatedData
      };

    } catch (error) {
      console.error('Error checking certificate request eligibility:', error.message);
      return {
        canRequest: false,
        reason: 'Erreur de vérification interne',
        code: 'ELIGIBILITY_CHECK_ERROR'
      };
    }
  }

  /**
   * Valide un paiement Lightning
   * @param {Object} paymentData - Données de paiement
   * @returns {Object} Résultat de la validation
   */
  validatePayment(paymentData) {
    try {
      const { amount, paymentRequest, paymentHash } = paymentData;

      if (!amount || amount <= 0) {
        return {
          valid: false,
          error: 'Montant de paiement invalide'
        };
      }

      if (!paymentRequest || !paymentHash) {
        return {
          valid: false,
          error: 'Données de paiement Lightning manquantes'
        };
      }

      // Vérifier le format du payment request (BOLT11)
      if (!paymentRequest.startsWith('lnbc')) {
        return {
          valid: false,
          error: 'Format de facture Lightning invalide'
        };
      }

      return {
        valid: true,
        paymentData: {
          amount,
          paymentRequest,
          paymentHash,
          validatedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error validating payment:', error.message);
      return {
        valid: false,
        error: 'Erreur de validation du paiement'
      };
    }
  }
}

export default new ValidationService();
