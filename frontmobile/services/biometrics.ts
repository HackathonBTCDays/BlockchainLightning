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
  }> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      
      return {
        isSupported: compatible && enrolled,
        hasHardware: compatible,
        isEnrolled: enrolled,
      };
    } catch (error) {
      console.error('Erreur lors de la vérification de la biométrie:', error);
      return { isSupported: false, hasHardware: false, isEnrolled: false };
    }
  }

  /**
   * Lance l'invite native pour le scan biométrique
   * @param promptMessage Message affiché à l'utilisateur
   */
  async promptBiometricScan(promptMessage: string = 'Veuillez vous authentifier pour e-Signet'): Promise<BiometricResult> {
    const { isSupported, hasHardware, isEnrolled } = await this.checkBiometricSupport();

    if (!hasHardware) {
      return { success: false, error: 'Votre appareil ne possède pas de lecteur biométrique.' };
    }

    if (!isEnrolled) {
      return { success: false, error: 'Veuillez configurer une empreinte ou Face ID dans les paramètres de votre téléphone.' };
    }

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
