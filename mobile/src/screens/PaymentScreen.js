import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { createPaymentInvoice, checkPaymentStatus, generateCertificate } from '../services/api';
import { ROUTES } from '../config/config';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const { selectedCertificateType, userData, setPaymentInfo, setCertificateInfo } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [paymentHash, setPaymentHash] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    createInvoice();
  }, []);

  const createInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await createPaymentInvoice(
        selectedCertificateType.price,
        selectedCertificateType.id,
        userData
      );
      setPaymentRequest(response.payment_request);
      setPaymentHash(response.payment_hash);
      setPaymentInfo(response);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const startPaymentCheck = async () => {
    if (!paymentHash) return;

    setChecking(true);
    const interval = setInterval(async () => {
      try {
        const status = await checkPaymentStatus(paymentHash);
        if (status.paid) {
          clearInterval(interval);
          setChecking(false);
          await handlePaymentSuccess();
        }
      } catch (err) {
        console.error('Error checking payment:', err);
      }
    }, 3000); // Check every 3 seconds

    // Stop checking after 5 minutes
    setTimeout(() => {
      clearInterval(interval);
      if (checking) {
        setChecking(false);
        Alert.alert('Timeout', 'Payment check timed out. Please verify manually.');
      }
    }, 300000);
  };

  const handlePaymentSuccess = async () => {
    try {
      const certificate = await generateCertificate(
        paymentHash,
        userData,
        selectedCertificateType.id
      );
      setCertificateInfo(certificate);
      Alert.alert('Success', 'Payment confirmed! Generating your certificate...', [
        { text: 'OK', onPress: () => navigation.navigate(ROUTES.PDF_VIEWER) },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Payment confirmed but certificate generation failed: ' + err.message);
    }
  };

  const handleScanQR = () => {
    navigation.navigate(ROUTES.QR_SCANNER, { paymentRequest });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f7931a" />
        <Text style={styles.loadingText}>Creating payment invoice...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={createInvoice}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>{selectedCertificateType?.name}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount Due</Text>
          <Text style={styles.amountValue}>{selectedCertificateType?.price} sats</Text>
        </View>

        <View style={styles.invoiceCard}>
          <Text style={styles.invoiceLabel}>Lightning Invoice</Text>
          <View style={styles.invoiceBox}>
            <Text style={styles.invoiceText} numberOfLines={3}>
              {paymentRequest}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
          <Text style={styles.scanButtonText}>📱 Show QR Code</Text>
        </TouchableOpacity>

        {!checking ? (
          <TouchableOpacity style={styles.checkButton} onPress={startPaymentCheck}>
            <Text style={styles.checkButtonText}>Check Payment Status</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.checkingContainer}>
            <ActivityIndicator size="small" color="#f7931a" />
            <Text style={styles.checkingText}>Waiting for payment...</Text>
          </View>
        )}

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to pay:</Text>
          <Text style={styles.instructionsText}>1. Tap "Show QR Code" above</Text>
          <Text style={styles.instructionsText}>2. Scan with your Lightning wallet</Text>
          <Text style={styles.instructionsText}>3. Confirm the payment</Text>
          <Text style={styles.instructionsText}>4. Wait for confirmation</Text>
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
  },
  amountCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f7931a',
  },
  invoiceCard: {
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
  },
  invoiceText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  scanButton: {
    backgroundColor: '#f7931a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkButton: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  checkingText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
  },
  instructionsCard: {
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
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    padding: 16,
  },
  retryButton: {
    backgroundColor: '#f7931a',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentScreen;
