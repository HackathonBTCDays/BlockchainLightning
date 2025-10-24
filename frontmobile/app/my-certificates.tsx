import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getAllCertificates } from '@/services/api';

const MyCertificatesScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [allCertificates, setAllCertificates] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const certsData = await getAllCertificates();
      setAllCertificates(certsData as any[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCertificates = allCertificates.filter(cert => {
    if (filter === 'All') return true;
    return cert.status === filter;
  });

  const filters = ['All', 'Valid', 'Pending', 'Expiring Soon', 'Expired', 'Refused'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map(f => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterButton,
                  { backgroundColor: filter === f ? colors['brand.primary'] : colors['surface.default'] },
                ]}
                onPress={() => setFilter(f)}
              >
                <Text style={{ color: filter === f ? colors['brand.primary.on'] : colors['text.primary'] }}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors['brand.primary']} style={{ marginTop: 32 }} />
        ) : (
          <ScrollView>
            {filteredCertificates.map(cert => (
              <Card key={cert.id} style={styles.certCard}>
                <TouchableOpacity onPress={() => router.push(`/certificate/${cert.id}`)}>
                  <Text style={[styles.certName, { color: colors['text.primary'] }]}>{cert.name}</Text>
                  <Text style={[styles.certStatus, { color: colors['text.muted'] }]}>{cert.status}</Text>
                  {cert.status === 'Refused' && cert.reason && (
                    <Text style={[styles.reasonText, { color: colors['state.error.fg'] }]}>{cert.reason}</Text>
                  )}
                </TouchableOpacity>
                {cert.status === 'Expiring Soon' && (
                  <Button
                    title="Renew Now"
                    onPress={() => router.push({ pathname: '/order', params: { name: cert.name, priceSats: 1000, priceFcfa: 350 } })}
                    variant="primary"
                    style={{ marginTop: 12 }}
                  />
                )}
              </Card>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  certCard: {
    marginBottom: 12,
  },
  certName: {
    fontSize: 16,
    fontWeight: '600',
  },
  certStatus: {
    fontSize: 14,
    marginTop: 4,
  },
  reasonText: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default MyCertificatesScreen;
