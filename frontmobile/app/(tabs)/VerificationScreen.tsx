import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { verifyCertificate } from '@/services/api';

interface VerificationResult {
  valid: boolean;
  message: string;
  certificateId: string;
  documentHash?: string;
  error?: string;
}

const VerificationScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  
  const handleScanClick = async () => {
    if (!permission) {
      // Camera permissions are still loading.
      return;
    }

    if (!permission.granted) {
      // Camera permissions are not granted yet.
      const { status } = await requestPermission();
      if (status !== 'granted') {
        alert('Camera permission is required to scan QR codes.');
        return;
      }
    }

    setIsScannerVisible(true);
  };

  const handleVerify = async (id?: string) => {
    const finalCertificateId = id || certificateId;
    if (!finalCertificateId.trim()) {
      setResult({ valid: false, message: 'Please enter a certificate ID', certificateId: '' });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const response = await verifyCertificate(finalCertificateId, undefined);
      setResult(response);
    } catch (err) {
      setResult({ valid: false, message: err instanceof Error ? err.message : 'An unknown error occurred', certificateId: finalCertificateId });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCertificateId('');
    setResult(null);
    setIsScannerVisible(false);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setIsScannerVisible(false);
    setCertificateId(data);
    handleVerify(data);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { color: colors['text.primary'] }]}>Verify Certificate</Text>
        <Text style={[styles.subtitle, { color: colors['text.secondary'] }]}>
          Check the authenticity of a certificate on the blockchain.
        </Text>

        {isScannerVisible ? (
          <View style={styles.scannerContainer}>
            <CameraView
              onBarcodeScanned={handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            <Button title="Cancel" onPress={() => setIsScannerVisible(false)} variant="secondary" />
          </View>
        ) : (
          <>
            <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: colors['surface.default'], color: colors['text.primary'] }]}
            value={certificateId}
            onChangeText={setCertificateId}
            placeholder="Enter Certificate ID"
            placeholderTextColor={colors['text.muted']}
            autoCapitalize="none"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors['brand.primary']} style={{ marginTop: 20 }} />
        ) : (
                    <View>
            <Button title="Verify Manually" onPress={() => handleVerify()} variant="primary" style={{ marginTop: 12 }} />
            <Button title="Scan QR Code" onPress={handleScanClick} variant="secondary" style={{ marginTop: 12 }} />
          </View>
        )}
          </>
        )}

        
        {result && (
          <Card style={[styles.resultCard, { borderColor: result.valid ? colors['state.success.fg'] : colors['state.error.fg'] }]}>
            <IconSymbol
              name={result.valid ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
              size={48}
              color={result.valid ? colors['state.success.fg'] : colors['state.error.fg']}
              style={{ marginBottom: 12 }}
            />
            <Text style={[styles.resultTitle, { color: result.valid ? colors['state.success.fg'] : colors['state.error.fg'] }]}>
              {result.valid ? 'Certificate Verified' : 'Verification Failed'}
            </Text>
            <Text style={[styles.resultMessage, { color: colors['text.secondary'] }]}>{result.message}</Text>

            {result.valid && result.documentHash && (
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors['text.muted'] }]}>Document Hash</Text>
                  <Text style={[styles.detailValue, { color: colors['text.primary'] }]} numberOfLines={1}>{result.documentHash}</Text>
                </View>
              </View>
            )}

            <Button title="Verify Another" onPress={handleReset} variant="secondary" style={{ marginTop: 20 }} />
          </Card>
        )}
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
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  resultCard: {
    marginTop: 32,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  scannerContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'flex-end',
    padding: 16,
  },
});

export default VerificationScreen;
