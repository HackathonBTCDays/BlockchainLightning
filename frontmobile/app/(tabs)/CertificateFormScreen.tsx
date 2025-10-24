import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

const certificateTypes = [
  { id: 'birth', name: 'Extrait de naissance', price: 1000, description: 'Document officiel de naissance' },
  { id: 'marriage', name: 'Extrait de mariage', price: 1500, description: 'Acte de mariage officiel' },
  { id: 'death', name: 'Extrait de décès', price: 1000, description: 'Acte de décès officiel' },
  { id: 'residence', name: 'Certificat de résidence', price: 800, description: 'Attestation de domicile' },
  { id: 'identity', name: 'Certificat d\'identité', price: 1200, description: 'Document d\'identité officiel' },
];

const CertificateFormScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    fatherName: '',
    motherName: '',
    address: '',
    phone: '',
    email: '',
    additionalInfo: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedType) {
      Alert.alert('Erreur', 'Veuillez sélectionner un type de certificat');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Simuler la création de la commande
      const selectedCertificate = certificateTypes.find(type => type.id === selectedType);
      
      Toast.show({
        type: 'success',
        text1: 'Formulaire validé!',
        text2: `Redirection vers le paiement pour ${selectedCertificate?.name}`,
        visibilityTime: 2000,
      });

      // Navigation vers l'écran de commande
      setTimeout(() => {
        router.push({
          pathname: '/order',
          params: {
            name: selectedCertificate?.name,
            priceSats: selectedCertificate?.price.toString() || '0',
            priceFcfa: ((selectedCertificate?.price || 0) * 0.35).toFixed(0),
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de traiter la demande',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { color: colors['text.primary'] }]}>Nouvelle Demande</Text>
        <Text style={[styles.subtitle, { color: colors['text.secondary'] }]}>
          Remplissez le formulaire pour demander votre certificat numérique sécurisé par blockchain.
        </Text>

        {/* Sélection du type de certificat */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Type de Certificat</Text>
          {certificateTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.certificateTypeCard,
                { backgroundColor: colors['surface.default'] },
                selectedType === type.id && { borderColor: colors['brand.primary'], borderWidth: 2 }
              ]}
              onPress={() => {
                setSelectedType(type.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View style={styles.certificateTypeInfo}>
                <Text style={[styles.certificateTypeName, { color: colors['text.primary'] }]}>{type.name}</Text>
                <Text style={[styles.certificateTypeDescription, { color: colors['text.secondary'] }]}>{type.description}</Text>
              </View>
              <View style={styles.certificateTypePrice}>
                <Text style={[styles.priceSats, { color: colors['brand.primary'] }]}>{type.price} sats</Text>
                <Text style={[styles.priceFcfa, { color: colors['text.muted'] }]}>~{Math.round(type.price * 0.35)} FCFA</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Informations Personnelles</Text>
          
          <Card style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Prénom *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="Entrez votre prénom"
                placeholderTextColor={colors['text.muted']}
              />
      </View>

          <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Nom *</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Entrez votre nom"
                placeholderTextColor={colors['text.muted']}
            />
          </View>

          <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Date de naissance *</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
              value={formData.dateOfBirth}
                onChangeText={(value) => handleInputChange('dateOfBirth', value)}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor={colors['text.muted']}
            />
          </View>

          <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Lieu de naissance</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
              value={formData.placeOfBirth}
                onChangeText={(value) => handleInputChange('placeOfBirth', value)}
                placeholder="Ville, Pays"
                placeholderTextColor={colors['text.muted']}
            />
          </View>

          <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Nom du père</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
              value={formData.fatherName}
                onChangeText={(value) => handleInputChange('fatherName', value)}
                placeholder="Nom complet du père"
                placeholderTextColor={colors['text.muted']}
            />
          </View>

          <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Nom de la mère</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
              value={formData.motherName}
                onChangeText={(value) => handleInputChange('motherName', value)}
                placeholder="Nom complet de la mère"
                placeholderTextColor={colors['text.muted']}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Adresse</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Adresse complète"
                placeholderTextColor={colors['text.muted']}
                multiline
                numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Téléphone</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="+221 XX XXX XX XX"
                placeholderTextColor={colors['text.muted']}
                keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Email</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="votre@email.com"
                placeholderTextColor={colors['text.muted']}
                keyboardType="email-address"
                autoCapitalize="none"
            />
          </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Informations supplémentaires</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
                value={formData.additionalInfo}
                onChangeText={(value) => handleInputChange('additionalInfo', value)}
                placeholder="Toute information supplémentaire utile..."
                placeholderTextColor={colors['text.muted']}
                multiline
                numberOfLines={4}
              />
            </View>
          </Card>
        </View>

        <Button
          title={loading ? "Traitement..." : "Continuer vers le paiement"}
          onPress={handleSubmit}
          variant="primary"
          style={{ marginBottom: 32, opacity: loading ? 0.6 : 1 }}
        />
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
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  certificateTypeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  certificateTypeInfo: {
    flex: 1,
  },
  certificateTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  certificateTypeDescription: {
    fontSize: 14,
  },
  certificateTypePrice: {
    alignItems: 'flex-end',
  },
  priceSats: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceFcfa: {
    fontSize: 12,
    marginTop: 2,
  },
  formCard: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

export default CertificateFormScreen;