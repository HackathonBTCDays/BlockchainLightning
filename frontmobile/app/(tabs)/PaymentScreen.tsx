import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import QRCode from 'react-native-qrcode-svg';

const transactions = [
  { id: '1', type: 'Received', amount: '50,000 sats', date: '2023-10-26' },
  { id: '2', type: 'Sent', amount: '25,000 sats', date: '2023-10-25' },
  { id: '3', type: 'Received', amount: '10,000 sats', date: '2023-10-24' },
  { id: '4', type: 'Sent', amount: '5,000 sats', date: '2023-10-23' },
];

const PaymentScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const filteredTransactions = transactions.filter(t => filter === 'All' || t.type === filter);
  const filters = ['All', 'Received', 'Sent'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors['text.primary']} />}
      >
        <Text style={[styles.title, { color: colors['text.primary'] }]}>Payments</Text>

        <Card style={styles.qrCard}>
          <Text style={[styles.qrTitle, { color: colors['text.primary'] }]}>Receive Payment</Text>
          <View style={styles.qrContainer}>
            <QRCode value="lightning:LNURL..." size={200} backgroundColor={colors.background} color={colors['text.primary']} />
          </View>
          <Text style={[styles.qrSubtitle, { color: colors['text.secondary'] }]}>Scan this QR code to receive a payment.</Text>
        </Card>

        <View style={styles.transactionsSection}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Recent Transactions</Text>
          <View style={styles.filterContainer}>
            {filters.map(f => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterButton,
                  { backgroundColor: filter === f ? colors['brand.primary'] : colors['surface.default'] },
                ]}
                onPress={() => setFilter(f)}
              >
                <Text style={{ color: filter === f ? colors['brand.primary.on'] : colors['text.primary'] }}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredTransactions.map(t => (
            <Card key={t.id} style={styles.transactionCard}>
              <View>
                <Text style={[styles.transactionType, { color: colors['text.primary'] }]}>{t.type}</Text>
                <Text style={[styles.transactionDate, { color: colors['text.muted'] }]}>{t.date}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: t.type === 'Received' ? colors['state.success.fg'] : colors['state.error.fg'] }]}>
                {t.type === 'Received' ? '+' : '-'}{t.amount}
              </Text>
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
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  qrCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 32,
  },
  qrTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  qrContainer: {
    marginBottom: 16,
  },
  qrSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  transactionsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 14,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
