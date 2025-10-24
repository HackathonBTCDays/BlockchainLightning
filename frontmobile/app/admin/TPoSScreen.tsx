import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { getTPoSTerminals, createTPoSTerminal } from '@/services/api';

interface TPoSTerminal {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  transactions: number;
  lastActivity?: string;
  qrCode?: string;
}

const TPoSScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [terminals, setTerminals] = useState<TPoSTerminal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerminals();
  }, []);

  const fetchTerminals = async () => {
    try {
      setLoading(true);
      const data = await getTPoSTerminals();
      if (Array.isArray(data)) {
        setTerminals(data);
      }
    } catch (error) {
      console.error('Error fetching terminals:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de chargement',
        text2: 'Impossible de charger les terminaux',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTerminals();
    setRefreshing(false);
    Toast.show({
      type: 'success',
      text1: 'Terminaux actualisés!',
      visibilityTime: 2000,
    });
  };

  const handleCreateTerminal = () => {
    Alert.alert(
      'Nouveau Terminal TPoS',
      'Voulez-vous créer un nouveau terminal de point de vente?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Créer',
          onPress: () => {
            const newTerminal = {
              name: `Terminal ${terminals.length + 1}`,
              location: 'Nouvelle localisation',
            };
            
            createTPoSTerminal(newTerminal).then(() => {
              fetchTerminals();
              Toast.show({
                type: 'success',
                text1: 'Terminal créé!',
                text2: 'Le nouveau terminal a été ajouté',
                visibilityTime: 2000,
              });
            });
          }
        }
      ]
    );
  };

  const handleTerminalAction = (terminal: TPoSTerminal, action: 'activate' | 'deactivate' | 'maintenance') => {
    const actionText = action === 'activate' ? 'activer' : action === 'deactivate' ? 'désactiver' : 'mettre en maintenance';
    
    Alert.alert(
      'Confirmer l\'action',
      `Voulez-vous ${actionText} le terminal "${terminal.name}"?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Toast.show({
              type: 'success',
              text1: 'Action effectuée!',
              text2: `Terminal ${actionText}`,
              visibilityTime: 2000,
            });
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors['state.success.fg'];
      case 'inactive': return colors['state.error.fg'];
      case 'maintenance': return colors['state.warning.fg'];
      default: return colors['text.muted'];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'checkmark.circle.fill';
      case 'inactive': return 'xmark.circle.fill';
      case 'maintenance': return 'wrench.and.screwdriver.fill';
      default: return 'questionmark.circle.fill';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'maintenance': return 'Maintenance';
      default: return 'Inconnu';
    }
  };

  const activeTerminals = terminals.filter(t => t.status === 'active').length;
  const totalTransactions = terminals.reduce((sum, t) => sum + t.transactions, 0);

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
            <Text style={[styles.statValue, { color: colors['brand.primary'] }]}>{terminals.length}</Text>
            <Text style={[styles.statLabel, { color: colors['text.secondary'] }]}>Total</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors['state.success.fg'] }]}>{activeTerminals}</Text>
            <Text style={[styles.statLabel, { color: colors['text.secondary'] }]}>Actifs</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors['state.warning.fg'] }]}>{totalTransactions}</Text>
            <Text style={[styles.statLabel, { color: colors['text.secondary'] }]}>Transactions</Text>
          </Card>
        </View>

        {/* Liste des terminaux */}
        <View style={styles.terminalsContainer}>
          <Text style={[styles.terminalsTitle, { color: colors['text.primary'] }]}>
            Terminaux ({terminals.length})
          </Text>
          
          {terminals.map(terminal => (
            <Card key={terminal.id} style={styles.terminalCard}>
              <View style={styles.terminalHeader}>
                <View style={styles.terminalInfo}>
                  <Text style={[styles.terminalName, { color: colors['text.primary'] }]}>{terminal.name}</Text>
                  <Text style={[styles.terminalLocation, { color: colors['text.secondary'] }]}>{terminal.location}</Text>
                </View>
                <View style={styles.terminalStatus}>
                  <IconSymbol 
                    name={getStatusIcon(terminal.status)} 
                    size={20} 
                    color={getStatusColor(terminal.status)} 
                  />
                </View>
              </View>
              
              <View style={styles.terminalDetails}>
                <View style={styles.terminalDetailRow}>
                  <Text style={[styles.terminalDetailLabel, { color: colors['text.muted'] }]}>Statut:</Text>
                  <Text style={[styles.terminalDetailValue, { color: getStatusColor(terminal.status) }]}>
                    {getStatusText(terminal.status)}
                  </Text>
                </View>
                <View style={styles.terminalDetailRow}>
                  <Text style={[styles.terminalDetailLabel, { color: colors['text.muted'] }]}>Transactions:</Text>
                  <Text style={[styles.terminalDetailValue, { color: colors['text.primary'] }]}>{terminal.transactions}</Text>
                </View>
                <View style={styles.terminalDetailRow}>
                  <Text style={[styles.terminalDetailLabel, { color: colors['text.muted'] }]}>Dernière activité:</Text>
                  <Text style={[styles.terminalDetailValue, { color: colors['text.primary'] }]}>
                    {terminal.lastActivity || 'Aucune'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.terminalActions}>
                {terminal.status === 'inactive' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors['state.success.fg'] }]}
                    onPress={() => handleTerminalAction(terminal, 'activate')}
                  >
                    <Text style={[styles.actionButtonText, { color: 'white' }]}>Activer</Text>
                  </TouchableOpacity>
                )}
                {terminal.status === 'active' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors['state.error.fg'] }]}
                    onPress={() => handleTerminalAction(terminal, 'deactivate')}
                  >
                    <Text style={[styles.actionButtonText, { color: 'white' }]}>Désactiver</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors['state.warning.fg'] }]}
                  onPress={() => handleTerminalAction(terminal, 'maintenance')}
                >
                  <Text style={[styles.actionButtonText, { color: 'white' }]}>Maintenance</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors['brand.primary'] }]}
                  onPress={() => {
                    Toast.show({
                      type: 'info',
                      text1: 'QR Code',
                      text2: 'Affichage du QR code du terminal',
                      visibilityTime: 2000,
                    });
                  }}
                >
                  <Text style={[styles.actionButtonText, { color: 'white' }]}>QR Code</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={[styles.instructionsTitle, { color: colors['text.primary'] }]}>Comment utiliser TPoS</Text>
          <Card style={styles.instructionsCard}>
            <View style={styles.instructionItem}>
              <IconSymbol name="1.circle.fill" size={20} color={colors['brand.primary']} />
              <Text style={[styles.instructionText, { color: colors['text.secondary'] }]}>
                Créez un nouveau terminal TPoS
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <IconSymbol name="2.circle.fill" size={20} color={colors['brand.primary']} />
              <Text style={[styles.instructionText, { color: colors['text.secondary'] }]}>
                Activez le terminal et générez un QR code
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <IconSymbol name="3.circle.fill" size={20} color={colors['brand.primary']} />
              <Text style={[styles.instructionText, { color: colors['text.secondary'] }]}>
                Les clients peuvent scanner le QR code pour payer
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <IconSymbol name="4.circle.fill" size={20} color={colors['brand.primary']} />
              <Text style={[styles.instructionText, { color: colors['text.secondary'] }]}>
                Surveillez les transactions en temps réel
              </Text>
            </View>
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
  terminalsContainer: {
    marginBottom: 24,
  },
  terminalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  terminalCard: {
    padding: 16,
    marginBottom: 12,
  },
  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  terminalInfo: {
    flex: 1,
    marginRight: 12,
  },
  terminalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  terminalLocation: {
    fontSize: 14,
  },
  terminalStatus: {
    marginLeft: 12,
  },
  terminalDetails: {
    marginBottom: 12,
  },
  terminalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  terminalDetailLabel: {
    fontSize: 14,
  },
  terminalDetailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  terminalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionsContainer: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instructionsCard: {
    padding: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
});

export default TPoSScreen;
