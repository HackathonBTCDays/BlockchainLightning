import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack, Link } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

const AdminDashboardScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalCertificates: 1247,
    totalUsers: 89,
    totalRevenue: 156800,
    activeTerminals: 5,
    pendingTickets: 12,
    systemHealth: 98.5,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler le rechargement des statistiques
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
    Toast.show({
      type: 'success',
      text1: 'Statistiques actualisées!',
      visibilityTime: 2000,
    });
  };

  const quickActions = [
    {
      title: 'Gestion Utilisateurs',
      icon: 'person.2.fill',
      color: colors['brand.primary'],
      onPress: () => router.push('/admin/UserManagementScreen'),
    },
    {
      title: 'Support Client',
      icon: 'questionmark.circle.fill',
      color: colors['state.warning.fg'],
      onPress: () => router.push('/admin/SupportScreen'),
    },
    {
      title: 'Terminaux TPoS',
      icon: 'creditcard.fill',
      color: colors['state.success.fg'],
      onPress: () => {
        Toast.show({
          type: 'info',
          text1: 'Gestion TPoS',
          text2: 'Fonctionnalité en développement',
          visibilityTime: 2000,
        });
      },
    },
    {
      title: 'Configuration',
      icon: 'gear',
      color: colors['text.muted'],
      onPress: () => router.push('/(tabs)/SettingsScreen'),
    },
  ];

  const recentActivities = [
    { id: '1', type: 'certificate', message: 'Nouveau certificat généré', time: '2 min', user: 'Amadou Diallo' },
    { id: '2', type: 'payment', message: 'Paiement reçu - 1500 sats', time: '5 min', user: 'Fatou Sarr' },
    { id: '3', type: 'user', message: 'Nouvel utilisateur enregistré', time: '10 min', user: 'Moussa Ba' },
    { id: '4', type: 'ticket', message: 'Nouveau ticket de support', time: '15 min', user: 'Aïcha Diop' },
    { id: '5', type: 'terminal', message: 'Terminal TPoS activé', time: '20 min', user: 'Système' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'certificate': return 'doc.text.fill';
      case 'payment': return 'creditcard.fill';
      case 'user': return 'person.fill';
      case 'ticket': return 'questionmark.circle.fill';
      case 'terminal': return 'terminal.fill';
      default: return 'circle.fill';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'certificate': return colors['state.success.fg'];
      case 'payment': return colors['brand.primary'];
      case 'user': return colors['state.warning.fg'];
      case 'ticket': return colors['state.error.fg'];
      case 'terminal': return colors['text.muted'];
      default: return colors['text.muted'];
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView 
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors['text.primary']} />}
      >
        {/* Statistiques principales */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <IconSymbol name="doc.text.fill" size={24} color={colors['brand.primary']} />
              <Text style={[styles.statLabel, { color: colors['text.secondary'] }]}>Certificats</Text>
            </View>
            <Text style={[styles.statValue, { color: colors['brand.primary'] }]}>{stats.totalCertificates}</Text>
            <Text style={[styles.statChange, { color: colors['state.success.fg'] }]}>+12 cette semaine</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <IconSymbol name="person.2.fill" size={24} color={colors['state.success.fg']} />
              <Text style={[styles.statLabel, { color: colors['text.secondary'] }]}>Utilisateurs</Text>
            </View>
            <Text style={[styles.statValue, { color: colors['state.success.fg'] }]}>{stats.totalUsers}</Text>
            <Text style={[styles.statChange, { color: colors['state.success.fg'] }]}>+3 nouveaux</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <IconSymbol name="bitcoinsign.circle.fill" size={24} color={colors['state.warning.fg']} />
              <Text style={[styles.statLabel, { color: colors['text.secondary'] }]}>Revenus</Text>
            </View>
            <Text style={[styles.statValue, { color: colors['state.warning.fg'] }]}>{stats.totalRevenue.toLocaleString()} sats</Text>
            <Text style={[styles.statChange, { color: colors['state.success.fg'] }]}>+8% ce mois</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <IconSymbol name="creditcard.fill" size={24} color={colors['text.muted']} />
              <Text style={[styles.statLabel, { color: colors['text.secondary'] }]}>Terminaux</Text>
            </View>
            <Text style={[styles.statValue, { color: colors['text.muted'] }]}>{stats.activeTerminals}</Text>
            <Text style={[styles.statChange, { color: colors['state.success.fg'] }]}>Tous actifs</Text>
          </Card>
        </View>

        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Actions Rapides</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, { backgroundColor: colors['surface.default'] }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  action.onPress();
                }}
              >
                <IconSymbol name={action.icon as any} size={32} color={action.color} />
                <Text style={[styles.quickActionTitle, { color: colors['text.primary'] }]}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Santé du système */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Santé du Système</Text>
          <Card style={styles.systemHealthCard}>
            <View style={styles.systemHealthHeader}>
              <IconSymbol name="checkmark.shield.fill" size={24} color={colors['state.success.fg']} />
              <Text style={[styles.systemHealthTitle, { color: colors['text.primary'] }]}>Système Opérationnel</Text>
            </View>
            <Text style={[styles.systemHealthValue, { color: colors['state.success.fg'] }]}>{stats.systemHealth}%</Text>
            <View style={styles.systemHealthDetails}>
              <View style={styles.systemHealthDetail}>
                <Text style={[styles.systemHealthDetailLabel, { color: colors['text.secondary'] }]}>API LNbits</Text>
                <Text style={[styles.systemHealthDetailValue, { color: colors['state.success.fg'] }]}>En ligne</Text>
              </View>
              <View style={styles.systemHealthDetail}>
                <Text style={[styles.systemHealthDetailLabel, { color: colors['text.secondary'] }]}>Base de données</Text>
                <Text style={[styles.systemHealthDetailValue, { color: colors['state.success.fg'] }]}>En ligne</Text>
              </View>
              <View style={styles.systemHealthDetail}>
                <Text style={[styles.systemHealthDetailLabel, { color: colors['text.secondary'] }]}>Bitcoin Testnet</Text>
                <Text style={[styles.systemHealthDetailValue, { color: colors['state.success.fg'] }]}>En ligne</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Activités récentes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Activités Récentes</Text>
          <Card style={styles.activitiesCard}>
            {recentActivities.map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <IconSymbol 
                    name={getActivityIcon(activity.type)} 
                    size={20} 
                    color={getActivityColor(activity.type)} 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityMessage, { color: colors['text.primary'] }]}>{activity.message}</Text>
                  <Text style={[styles.activityUser, { color: colors['text.secondary'] }]}>{activity.user}</Text>
                </View>
                <Text style={[styles.activityTime, { color: colors['text.muted'] }]}>{activity.time}</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Tickets en attente */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>User View</Text>
          <Card style={styles.pendingTicketsCard}>
            <Button
              title="Go to User View"
              onPress={() => router.push({ pathname: '/(tabs)' } as any)}
              variant="primary"
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Tickets en Attente</Text>
          <Card style={styles.pendingTicketsCard}>
            <View style={styles.pendingTicketsHeader}>
              <IconSymbol name="questionmark.circle.fill" size={24} color={colors['state.warning.fg']} />
              <Text style={[styles.pendingTicketsTitle, { color: colors['text.primary'] }]}>
                {stats.pendingTickets} tickets en attente
              </Text>
            </View>
            <Button
              title="Voir tous les tickets"
              onPress={() => router.push('/admin/SupportScreen')}
              variant="primary"
            />
          </Card>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  systemHealthCard: {
    padding: 20,
  },
  systemHealthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  systemHealthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  systemHealthValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  systemHealthDetails: {
    gap: 8,
  },
  systemHealthDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  systemHealthDetailLabel: {
    fontSize: 14,
  },
  systemHealthDetailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  activitiesCard: {
    padding: 0,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityUser: {
    fontSize: 14,
  },
  activityTime: {
    fontSize: 12,
  },
  pendingTicketsCard: {
    padding: 20,
  },
  pendingTicketsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pendingTicketsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminDashboardScreen;
