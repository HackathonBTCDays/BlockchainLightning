import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const PDFViewerScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [certificateData, setCertificateData] = useState({
    id: '123',
    name: 'Extrait de naissance',
    issuedDate: '15 mars 2024',
    issuer: 'Mairie de Dakar',
    status: 'Valid',
    hash: 'a1b2c3d4e5f6...',
    txid: '0xabcdef123456...',
  });

  useEffect(() => {
    // Simuler le chargement des données du certificat
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const generatePDFHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Helvetica', sans-serif;
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .certificate-container {
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #667eea;
              padding-bottom: 30px;
              margin-bottom: 40px;
            }
            .header h1 {
              color: #667eea;
              font-size: 36px;
              margin: 0;
              font-weight: bold;
            }
            .header h2 {
              color: #333;
              font-size: 24px;
              margin: 10px 0;
            }
            .certificate-id {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 10px;
              margin: 20px 0;
              text-align: center;
              border: 2px solid #e9ecef;
            }
            .certificate-id h3 {
              color: #667eea;
              font-size: 20px;
              margin: 0;
              font-family: monospace;
            }
            .details {
              margin: 30px 0;
              background: #f8f9fa;
              padding: 30px;
              border-radius: 15px;
              border-left: 5px solid #667eea;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin: 15px 0;
              padding: 10px 0;
              border-bottom: 1px solid #e9ecef;
            }
            .detail-label {
              font-weight: bold;
              color: #666;
              font-size: 16px;
            }
            .detail-value {
              color: #333;
              font-family: monospace;
              font-size: 16px;
            }
            .blockchain-info {
              background: #e8f5e8;
              border: 2px solid #28a745;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
            }
            .blockchain-title {
              color: #28a745;
              font-weight: bold;
              font-size: 18px;
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 30px;
              border-top: 2px solid #e9ecef;
              text-align: center;
              color: #666;
            }
            .qr-code {
              text-align: center;
              margin: 20px 0;
            }
            .qr-code img {
              max-width: 200px;
              height: auto;
            }
            .status-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              color: white;
              font-weight: bold;
              background: #28a745;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="header">
              <h1>🏆 CERTIFICAT NUMÉRIQUE</h1>
              <h2>Certificat de Validation Blockchain</h2>
            </div>
            
            <div class="certificate-id">
              <h3>ID: ${certificateData.id}</h3>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Nom du certificat:</span>
                <span class="detail-value">${certificateData.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date d'émission:</span>
                <span class="detail-value">${certificateData.issuedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Émetteur:</span>
                <span class="detail-value">${certificateData.issuer}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Statut:</span>
                <span class="detail-value">
                  <span class="status-badge">${certificateData.status}</span>
                </span>
              </div>
            </div>
            
            <div class="blockchain-info">
              <div class="blockchain-title">🔗 Sécurisé par Blockchain Bitcoin</div>
              <div class="detail-row">
                <span class="detail-label">Hash SHA-256:</span>
                <span class="detail-value">${certificateData.hash}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Transaction ID:</span>
                <span class="detail-value">${certificateData.txid}</span>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Ce certificat est sécurisé et vérifiable sur la blockchain Bitcoin.</strong></p>
              <p>Vérifiez l'authenticité en scannant le QR code ou en visitant notre site de vérification.</p>
              <div class="qr-code">
                <!-- QR Code sera généré ici -->
                <div style="width: 150px; height: 150px; background: #f0f0f0; margin: 0 auto; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">
                  QR Code
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handleDownload = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      Alert.alert(
        "Télécharger le certificat",
        "Voulez-vous télécharger ce certificat au format PDF?",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          {
            text: "Télécharger",
            onPress: async () => {
              try {
                setLoading(true);
                
                // Simuler la génération du PDF
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                Toast.show({
                  type: 'success',
                  text1: 'Certificat téléchargé!',
                  text2: 'Le fichier PDF a été sauvegardé',
                  visibilityTime: 3000,
                });
              } catch (error) {
                console.error('Error downloading:', error);
                Toast.show({
                  type: 'error',
                  text1: 'Erreur de téléchargement',
                  text2: 'Impossible de télécharger le certificat',
                  visibilityTime: 3000,
                });
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error handling download:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      Toast.show({
        type: 'info',
        text1: 'Fonctionnalité de partage',
        text2: 'Le partage sera disponible dans la prochaine version',
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handlePayment = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setPaymentSuccess(true);
    } catch (error) {
      console.error('Error handling payment:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de paiement',
        text2: 'Impossible de procéder au paiement',
        visibilityTime: 3000,
      });
    }
  };

  const handlePrint = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      Alert.alert(
        "Imprimer le certificat",
        "Voulez-vous imprimer ce certificat?",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          {
            text: "Imprimer",
            onPress: () => {
              Toast.show({
                type: 'info',
                text1: 'Impression',
                text2: 'La fonction d\'impression sera disponible bientôt',
                visibilityTime: 3000,
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error printing:', error);
    }
  };

  if (paymentSuccess) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.successContainer}>
          <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.icon, { color: '#10B981' }]}>✓</Text>
          </View>
          <Text style={[styles.title, { color: colors['text.primary'] }]}>Paiement réussi !</Text>
          <Text style={[styles.subtitle, { color: colors['text.secondary'] }]}>
            Votre certificat a été validé et est maintenant disponible.
          </Text>
          <Button
            title="Retour"
            onPress={() => router.back()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <IconSymbol name="doc.text.fill" size={64} color={colors['brand.primary']} />
          <Text style={[styles.loadingText, { color: colors['text.primary'] }]}>
            Chargement du certificat...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.pdfContainer}>
          <WebView
            source={{ html: generatePDFHTML() }}
            style={styles.webview}
            scalesPageToFit={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}
          />
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Confirmer et Payer"
            onPress={handlePayment}
            variant="primary"
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Imprimer"
            onPress={handlePrint}
            variant="secondary"
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Partager"
            onPress={handleShare}
            variant="secondary"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 16,
  },
  pdfContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  webview: {
    flex: 1,
  },
  actionsContainer: {
    marginBottom: 32,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
});

export default PDFViewerScreen;