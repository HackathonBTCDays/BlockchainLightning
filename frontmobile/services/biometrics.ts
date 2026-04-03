import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export interface BiometricResult {
  success: boolean;
  error?: string;
  data?: any;
}

class BiometricService {
  /**
   * Vérifie si l'appareil supporte et possède une configuration biométrique
   */
  async checkBiometricSupport(): Promise<{
    isSupported: boolean;
    hasHardware: boolean;
    isEnrolled: boolean;
    supportedTypes: string[];
  }> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      
      // Récupérer les types de biométrie gérés par CE téléphone
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const supportedTypes: string[] = [];
      
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        supportedTypes.push('Empreinte Digitale');
      }
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        supportedTypes.push('Reconnaissance Faciale');
      }
      if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        supportedTypes.push('Scanner Iris');
      }
      
      return {
        isSupported: compatible && enrolled,
        hasHardware: compatible,
        isEnrolled: enrolled,
        supportedTypes
      };
    } catch (error) {
      console.error('Erreur lors de la vérification de la biométrie:', error);
      return { isSupported: false, hasHardware: false, isEnrolled: false, supportedTypes: [] };
    }
  }

  /**
   * Lance l'invite native pour le scan biométrique
   * @param promptMessage Message affiché à l'utilisateur
   */
  async promptBiometricScan(): Promise<BiometricResult> {
    const { isSupported, hasHardware, isEnrolled, supportedTypes } = await this.checkBiometricSupport();

    if (!hasHardware) {
      return { success: false, error: 'Votre appareil ne possède pas de lecteur biométrique.' };
    }

    if (!isEnrolled) {
      return { success: false, error: 'Veuillez configurer une empreinte ou le Face ID dans les paramètres de votre téléphone.' };
    }

    // Message dynamique
    const typeNames = supportedTypes.join(' ou ');
    const promptMessage = `Veuillez vous authentifier par ${typeNames} pour e-Signet`;

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Annuler',
        fallbackLabel: 'Utiliser Mot de passe',
        disableDeviceFallback: true, // Si true, force la biométrie au lieu du code PIN du téléphone
      });

      if (result.success) {
        return { 
          success: true, 
          // En hackathon/POC, retourner une fausse payload JWT pour simuler e-Signet
          data: {
             challengeResolved: true,
             format: "mock-biometric-jwt",
             timestamp: new Date().toISOString()
          }
        };
      } else {
        return { success: false, error: result.error || 'Authentification annulée ou échouée.' };
      }
    } catch (error) {
       return { success: false, error: 'Erreur inattendue lors de la capture biométrique.' };
    }
  }
}

export const biometricService = new BiometricService();
