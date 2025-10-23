import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { getCertificateTypes } from '../services/api';
import { ROUTES } from '../config/config';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { setSelectedCertificateType } = useAppContext();
  const [certificateTypes, setCertificateTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCertificateTypes();
  }, []);

  const loadCertificateTypes = async () => {
    try {
      setLoading(true);
      const response = await getCertificateTypes();
      setCertificateTypes(response.types);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCertificate = (certificateType) => {
    setSelectedCertificateType(certificateType);
    navigation.navigate(ROUTES.CERTIFICATE_FORM);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f7931a" />
        <Text style={styles.loadingText}>Loading certificate types...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCertificateTypes}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lightning Certificates</Text>
        <Text style={styles.subtitle}>Pay with Bitcoin Lightning Network</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Select Certificate Type</Text>
        {certificateTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={styles.certificateCard}
            onPress={() => handleSelectCertificate(type)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.certificateName}>{type.name}</Text>
              <Text style={styles.certificatePrice}>{type.price} sats</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.verifyButton}
        onPress={() => navigation.navigate(ROUTES.VERIFICATION)}
      >
        <Text style={styles.verifyButtonText}>Verify Certificate</Text>
      </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  certificateCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  certificateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  certificatePrice: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#f7931a',
  },
  verifyButton: {
    backgroundColor: '#333',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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

export default HomeScreen;
