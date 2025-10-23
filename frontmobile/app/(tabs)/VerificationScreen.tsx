import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { verifyCertificate } from '@/services/api';

interface VerificationResult {
  valid: boolean;
  message: string;
  certificateId: string;
  documentHash?: string;
  error?: string;
}

const VerificationScreen = () => {
  const [certificateId, setCertificateId] = useState('');
  const [documentHash, setDocumentHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await verifyCertificate(certificateId, documentHash || undefined);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCertificateId('');
    setDocumentHash('');
    setResult(null);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Certificate</Text>
        <Text style={styles.subtitle}>Check authenticity on blockchain</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Certificate ID *</Text>
            <TextInput
              style={styles.input}
              value={certificateId}
              onChangeText={setCertificateId}
              placeholder="Enter certificate ID"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Document Hash (Optional)</Text>
            <TextInput
              style={styles.input}
              value={documentHash}
              onChangeText={setDocumentHash}
              placeholder="Enter document hash"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#f7931a" />
              <Text style={styles.loadingText}>Verifying certificate...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
              <Text style={styles.verifyButtonText}>Verify Certificate</Text>
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>❌</Text>
            <Text style={styles.errorTitle}>Verification Failed</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {result && result.valid && (
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Certificate Verified</Text>
            <Text style={styles.successMessage}>{result.message}</Text>

            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>Verification Details:</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Certificate ID:</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {result.certificateId}
                </Text>
              </View>

              {result.documentHash && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Document Hash:</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {result.documentHash.substring(0, 16)}...
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, styles.verified]}>Verified</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Verify Another</Text>
            </TouchableOpacity>
          </View>
        )}

        {result && !result.valid && (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>❌</Text>
            <Text style={styles.errorTitle}>Invalid Certificate</Text>
            <Text style={styles.errorMessage}>
              {result.error || 'This certificate could not be verified'}
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Verification</Text>
          <Text style={styles.infoText}>
            Certificate verification checks the authenticity of your document against the Bitcoin
            blockchain. The document hash is anchored on the blockchain, ensuring it cannot be
            tampered with.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#333',
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
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  verifyButton: {
    backgroundColor: '#f7931a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  successCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  successIcon: {
    fontSize: 48,
    color: '#4caf50',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f44336',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  verified: {
    color: '#4caf50',
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    margin: 16,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default VerificationScreen;
