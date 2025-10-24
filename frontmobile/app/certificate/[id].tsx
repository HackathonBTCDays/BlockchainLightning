import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Share, ActivityIndicator, Platform, Alert, Linking } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Toast from 'react-native-toast-message';
import { Timeline } from '@/components/ui/Timeline';
import * as Haptics from 'expo-haptics';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
// import * as FileSystem from 'expo-file-system';
import { getCertificateDetails } from '@/services/api';

const CertificateDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(true);
  const [certificateData, setCertificateData] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const certData = await getCertificateDetails(id as string);
      setCertificateData(certData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const copyToClipboard = async (text: string) => {
    // Trigger haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Copy to clipboard
    await Clipboard.setStringAsync(text);
    
    // Hide any existing toast and wait a moment
    Toast.hide();
    
    // Use setTimeout to ensure the toast reappears
    setTimeout(() => {
      Toast.show({
        type: 'success',
        text1: 'Copied to clipboard!',
        visibilityTime: 2000,
      });
    }, 100);
  };

    const handleDownload = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Créer un PDF plus détaillé avec les informations du certificat
      const html = `
        <html>
          <head>
            <style>
              body { 
                font-family: 'Helvetica', sans-serif; 
                text-align: center; 
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 0;
              }
              .certificate-container {
                background: white;
                color: #333;
                padding: 60px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                max-width: 800px;
                margin: 0 auto;
              }
              .header {
                border-bottom: 3px solid #667eea;
                padding-bottom: 30px;
                margin-bottom: 40px;
              }
              h1 { 
                font-size: 36px; 
                color: #667eea;
                margin: 0;
                font-weight: bold;
              }
              h2 { 
                font-size: 28px; 
                color: #333;
                margin: 20px 0;
                font-weight: 600;
              }
              .certificate-id {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin: 20px 0;
                font-family: monospace;
                font-size: 18px;
                color: #667eea;
                border: 2px solid #e9ecef;
              }
              .details {
                text-align: left;
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
              }
              .detail-value {
                color: #333;
                font-family: monospace;
              }
              .footer {
                margin-top: 40px;
                padding-top: 30px;
                border-top: 2px solid #e9ecef;
                color: #666;
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
            </style>
          </head>
          <body>
            <div class="certificate-container">
              <div class="header">
                <h1>🏆 CERTIFICAT NUMÉRIQUE</h1>
                <h2>Certificat de Validation Blockchain</h2>
              </div>
              
              <div class="certificate-id">
                ID: ${certificateData.id}
              </div>
              
              <div class="details">
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
                  <span class="detail-value">${certificateData.status}</span>
                </div>
              </div>
              
              <div class="blockchain-info">
                <div class="blockchain-title">🔗 Sécurisé par Blockchain</div>
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
                <p>Ce certificat est sécurisé et vérifiable sur la blockchain Bitcoin.</p>
                <p>Vérifiez l'authenticité sur: ${certificateData.qrValue}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      
      // Afficher une alerte de confirmation
      Alert.alert(
        "Téléchargement réussi",
        "Le certificat a été généré. Voulez-vous le partager maintenant?",
        [
          {
            text: "Plus tard",
            style: "cancel"
          },
          {
            text: "Partager",
            onPress: async () => {
              try {
                await Sharing.shareAsync(uri);
                Toast.show({
                  type: 'success',
                  text1: 'Certificat partagé avec succès!',
                  visibilityTime: 3000,
                });
              } catch (error) {
                console.error('Error sharing:', error);
                Toast.show({
                  type: 'error',
                  text1: 'Erreur lors du partage',
                  text2: 'Veuillez réessayer',
                  visibilityTime: 3000,
                });
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error downloading:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de téléchargement',
        text2: 'Impossible de générer le certificat',
        visibilityTime: 3000,
      });
    }
  };

  const handleShare = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const shareMessage = `🏆 Certificat Numérique

📋 ID: ${certificateData.id}
📅 Émis le: ${certificateData.issuedDate}
🏢 Émetteur: ${certificateData.issuer}
✅ Statut: ${certificateData.status}

🔗 Sécurisé par Blockchain:
📊 Hash: ${certificateData.hash}
🔐 Transaction: ${certificateData.txid}

Vérifiez l'authenticité: ${certificateData.qrValue}

Powered by Blockchain Certificate System`;
      
      const result = await Share.share({
        message: shareMessage,
        title: 'Certificat Numérique',
      });

      if (result.action === Share.sharedAction) {
        Toast.hide();
        setTimeout(() => {
          Toast.show({
            type: 'success',
            text1: 'Certificat partagé avec succès!',
            visibilityTime: 2000,
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur lors du partage',
        text2: 'Veuillez réessayer',
        visibilityTime: 3000,
      });
    }
  };

  const handleVerifyOnBlockchain = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Ouvrir l'explorateur de blocs pour vérifier la transaction
      const blockExplorerUrl = `https://blockstream.info/testnet/tx/${certificateData.txid}`;
      
      const canOpen = await Linking.canOpenURL(blockExplorerUrl);
      if (canOpen) {
        await Linking.openURL(blockExplorerUrl);
        Toast.show({
          type: 'info',
          text1: 'Ouverture de l\'explorateur de blocs',
          text2: 'Vérifiez la transaction sur Bitcoin Testnet',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Impossible d\'ouvrir l\'explorateur',
          text2: 'Vérifiez votre connexion internet',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Error opening block explorer:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de navigation',
        text2: 'Impossible d\'ouvrir l\'explorateur de blocs',
        visibilityTime: 3000,
      });
    }
  };

  const handleCopyAllDetails = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const allDetails = `Certificat Numérique
ID: ${certificateData.id}
Date d'émission: ${certificateData.issuedDate}
Émetteur: ${certificateData.issuer}
Statut: ${certificateData.status}
Hash SHA-256: ${certificateData.hash}
Transaction ID: ${certificateData.txid}
URL de vérification: ${certificateData.qrValue}`;
      
      await Clipboard.setStringAsync(allDetails);
      
      Toast.hide();
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Détails copiés dans le presse-papiers!',
          visibilityTime: 2000,
        });
      }, 100);
    } catch (error) {
      console.error('Error copying details:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de copie',
        text2: 'Impossible de copier les détails',
        visibilityTime: 3000,
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors['brand.primary']} />
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
      <ScrollView style={styles.container}>
        <View style={[styles.header, { backgroundColor: getStatusColor(certificateData.status, colorScheme ?? 'light') }]}>
          <IconSymbol name={getStatusIcon(certificateData.status)} size={64} color="white" />
          <Text style={[styles.headerTitle, { color: colors['text.inverse'] }]}>{certificateData.id}</Text>
          <Text style={[styles.headerSubtitle, { color: colors['text.inverse'] }]}>{`Issued on ${certificateData.issuedDate}`}</Text>
        </View>

        {certificateData.status === 'Pending' && (
          <Card style={[styles.infoCard, { borderColor: colors['state.warning.fg'] }]}>
            <Text style={[styles.infoTitle, { color: colors['state.warning.fg'] }]}>Issuer</Text>
            <Text style={[styles.infoText, { color: colors['text.secondary'] }]}>{certificateData.issuer}</Text>
          </Card>
        )}

        {certificateData.status === 'Refused' && (
          <Card style={[styles.reasonCard, { borderColor: colors['state.error.fg'] }]}>
            <Text style={[styles.reasonTitle, { color: colors['state.error.fg'] }]}>Reason for Refusal</Text>
            <Text style={[styles.reasonText, { color: colors['text.secondary'] }]}>{certificateData.reason}</Text>
          </Card>
        )}

        <View style={styles.timelineContainer}>
          <Timeline steps={certificateData.timeline.steps} currentStep={certificateData.timeline.currentStep} />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Détails du certificat</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors['text.muted'] }]}>Certificat ID</Text>
            <TouchableOpacity style={styles.copyableValue} onPress={() => copyToClipboard(certificateData.id)}>
              <Text style={[styles.infoValue, { color: colors['text.primary'] }]}>{certificateData.id}</Text>
              <IconSymbol name="square.on.square" size={16} color={colors['text.muted']} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors['text.muted'] }]}>Date d'émission</Text>
            <Text style={[styles.infoValue, { color: colors['text.primary'] }]}>{certificateData.issuedDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors['text.muted'] }]}>Hash SHA-256</Text>
            <TouchableOpacity style={styles.copyableValue} onPress={() => copyToClipboard(certificateData.hash)}>
              <Text style={[styles.infoValue, { color: colors['text.primary'] }]}>{certificateData.hash}</Text>
              <IconSymbol name="square.on.square" size={16} color={colors['text.muted']} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors['text.muted'] }]}>Transaction ID</Text>
            <TouchableOpacity style={styles.copyableValue} onPress={() => copyToClipboard(certificateData.txid)}>
              <Text style={[styles.infoValue, { color: colors['text.primary'] }]}>{certificateData.txid}</Text>
              <IconSymbol name="square.on.square" size={16} color={colors['text.muted']} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.qrContainer}>
          <QRCode value={certificateData.qrValue} size={200} backgroundColor={colors.background} color={colors['text.primary']} />
        </View>

        <View style={styles.actionsContainer}>
          <Button title="Partager" onPress={handleShare} variant="secondary" />
          <Button title="Télécharger PDF" onPress={handleDownload} variant="secondary" style={{ marginHorizontal: 12 }} />
        </View>
        
        <View style={styles.blockchainActionsContainer}>
          <TouchableOpacity 
            style={[styles.blockchainButton, { backgroundColor: colors['brand.primary'] }]} 
            onPress={handleVerifyOnBlockchain}
          >
            <IconSymbol name="link" size={20} color="white" />
            <Text style={[styles.blockchainButtonText, { color: 'white' }]}>Vérifier sur Blockchain</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.copyActionsContainer}>
          <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(certificateData.id)}>
            <IconSymbol name="doc.on.doc" size={16} color={colors['text.primary']} />
            <Text style={[styles.copyButtonText, { color: colors['text.primary'] }]}>Copier ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(certificateData.txid)}>
            <IconSymbol name="doc.on.doc" size={16} color={colors['text.primary']} />
            <Text style={[styles.copyButtonText, { color: colors['text.primary'] }]}>Copier TXID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyAllDetails}>
            <IconSymbol name="doc.on.doc.fill" size={16} color={colors['text.primary']} />
            <Text style={[styles.copyButtonText, { color: colors['text.primary'] }]}>Tout copier</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStatusColor = (status: string, colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  switch (status) {
    case 'Valid':
      return colors['state.success.fg'];
    case 'Pending':
      return colors['state.warning.fg'];
    case 'Expiring Soon':
      return colors['state.error.fg'];
    case 'Refused':
      return colors['state.error.fg'];
    default:
      return colors['text.muted'];
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Valid':
      return 'checkmark.shield.fill';
    case 'Pending':
      return 'hourglass';
    case 'Expiring Soon':
      return 'clock.fill';
    case 'Refused':
      return 'xmark.shield.fill';
    default:
      return 'questionmark.circle.fill';
  }
};

const styles = StyleSheet.create({
  infoCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
  },
  header: {
    alignItems: 'center',
    padding: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 4,
  },
  reasonCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 14,
  },
  timelineContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  detailsContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  copyableValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  blockchainActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  blockchainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blockchainButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  copyActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    minWidth: 80,
    justifyContent: 'center',
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default CertificateDetailScreen;
