import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '@/Provider/AppContext';
import { API_BASE_URL } from '@/config/config';
import { useRouter } from 'expo-router';

const PDFViewerScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { certificateInfo, resetState } = useAppContext();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const downloadUrl = `${API_BASE_URL}/certificates/${certificateInfo.certificateId}`;
      Alert.alert(
        'Download Certificate',
        `Certificate will be downloaded from:\n${downloadUrl}`,
        [{ text: 'OK' }]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to download certificate');
    } finally {
      setDownloading(false);
    }
  };

  const handleFinish = () => {
    Alert.alert(
      'Success',
      'Your certificate has been generated and anchored on the Bitcoin blockchain!',
      [
        {
          text: 'Go Home',
          onPress: () => {
            resetState();
            router.push('/HomeScreen');
          },
        },
      ]
    );
  };

  if (!certificateInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No certificate information available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Certificate Generated</Text>
        <Text style={styles.subtitle}>Your certificate is ready!</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Placeholder for PDF viewer */}
        <View style={styles.pdfPlaceholder}>
          <Text style={styles.pdfText}>📄 Certificate Preview</Text>
          <Text style={styles.pdfSubtext}>
            (PDF viewer requires platform-specific implementation)
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Certificate Details</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Certificate ID:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {certificateInfo.certificateId}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Document Hash:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {certificateInfo.documentHash?.substring(0, 16)}...
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Transaction ID:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {certificateInfo.blockchainAnchor?.txId?.substring(0, 16)}...
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Network:</Text>
            <Text style={styles.infoValue}>
              Bitcoin {certificateInfo.blockchainAnchor?.network}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Timestamp:</Text>
            <Text style={styles.infoValue}>
              {new Date(certificateInfo.blockchainAnchor?.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.verificationCard}>
          <Text style={styles.verificationText}>
            ✓ This certificate has been digitally signed and anchored on the Bitcoin blockchain
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
          disabled={downloading}
        >
          <Text style={styles.downloadButtonText}>
            {downloading ? 'Downloading...' : 'Download PDF'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4caf50',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  pdfPlaceholder: {
    margin: 16,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pdfText: {
    fontSize: 32,
    marginBottom: 8,
  },
  pdfSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  verificationCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  verificationText: {
    fontSize: 14,
    color: '#2e7d32',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  downloadButton: {
    backgroundColor: '#f7931a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    padding: 16,
  },
});

export default PDFViewerScreen;
