import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

const QRScannerScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [paymentData, setPaymentData] = useState({
    amount: 1500,
    invoice: 'lnbc15u1p3...',
    memo: 'Paiement - Extrait de naissance',
    expiry: 3600,
  });
  const [timeLeft, setTimeLeft] = useState(paymentData.expiry);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          Alert.alert(
            'Facture expirée',
            'La facture Lightning a expiré. Voulez-vous en générer une nouvelle?',
            [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Nouvelle facture', onPress: generateNewInvoice }
            ]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const generateNewInvoice = async (): Promise<void> => {
    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Simuler la génération d'une nouvelle facture
      const newInvoice = {
        amount: paymentData.amount,
        invoice: 'lnbc15u1p3...' + Math.random().toString(36).substr(2, 9),
        memo: paymentData.memo,
        expiry: 3600,
      };
      
      setPaymentData(newInvoice);
      setTimeLeft(newInvoice.expiry);
      
      Toast.show({
        type: 'success',
        text1: 'Nouvelle facture générée!',
        text2: 'Scannez le nouveau QR code',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Error generating new invoice:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de générer une nouvelle facture',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyInvoice = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await Clipboard.setStringAsync(paymentData.invoice);
      
      Toast.hide();
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Facture copiée!',
          text2: 'Collez-la dans votre portefeuille Lightning',
          visibilityTime: 2000,
        });
      }, 100);
    } catch (error) {
      console.error('Error copying invoice:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de copie',
        text2: 'Impossible de copier la facture',
        visibilityTime: 3000,
      });
    }
  };

  const handlePaymentComplete = () => {
    Alert.alert(
      'Paiement détecté!',
      'Votre paiement a été confirmé. Le certificat est en cours de génération.',
      [
        {
          text: 'Voir le certificat',
          onPress: () => router.push('/certificate/123')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors['text.primary'] }]}>Scanner QR Code</Text>
        <Text style={[styles.subtitle, { color: colors['text.secondary'] }]}>
          Scannez ce QR code avec votre portefeuille Lightning pour effectuer le paiement.
        </Text>

        {/* Informations de paiement */}
        <Card style={styles.paymentInfoCard}>
          <View style={styles.paymentHeader}>
            <IconSymbol name="creditcard.fill" size={24} color={colors['brand.primary']} />
            <Text style={[styles.paymentTitle, { color: colors['text.primary'] }]}>Détails du paiement</Text>
          </View>
          
          <View style={styles.paymentDetails}>
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: colors['text.secondary'] }]}>Montant:</Text>
              <Text style={[styles.paymentValue, { color: colors['brand.primary'] }]}>{paymentData.amount} sats</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: colors['text.secondary'] }]}>Description:</Text>
              <Text style={[styles.paymentValue, { color: colors['text.primary'] }]}>{paymentData.memo}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: colors['text.secondary'] }]}>Expire dans:</Text>
              <Text style={[styles.paymentValue, { color: timeLeft < 300 ? colors['state.error.fg'] : colors['text.primary'] }]}>
                {formatTime(timeLeft)}
              </Text>
            </View>
          </View>
        </Card>

        {/* QR Code */}
        <Card style={styles.qrCard}>
          <Text style={[styles.qrTitle, { color: colors['text.primary'] }]}>Scanner QR Code</Text>
          <View style={styles.qrContainer}>
            <QRCode 
              value={paymentData.invoice} 
              size={250} 
              backgroundColor={colors.background} 
              color={colors['text.primary']} 
            />
          </View>
          <Text style={[styles.qrSubtitle, { color: colors['text.secondary'] }]}>
            Ouvrez votre portefeuille Lightning et scannez ce code
          </Text>
        </Card>

        {/* Instructions */}
        <Card style={styles.instructionsCard}>
          <Text style={[styles.instructionsTitle, { color: colors['text.primary'] }]}>Comment payer:</Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <IconSymbol name="1.circle.fill" size={20} color={colors['brand.primary']} />
              <Text style={[styles.instructionText, { color: colors['text.secondary'] }]}>
                Ouvrez votre portefeuille Lightning (Phoenix, Breez, etc.)
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <IconSymbol name="2.circle.fill" size={20} color={colors['brand.primary']} />
              <Text style={[styles.instructionText, { color: colors['text.secondary'] }]}>
                Appuyez sur "Scanner" ou "Recevoir"
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <IconSymbol name="3.circle.fill" size={20} color={colors['brand.primary']} />
              <Text style={[styles.instructionText, { color: colors['text.secondary'] }]}>
                Scannez le QR code ci-dessus
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <IconSymbol name="4.circle.fill" size={20} color={colors['brand.primary']} />
              <Text style={[styles.instructionText, { color: colors['text.secondary'] }]}>
                Confirmez le paiement
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Copier la facture"
            onPress={copyInvoice}
            variant="secondary"
            style={{ marginBottom: 12 }}
          />
          <Button
            title={loading ? "Génération..." : "Nouvelle facture"}
            onPress={generateNewInvoice}
            variant="secondary"
            style={{ marginBottom: 12, opacity: loading ? 0.5 : 1 }}
          />
          <Button
            title="Simuler paiement (Test)"
            onPress={handlePaymentComplete}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  paymentInfoCard: {
    padding: 20,
    marginBottom: 20,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  paymentDetails: {
    gap: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  qrCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  qrContainer: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  instructionsCard: {
    padding: 20,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  actionsContainer: {
    marginBottom: 32,
  },
});

export default QRScannerScreen;