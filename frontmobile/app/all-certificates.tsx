import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';

const allCertificates = [
  { id: '1', name: 'Software Engineering Degree', status: 'Valid' },
  { id: '2', name: 'Project Management Professional', status: 'Valid' },
  { id: '3', name: 'Data Science Certification', status: 'Pending' },
  { id: '4', name: 'Cybersecurity Specialist', status: 'Expired' },
  { id: '5', name: 'Advanced Cryptography', status: 'Valid' },
];

const AllCertificatesScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [filter, setFilter] = useState('All');

  const filteredCertificates = allCertificates.filter(cert => {
    if (filter === 'All') return true;
    return cert.status === filter;
  });

  const filters = ['All', 'Valid', 'Pending', 'Expired', 'Refused'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'All Certificates', headerBackTitle: 'Back' }} />
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

        <ScrollView>
          {filteredCertificates.map(cert => (
            <TouchableOpacity key={cert.id} onPress={() => router.push(`/certificate/${cert.id}`)}>
              <Card style={styles.certCard}>
                <Text style={[styles.certName, { color: colors['text.primary'] }]}>{cert.name}</Text>
                <Text style={[styles.certStatus, { color: colors['text.muted'] }]}>{cert.status}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
});

export default AllCertificatesScreen;
