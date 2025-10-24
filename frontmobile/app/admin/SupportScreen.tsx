import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, RefreshControl } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'general' | 'bug';
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    title: 'Problème de paiement Lightning',
    description: 'Je n\'arrive pas à effectuer un paiement pour mon certificat',
    status: 'in_progress',
    priority: 'high',
    category: 'technical',
    createdAt: '2024-01-15 10:30',
    updatedAt: '2024-01-15 14:20',
    messages: [
      {
        id: '1',
        content: 'Bonjour, j\'ai un problème avec le paiement Lightning. La transaction reste bloquée.',
        sender: 'user',
        timestamp: '2024-01-15 10:30',
      },
      {
        id: '2',
        content: 'Bonjour, nous avons reçu votre demande. Notre équipe technique examine le problème.',
        sender: 'support',
        timestamp: '2024-01-15 11:15',
      },
    ],
  },
  {
    id: '2',
    title: 'Certificat non reçu',
    description: 'J\'ai payé mais je n\'ai pas reçu mon certificat',
    status: 'resolved',
    priority: 'medium',
    category: 'billing',
    createdAt: '2024-01-14 15:45',
    updatedAt: '2024-01-15 09:30',
    messages: [
      {
        id: '3',
        content: 'J\'ai effectué le paiement mais le certificat n\'apparaît pas dans mon compte.',
        sender: 'user',
        timestamp: '2024-01-14 15:45',
      },
      {
        id: '4',
        content: 'Le problème a été résolu. Votre certificat est maintenant disponible.',
        sender: 'support',
        timestamp: '2024-01-15 09:30',
      },
    ],
  },
];

const SupportScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general' as 'technical' | 'billing' | 'general' | 'bug',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler le rechargement des tickets
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
    Toast.show({
      type: 'success',
      text1: 'Tickets actualisés!',
      visibilityTime: 2000,
    });
  };

  const handleCreateTicket = () => {
    if (!newTicket.title || !newTicket.description) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const ticket: SupportTicket = {
      id: (tickets.length + 1).toString(),
      title: newTicket.title,
      description: newTicket.description,
      status: 'open',
      priority: newTicket.priority,
      category: newTicket.category,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      messages: [
        {
          id: '1',
          content: newTicket.description,
          sender: 'user',
          timestamp: new Date().toLocaleString(),
        },
      ],
    };

    setTickets(prev => [ticket, ...prev]);
    setShowNewTicket(false);
    setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Toast.show({
      type: 'success',
      text1: 'Ticket créé!',
      text2: 'Notre équipe vous répondra bientôt',
      visibilityTime: 3000,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return colors['state.warning.fg'];
      case 'in_progress': return colors['brand.primary'];
      case 'resolved': return colors['state.success.fg'];
      case 'closed': return colors['text.muted'];
      default: return colors['text.muted'];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return 'circle.fill';
      case 'in_progress': return 'clock.fill';
      case 'resolved': return 'checkmark.circle.fill';
      case 'closed': return 'xmark.circle.fill';
      default: return 'questionmark.circle.fill';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return colors['state.error.fg'];
      case 'high': return colors['state.warning.fg'];
      case 'medium': return colors['brand.primary'];
      case 'low': return colors['text.muted'];
      default: return colors['text.muted'];
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return 'wrench.and.screwdriver.fill';
      case 'billing': return 'creditcard.fill';
      case 'general': return 'questionmark.circle.fill';
      case 'bug': return 'ant.fill';
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
        {/* Nouveau ticket */}
        {showNewTicket && (
          <Card style={styles.newTicketCard}>
            <Text style={[styles.newTicketTitle, { color: colors['text.primary'] }]}>Nouveau ticket</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Titre *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
                value={newTicket.title}
                onChangeText={(value) => setNewTicket(prev => ({ ...prev, title: value }))}
                placeholder="Résumez votre problème"
                placeholderTextColor={colors['text.muted']}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors['surface.raised'], color: colors['text.primary'] }]}
                value={newTicket.description}
                onChangeText={(value) => setNewTicket(prev => ({ ...prev, description: value }))}
                placeholder="Décrivez votre problème en détail..."
                placeholderTextColor={colors['text.muted']}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Catégorie</Text>
              <View style={styles.categoryButtons}>
                {['general', 'technical', 'billing', 'bug'].map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      { backgroundColor: newTicket.category === category ? colors['brand.primary'] : colors['surface.default'] }
                    ]}
                    onPress={() => setNewTicket(prev => ({ ...prev, category: category as any }))}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      { color: newTicket.category === category ? colors['brand.primary.on'] : colors['text.primary'] }
                    ]}>
                      {category === 'general' ? 'Général' : category === 'technical' ? 'Technique' : category === 'billing' ? 'Facturation' : 'Bug'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors['text.primary'] }]}>Priorité</Text>
              <View style={styles.priorityButtons}>
                {['low', 'medium', 'high', 'urgent'].map(priority => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      { backgroundColor: newTicket.priority === priority ? colors['brand.primary'] : colors['surface.default'] }
                    ]}
                    onPress={() => setNewTicket(prev => ({ ...prev, priority: priority as any }))}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      { color: newTicket.priority === priority ? colors['brand.primary.on'] : colors['text.primary'] }
                    ]}>
                      {priority === 'low' ? 'Faible' : priority === 'medium' ? 'Moyenne' : priority === 'high' ? 'Élevée' : 'Urgente'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.newTicketActions}>
              <Button
                title="Annuler"
                onPress={() => setShowNewTicket(false)}
                variant="secondary"
                style={{ marginRight: 12 }}
              />
              <Button
                title="Créer le ticket"
                onPress={handleCreateTicket}
                variant="primary"
              />
            </View>
          </Card>
        )}

        {/* Liste des tickets */}
        <View style={styles.ticketsContainer}>
          <Text style={[styles.ticketsTitle, { color: colors['text.primary'] }]}>
            Mes tickets ({tickets.length})
          </Text>
          
          {tickets.map(ticket => (
            <Card key={ticket.id} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <View style={styles.ticketInfo}>
                  <Text style={[styles.ticketTitle, { color: colors['text.primary'] }]}>{ticket.title}</Text>
                  <Text style={[styles.ticketDescription, { color: colors['text.secondary'] }]} numberOfLines={2}>
                    {ticket.description}
                  </Text>
                </View>
                <View style={styles.ticketStatus}>
                  <IconSymbol 
                    name={getStatusIcon(ticket.status)} 
                    size={20} 
                    color={getStatusColor(ticket.status)} 
                  />
                </View>
              </View>
              
              <View style={styles.ticketDetails}>
                <View style={styles.ticketDetailRow}>
                  <IconSymbol name={getCategoryIcon(ticket.category)} size={16} color={colors['text.muted']} />
                  <Text style={[styles.ticketDetailText, { color: colors['text.muted'] }]}>
                    {ticket.category === 'general' ? 'Général' : ticket.category === 'technical' ? 'Technique' : ticket.category === 'billing' ? 'Facturation' : 'Bug'}
                  </Text>
                </View>
                <View style={styles.ticketDetailRow}>
                  <IconSymbol name="flag.fill" size={16} color={getPriorityColor(ticket.priority)} />
                  <Text style={[styles.ticketDetailText, { color: getPriorityColor(ticket.priority) }]}>
                    {ticket.priority === 'low' ? 'Faible' : ticket.priority === 'medium' ? 'Moyenne' : ticket.priority === 'high' ? 'Élevée' : 'Urgente'}
                  </Text>
                </View>
                <View style={styles.ticketDetailRow}>
                  <IconSymbol name="clock.fill" size={16} color={colors['text.muted']} />
                  <Text style={[styles.ticketDetailText, { color: colors['text.muted'] }]}>
                    {ticket.updatedAt}
                  </Text>
                </View>
              </View>
              
              <View style={styles.ticketActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors['brand.primary'] }]}
                  onPress={() => {
                    // Navigation vers les détails du ticket
                    Toast.show({
                      type: 'info',
                      text1: 'Détails du ticket',
                      text2: 'Fonctionnalité en développement',
                      visibilityTime: 2000,
                    });
                  }}
                >
                  <Text style={[styles.actionButtonText, { color: 'white' }]}>Voir détails</Text>
                </TouchableOpacity>
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
  newTicketCard: {
    padding: 20,
    marginBottom: 24,
  },
  newTicketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  newTicketActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  ticketsContainer: {
    marginBottom: 24,
  },
  ticketsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ticketCard: {
    padding: 16,
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
    marginRight: 12,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ticketDescription: {
    fontSize: 14,
  },
  ticketStatus: {
    marginLeft: 12,
  },
  ticketDetails: {
    marginBottom: 12,
  },
  ticketDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ticketDetailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  ticketActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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

export default SupportScreen;
