import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Timeline } from '@/components/ui/Timeline';
import { getCertificateStats, getRecentCertificates, getServices } from '@/services/api';

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentCerts, setRecentCerts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, certsData, servicesData] = await Promise.all([
        getCertificateStats(),
        getRecentCertificates(),
        getServices(),
      ]);
      setStats(statsData);
      setRecentCerts(certsData as any[]);
      setServices(servicesData as any[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors['text.primary']} />}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors['text.primary'] }]}>Tableau de bord</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors['brand.primary']} style={{ marginTop: 32 }} />
        ) : (
          <>
            {/* Certificate Stats */}
            <View style={styles.statsContainer}>
              <Card style={styles.statCard}>
                <View style={styles.statHeader}>
                  <IconSymbol name="shield.fill" size={20} color={colors['brand.secondary']} />
                  <Text style={[styles.statLabel, { color: colors['brand.secondary'], marginLeft: 8 }]}>Total Certificates</Text>
                </View>
                <Text style={[styles.statValue, { color: colors['brand.secondary'] }]}>{stats.total.value}</Text>
                <Text style={[styles.statChange, { color: colors['brand.secondary'] }]}>{stats.total.change}</Text>
              </Card>

              <Card style={styles.statCard}>
                <View style={styles.statHeader}>
                  <IconSymbol name="checkmark.shield.fill" size={20} color={colors['state.success.fg']} />
                  <Text style={[styles.statLabel, { color: colors['state.success.fg'], marginLeft: 8 }]}>Valid</Text>
                </View>
                <Text style={[styles.statValue, { color: colors['state.success.fg'] }]}>{stats.valid.value}</Text>
                <Text style={[styles.statChange, { color: colors['state.success.fg'] }]}>{stats.valid.change}</Text>
              </Card>

              <Card style={styles.statCard}>
                <View style={styles.statHeader}>
                  <IconSymbol name="hourglass" size={20} color={colors['state.warning.fg']} />
                  <Text style={[styles.statLabel, { color: colors['state.warning.fg'], marginLeft: 8 }]}>Pending</Text>
                </View>
                <Text style={[styles.statValue, { color: colors['state.warning.fg'] }]}>{stats.pending.value}</Text>
                <Text style={[styles.statChange, { color: colors['state.warning.fg'] }]}>{stats.pending.change}</Text>
              </Card>

              <Card style={styles.statCard}>
                <View style={styles.statHeader}>
                  <IconSymbol name="clock.fill" size={20} color={colors['state.error.fg']} />
                  <Text style={[styles.statLabel, { color: colors['state.error.fg'], marginLeft: 8 }]}>Expiring Soon</Text>
                </View>
                <Text style={[styles.statValue, { color: colors['state.error.fg'] }]}>{stats.expiringSoon.value}</Text>
                <Text style={[styles.statChange, { color: colors['state.error.fg'] }]}>{stats.expiringSoon.change}</Text>
              </Card>
            </View>

            {/* Recent Certificates */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Certificats Récents</Text>
              {recentCerts.map(cert => (
                <TouchableOpacity key={cert.id} onPress={() => router.push(`/certificate/${cert.id}`)}>
                  <Card style={styles.certCard}>
                    <View style={styles.certInfo}>
                      <Text style={[styles.certStatus, { color: cert.status === 'Pending' ? colors['state.warning.fg'] : colors['state.success.fg'] }]}>
                        {cert.status}
                      </Text>
                      <Text style={[styles.certName, { color: colors['text.primary'] }]}>{cert.name}</Text>
                      <Text style={[styles.certIssuer, { color: colors['text.muted'] }]}>Issued by: {cert.issuer}</Text>
                      <Text style={[styles.certIssuer, { color: colors['text.muted'] }]}>{cert.date}</Text>
                      <View style={{ marginTop: 8 }}>
                        <Timeline steps={cert.timeline.steps} currentStep={cert.timeline.currentStep} />
                      </View>
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
                    <TouchableOpacity
                      style={[styles.orderButton, { backgroundColor: colors['surface.raised'] }]}
                      onPress={() => router.push({ pathname: '/order', params: { name: service.name, priceSats: service.priceSats, priceFcfa: service.priceFcfa } })}
                    >
                      <Text style={[styles.orderButtonText, { color: colors['text.primary'] }]}>Order</Text>
                    </TouchableOpacity>
                  </View>
                  <Image source={{ uri: service.image }} style={styles.serviceImage} />
                </Card>
              ))}
            </View>
          </>
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
    flexWrap: 'wrap',
    marginBottom: 8, // Adjusted from 24
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
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
