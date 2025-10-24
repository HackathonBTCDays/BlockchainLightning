import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'user';
  status: 'active' | 'inactive' | 'pending';
  certificatesCount: number;
  lastLogin: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Amadou Diallo',
    email: 'amadou@example.com',
    role: 'admin',
    status: 'active',
    certificatesCount: 45,
    lastLogin: '2024-01-15 10:30',
    createdAt: '2023-06-01',
  },
  {
    id: '2',
    name: 'Fatou Sarr',
    email: 'fatou@example.com',
    role: 'agent',
    status: 'active',
    certificatesCount: 23,
    lastLogin: '2024-01-14 15:45',
    createdAt: '2023-08-15',
  },
  {
    id: '3',
    name: 'Moussa Ba',
    email: 'moussa@example.com',
    role: 'user',
    status: 'pending',
    certificatesCount: 0,
    lastLogin: '2024-01-10 09:20',
    createdAt: '2024-01-10',
  },
];

const UserManagementScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'agent' | 'user'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  const filteredUsers = users.filter(user => {
    const roleMatch = selectedRole === 'all' || user.role === selectedRole;
    const statusMatch = selectedStatus === 'all' || user.status === selectedStatus;
    return roleMatch && statusMatch;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler le rechargement des données
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
    Toast.show({
      type: 'success',
      text1: 'Données actualisées!',
      visibilityTime: 2000,
    });
  };

  const handleUserAction = (user: User, action: 'activate' | 'deactivate' | 'promote' | 'demote') => {
    Alert.alert(
      'Confirmer l\'action',
      `Voulez-vous ${action === 'activate' ? 'activer' : action === 'deactivate' ? 'désactiver' : action === 'promote' ? 'promouvoir' : 'rétrograder'} ${user.name}?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Toast.show({
              type: 'success',
              text1: 'Action effectuée!',
              text2: `Utilisateur ${action === 'activate' ? 'activé' : action === 'deactivate' ? 'désactivé' : action === 'promote' ? 'promu' : 'rétrogradé'}`,
              visibilityTime: 2000,
            });
          }
        }
      ]
    );
  };

  const handleCreateUser = () => {
    Alert.alert(
      'Nouvel utilisateur',
      'Fonctionnalité de création d\'utilisateur sera disponible dans la prochaine version.',
      [{ text: 'OK' }]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return colors['state.error.fg'];
      case 'agent': return colors['brand.primary'];
      case 'user': return colors['text.muted'];
      default: return colors['text.muted'];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors['state.success.fg'];
      case 'inactive': return colors['state.error.fg'];
      case 'pending': return colors['state.warning.fg'];
      default: return colors['text.muted'];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'checkmark.circle.fill';
      case 'inactive': return 'xmark.circle.fill';
      case 'pending': return 'clock.circle.fill';
      default: return 'questionmark.circle.fill';
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
        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors['brand.primary'] }]}>{users.length}</Text>
            <Text style={[styles.statLabel, { color: colors['text.secondary'] }]}>Total</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors['state.success.fg'] }]}>
              {users.filter(u => u.status === 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors['text.secondary'] }]}>Actifs</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors['state.warning.fg'] }]}>
              {users.filter(u => u.status === 'pending').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors['text.secondary'] }]}>En attente</Text>
          </Card>
        </View>

        {/* Filtres */}
        <View style={styles.filtersContainer}>
          <Text style={[styles.filtersTitle, { color: colors['text.primary'] }]}>Filtres</Text>
          
          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: colors['text.secondary'] }]}>Rôle:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {['all', 'admin', 'agent', 'user'].map(role => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.filterButton,
                    { backgroundColor: selectedRole === role ? colors['brand.primary'] : colors['surface.default'] }
                  ]}
                  onPress={() => setSelectedRole(role as any)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    { color: selectedRole === role ? colors['brand.primary.on'] : colors['text.primary'] }
                  ]}>
                    {role === 'all' ? 'Tous' : role === 'admin' ? 'Admin' : role === 'agent' ? 'Agent' : 'Utilisateur'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: colors['text.secondary'] }]}>Statut:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {['all', 'active', 'inactive', 'pending'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterButton,
                    { backgroundColor: selectedStatus === status ? colors['brand.primary'] : colors['surface.default'] }
                  ]}
                  onPress={() => setSelectedStatus(status as any)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    { color: selectedStatus === status ? colors['brand.primary.on'] : colors['text.primary'] }
                  ]}>
                    {status === 'all' ? 'Tous' : status === 'active' ? 'Actif' : status === 'inactive' ? 'Inactif' : 'En attente'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Liste des utilisateurs */}
        <View style={styles.usersContainer}>
          <Text style={[styles.usersTitle, { color: colors['text.primary'] }]}>
            Utilisateurs ({filteredUsers.length})
          </Text>
          
          {filteredUsers.map(user => (
            <Card key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors['text.primary'] }]}>{user.name}</Text>
                  <Text style={[styles.userEmail, { color: colors['text.secondary'] }]}>{user.email}</Text>
                </View>
                <View style={styles.userStatus}>
                  <IconSymbol 
                    name={getStatusIcon(user.status)} 
                    size={20} 
                    color={getStatusColor(user.status)} 
                  />
                </View>
              </View>
              
              <View style={styles.userDetails}>
                <View style={styles.userDetailRow}>
                  <Text style={[styles.userDetailLabel, { color: colors['text.muted'] }]}>Rôle:</Text>
                  <Text style={[styles.userDetailValue, { color: getRoleColor(user.role) }]}>
                    {user.role === 'admin' ? 'Administrateur' : user.role === 'agent' ? 'Agent' : 'Utilisateur'}
                  </Text>
                </View>
                <View style={styles.userDetailRow}>
                  <Text style={[styles.userDetailLabel, { color: colors['text.muted'] }]}>Certificats:</Text>
                  <Text style={[styles.userDetailValue, { color: colors['text.primary'] }]}>{user.certificatesCount}</Text>
                </View>
                <View style={styles.userDetailRow}>
                  <Text style={[styles.userDetailLabel, { color: colors['text.muted'] }]}>Dernière connexion:</Text>
                  <Text style={[styles.userDetailValue, { color: colors['text.primary'] }]}>{user.lastLogin}</Text>
                </View>
              </View>
              
              <View style={styles.userActions}>
                {user.status === 'inactive' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors['state.success.fg'] }]}
                    onPress={() => handleUserAction(user, 'activate')}
                  >
                    <Text style={[styles.actionButtonText, { color: 'white' }]}>Activer</Text>
                  </TouchableOpacity>
                )}
                {user.status === 'active' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors['state.error.fg'] }]}
                    onPress={() => handleUserAction(user, 'deactivate')}
                  >
                    <Text style={[styles.actionButtonText, { color: 'white' }]}>Désactiver</Text>
                  </TouchableOpacity>
                )}
                {user.role === 'user' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors['brand.primary'] }]}
                    onPress={() => handleUserAction(user, 'promote')}
                  >
                    <Text style={[styles.actionButtonText, { color: 'white' }]}>Promouvoir</Text>
                  </TouchableOpacity>
                )}
                {user.role === 'agent' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors['text.muted'] }]}
                    onPress={() => handleUserAction(user, 'demote')}
                  >
                    <Text style={[styles.actionButtonText, { color: 'white' }]}>Rétrograder</Text>
                  </TouchableOpacity>
                )}
              </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  usersContainer: {
    marginBottom: 24,
  },
  usersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userCard: {
    padding: 16,
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  userStatus: {
    marginLeft: 12,
  },
  userDetails: {
    marginBottom: 12,
  },
  userDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userDetailLabel: {
    fontSize: 14,
  },
  userDetailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default UserManagementScreen;
