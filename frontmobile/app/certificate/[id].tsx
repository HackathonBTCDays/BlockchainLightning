import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

// Mock data for demonstration
const certificateData = {
  id: '#A1B2C3D4E5F6',
  issuedDate: '15 mars 2024, 10:30',
  hash: '1234...7890',
  txid: '0xabcdef...123456',
  qrValue: 'https://example.com/verify/A1B2C3D4E5F6',
};

const CertificateDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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

  const handleShare = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const result = await Share.share({
        message: `Certificate Details\n\nCertificate ID: ${certificateData.id}\nIssued: ${certificateData.issuedDate}\nHash: ${certificateData.hash}\nTransaction ID: ${certificateData.txid}\n\nVerify: ${certificateData.qrValue}`,
        title: 'Share Certificate',
      });

      if (result.action === Share.sharedAction) {
        Toast.hide();
        setTimeout(() => {
          Toast.show({
            type: 'success',
            text1: 'Certificate shared successfully!',
            visibilityTime: 2000,
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Certificat', headerBackTitle: 'Back' }} />
      <ScrollView style={styles.container}>
        <Image source={{ uri: 'https://cmsphoto.ww-cdn.com/superstatic/16216/art/grande/42887493-35586288.jpg?v=1582029747' }} style={styles.headerImage} />

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
          <Button title="Télécharger" onPress={() => {}} variant="secondary" style={{ marginHorizontal: 12 }} />
        </View>
        <View style={styles.copyActionsContainer}>
          <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(certificateData.id)}>
            <Text style={[styles.copyButtonText, { color: colors['text.primary'] }]}>Copier certId</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(certificateData.txid)}>
            <Text style={[styles.copyButtonText, { color: colors['text.primary'] }]}>Copier txid</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
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
  },
  copyActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingHorizontal: 24,
  },
  copyButton: {
    padding: 12,
    borderRadius: 8,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CertificateDetailScreen;
