import { useState } from 'react';
import { biometricService } from '../services/biometrics';

export const useAuthCapture = () => {
  const [isPasswordPromptVisible, setIsPasswordPromptVisible] = useState(false);
  const [passwordResolver, setPasswordResolver] = useState<((pwd: string | null) => void) | null>(null);

  /**
   * Lance la capture Biométrique native
   * Ton camarade va appeler: const bioResult = await requestBiometrics()
   */
  const requestBiometrics = async (promptMessage?: string) => {
    return await biometricService.promptBiometricScan(promptMessage);
  };

  /**
   * Lance l'écran de saisie de mot de passe
   * Ton camarade va appeler: const pwd = await promptPassword()
   * Attention : il doit intégrer le composant <PasswordModal /> retourné par ce hook dans son UI.
   */
  const promptPassword = (): Promise<string | null> => {
    return new Promise((resolve) => {
      setPasswordResolver(() => resolve);
      setIsPasswordPromptVisible(true);
    });
  };

  const cancelPasswordPrompt = () => {
    if (passwordResolver) {
      passwordResolver(null); // On renvoie null si annulé
    }
    setIsPasswordPromptVisible(false);
    setPasswordResolver(null);
  };

  const submitPasswordPrompt = (password: string) => {
    if (passwordResolver) {
      passwordResolver(password);
    }
    setIsPasswordPromptVisible(false);
    setPasswordResolver(null);
  };

  return {
    requestBiometrics,
    promptPassword,
    // Etats et fonctions à utiliser avec le <AuthPrompt visible={...} />
    passwordPromptProps: {
      visible: isPasswordPromptVisible,
      onCancel: cancelPasswordPrompt,
      onSubmit: submitPasswordPrompt
    }
  };
};
