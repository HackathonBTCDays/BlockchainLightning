import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mock data for demonstration
const certificateStats = {
  total: { value: 1234, change: '+10%' },
  valid: { value: 1123, change: '+5%' },
  pending: { value: 56, change: '-2%' },
  expiringSoon: { value: 5, change: '+1%' },
};

const recentCertificates = [
  { id: '1', name: 'Software Engineering Degree', issuer: 'Tech University', status: 'Verified', image: 'https://img.freepik.com/vecteurs-libre/certificat-luxe-dore-gradient_52683-70557.jpg?semt=ais_hybrid&w=740&q=80' },
  { id: '2', name: 'Project Management Professional', issuer: 'Global PM Institute', status: 'Verified', image: 'https://img.freepik.com/vecteurs-libre/certificat-luxe-dore-gradient_52683-70557.jpg?semt=ais_hybrid&w=740&q=80' },
  { id: '3', name: 'Data Science Certification', issuer: 'Data Academy', status: 'Pending', image: 'https://img.freepik.com/vecteurs-libre/certificat-luxe-dore-gradient_52683-70557.jpg?semt=ais_hybrid&w=740&q=80' },
];

const services = [
  { id: '1', title: 'Extrait de naissance', name: 'Birth Certificate', priceSats: 1000, priceFcfa: 350, image: 'https://cmsphoto.ww-cdn.com/superstatic/16216/art/grande/42887493-35586288.jpg?v=1582029747' },
  { id: '2', title: 'Casier judiciaire', name: 'Criminal Record', priceSats: 2000, priceFcfa: 700, image: 'https://i.imgur.com/5z1vVzF.png' },
];

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors['text.primary'] }]}>Tableau de bord</Text>
        </View>

        {/* Certificate Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <IconSymbol name="shield.fill" size={20} color={colors['text.secondary']} />
              <Text style={[styles.statLabel, { color: colors['text.secondary'], marginLeft: 8 }]}>Total Certificates</Text>
            </View>
            <Text style={[styles.statValue, { color: colors['text.primary'] }]}>{certificateStats.total.value}</Text>
            <Text style={[styles.statChange, { color: colors['state.success.fg'] }]}>{certificateStats.total.change}</Text>
          </Card>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <IconSymbol name="checkmark.circle" size={20} color={colors['text.secondary']} />
              <Text style={[styles.statLabel, { color: colors['text.secondary'], marginLeft: 8 }]}>Valid</Text>
            </View>
            <Text style={[styles.statValue, { color: colors['text.primary'] }]}>{certificateStats.valid.value}</Text>
            <Text style={[styles.statChange, { color: colors['state.success.fg'] }]}>{certificateStats.valid.change}</Text>
          </Card>
        </View>
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <IconSymbol name="hourglass" size={20} color={colors['text.secondary']} />
              <Text style={[styles.statLabel, { color: colors['text.secondary'], marginLeft: 8 }]}>Pending</Text>
            </View>
            <Text style={[styles.statValue, { color: colors['text.primary'] }]}>{certificateStats.pending.value}</Text>
            <Text style={[styles.statChange, { color: colors['state.error.fg'] }]}>{certificateStats.pending.change}</Text>
          </Card>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <IconSymbol name="exclamationmark.triangle" size={20} color={colors['text.secondary']} />
              <Text style={[styles.statLabel, { color: colors['text.secondary'], marginLeft: 8 }]}>Expiring Soon</Text>
            </View>
            <Text style={[styles.statValue, { color: colors['text.primary'] }]}>{certificateStats.expiringSoon.value}</Text>
            <Text style={[styles.statChange, { color: colors['state.warning.fg'] }]}>{certificateStats.expiringSoon.change}</Text>
          </Card>
        </View>

        {/* Recent Certificates */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Certificats Récents</Text>
          {recentCertificates.map(cert => (
            <TouchableOpacity key={cert.id} onPress={() => router.push(`/certificate/${cert.id}`)}>
              <Card style={styles.certCard}>
                <View style={styles.certInfo}>
                  <Text style={[styles.certStatus, { color: cert.status === 'Pending' ? colors['state.warning.fg'] : colors['state.success.fg'] }]}>
                    {cert.status}
                  </Text>
                  <Text style={[styles.certName, { color: colors['text.primary'] }]}>{cert.name}</Text>
                  <Text style={[styles.certIssuer, { color: colors['text.muted'] }]}>Issued by: {cert.issuer}</Text>
                </View>
                <Image source={{ uri: cert.image }} style={styles.certImage} />
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Actions</Text>
          <Button
            title="Demander un certificat"
            onPress={() => router.push('/CertificateFormScreen')}
            variant="primary"
          />
          <Button
            title="Vérifier un certificat"
            onPress={() => router.push('/VerificationScreen')}
            variant="secondary"
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Services</Text>
          {services.map(service => (
            <Card key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceInfo}>
                <Text style={[styles.serviceTitle, { color: colors['text.secondary'] }]}>{service.title}</Text>
                <Text style={[styles.serviceName, { color: colors['text.primary'] }]}>{service.name}</Text>
                <Text style={[styles.servicePrice, { color: colors['text.muted'] }]}>{`${service.priceSats} sats (~${service.priceFcfa} FCFA)`}</Text>
                <TouchableOpacity style={[styles.orderButton, { backgroundColor: colors['surface.raised'] }]}>
                  <Text style={[styles.orderButtonText, { color: colors['text.primary'] }]}>Order</Text>
                </TouchableOpacity>
              </View>
              <Image source={{ uri: service.image }} style={styles.serviceImage} />
            </Card>
          ))}
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
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  certCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  certInfo: {
    flex: 1,
  },
  certStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  certName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  certIssuer: {
    fontSize: 14,
    marginTop: 4,
  },
  certImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 14,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  servicePrice: {
    fontSize: 14,
  },
  orderButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  orderButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginLeft: 16,
  },
});

export default HomeScreen;
