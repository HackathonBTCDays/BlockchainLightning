import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';

const QRScannerScreen = () => {
  const route = useRoute();
  const { paymentRequest } = (route.params as { paymentRequest?: string }) || {};
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // In a real app, this would copy to clipboard
    // For demo, we'll just show a message
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan to Pay</Text>
        <Text style={styles.subtitle}>Scan with your Lightning wallet</Text>
      </View>

      <View style={styles.content}>
        {/* Placeholder for QR code - in real app, use react-native-qrcode-svg */}
        <View style={styles.qrPlaceholder}>
          <Text style={styles.qrText}>QR Code</Text>
          <Text style={styles.qrSubtext}>
            (Install react-native-qrcode-svg to display actual QR code)
          </Text>
        </View>

        <View style={styles.invoiceCard}>
          <Text style={styles.invoiceLabel}>Lightning Invoice:</Text>
          <View style={styles.invoiceBox}>
            <Text style={styles.invoiceText} numberOfLines={4}>
              {paymentRequest}
            </Text>
          </View>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
            <Text style={styles.copyButtonText}>{copied ? '✓ Copied!' : 'Copy Invoice'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>
            1. Open your Lightning wallet app{'\n'}
            2. Scan this QR code or copy the invoice{'\n'}
            3. Confirm the payment amount{'\n'}
            4. Complete the transaction
          </Text>
        </View>
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
    backgroundColor: '#f7931a',
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
    padding: 16,
    alignItems: 'center',
  },
  qrPlaceholder: {
    width: Dimensions.get('window').width - 64,
    height: Dimensions.get('window').width - 64,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  qrText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  qrSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  invoiceCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  invoiceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  invoiceBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  invoiceText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#333',
  },
  copyButton: {
    backgroundColor: '#f7931a',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  instructionsCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

export default QRScannerScreen;
