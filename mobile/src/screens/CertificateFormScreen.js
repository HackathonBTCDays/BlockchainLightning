import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { ROUTES } from '../config/config';

const CertificateFormScreen = () => {
  const navigation = useNavigation();
  const { selectedCertificateType, setUserData } = useAppContext();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    fatherName: '',
    motherName: '',
    nationality: '',
    idNumber: '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.fullName || !formData.dateOfBirth) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setUserData(formData);
    navigation.navigate(ROUTES.PAYMENT);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Certificate Information</Text>
        <Text style={styles.subtitle}>{selectedCertificateType?.name}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
              placeholder="Enter full name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth *</Text>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(text) => handleInputChange('dateOfBirth', text)}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Place of Birth</Text>
            <TextInput
              style={styles.input}
              value={formData.placeOfBirth}
              onChangeText={(text) => handleInputChange('placeOfBirth', text)}
              placeholder="Enter place of birth"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Father's Name</Text>
            <TextInput
              style={styles.input}
              value={formData.fatherName}
              onChangeText={(text) => handleInputChange('fatherName', text)}
              placeholder="Enter father's name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mother's Name</Text>
            <TextInput
              style={styles.input}
              value={formData.motherName}
              onChangeText={(text) => handleInputChange('motherName', text)}
              placeholder="Enter mother's name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nationality</Text>
            <TextInput
              style={styles.input}
              value={formData.nationality}
              onChangeText={(text) => handleInputChange('nationality', text)}
              placeholder="Enter nationality"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ID Number</Text>
            <TextInput
              style={styles.input}
              value={formData.idNumber}
              onChangeText={(text) => handleInputChange('idNumber', text)}
              placeholder="Enter ID number"
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.note}>* Required fields</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Continue to Payment</Text>
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
  note: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#f7931a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CertificateFormScreen;
