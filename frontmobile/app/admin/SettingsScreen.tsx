import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack, Link } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAppContext } from '@/Provider/AppContext';

const SettingsScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { theme, setTheme } = useAppContext();
    
  // États des paramètres
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: colorScheme === 'dark',
    autoSync: true,
    biometricAuth: false,
    soundEffects: true,
    hapticFeedback: true,
  });

  const [lnbitsSettings, setLnbitsSettings] = useState({
    tposEnabled: true,
    userManagerEnabled: true,
    boltCardsEnabled: false,
    decoderEnabled: true,
    supportTicketsEnabled: true,
    eventsEnabled: false,
    smtpEnabled: true,
    splitPaymentsEnabled: false,
    offlineShopEnabled: false,
    streamAlertEnabled: true,
    lnurlpEnabled: true,
    invoicesEnabled: true,
    serverScrubEnabled: true,
    lnCalendarEnabled: false,
    schedulerEnabled: true,
    auctionHouseEnabled: false,
    paidReviewEnabled: false,
    sellcoinsEnabled: false,
    lnposEnabled: false,
  });

  const handleSettingChange = async (key: string, value: boolean) => {
    if (key === 'darkMode') {
      setTheme(value ? 'dark' : 'light');
    } else if (key === 'biometricAuth') {
      if (value) {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!hasHardware || !isEnrolled) {
          Alert.alert(
            'Biometric Authentication Not Available',
            'Your device does not support biometric authentication or you have not enrolled any biometrics yet.'
          );
          return;
        }
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric login',
        });
        if (!result.success) {
          return;
        }
      }
    }
    setSettings(prev => ({ ...prev, [key]: value }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleLnbitsSettingChange = (key: string, value: boolean) => {
    setLnbitsSettings(prev => ({ ...prev, [key]: value }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleExportSettings = () => {
    Alert.alert(
      'Exporter les paramètres',
      'Voulez-vous exporter vos paramètres de configuration?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Exporter',
          onPress: () => {
            Toast.show({
              type: 'success',
              text1: 'Paramètres exportés!',
              text2: 'Le fichier de configuration a été sauvegardé',
              visibilityTime: 2000,
            });
          }
        }
      ]
    );
  };

  const handleImportSettings = () => {
    Alert.alert(
      'Importer les paramètres',
      'Fonctionnalité d\'import sera disponible dans la prochaine version.',
      [{ text: 'OK' }]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Réinitialiser les paramètres',
      'Voulez-vous vraiment réinitialiser tous les paramètres aux valeurs par défaut?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            setSettings({
              notifications: true,
              darkMode: false,
              autoSync: true,
              biometricAuth: false,
              soundEffects: true,
              hapticFeedback: true,
            });
            Toast.show({
              type: 'success',
              text1: 'Paramètres réinitialisés!',
              visibilityTime: 2000,
            });
          }
        }
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    type = 'switch' 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <IconSymbol name={icon as any} size={24} color={colors['text.primary']} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors['text.primary'] }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors['text.secondary'] }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors['surface.default'], true: colors['brand.primary'] }}
          thumbColor={value ? colors['brand.primary.on'] : colors['text.muted']}
        />
      ) : (
        <TouchableOpacity onPress={() => onValueChange(!value)}>
          <IconSymbol name="chevron.right" size={20} color={colors['text.muted']} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView style={styles.container}>
        {/* Paramètres généraux */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Paramètres Généraux</Text>
          <Card style={styles.settingsCard}>
            <SettingItem
              icon="bell.fill"
              title="Notifications"
              subtitle="Recevoir des notifications push"
              value={settings.notifications}
              onValueChange={(value) => handleSettingChange('notifications', value)}
            />
            <SettingItem
              icon="moon.fill"
              title="Mode sombre"
              subtitle="Interface en mode sombre"
              value={theme === 'dark'}
              onValueChange={(value) => handleSettingChange('darkMode', value)}
            />
            <SettingItem
              icon="arrow.clockwise"
              title="Synchronisation automatique"
              subtitle="Synchroniser automatiquement les données"
              value={settings.autoSync}
              onValueChange={(value) => handleSettingChange('autoSync', value)}
            />
            <SettingItem
              icon="faceid"
              title="Authentification biométrique"
              subtitle="Utiliser l'empreinte ou Face ID"
              value={settings.biometricAuth}
              onValueChange={(value) => handleSettingChange('biometricAuth', value)}
            />
            <SettingItem
              icon="speaker.wave.2.fill"
              title="Effets sonores"
              subtitle="Jouer des sons pour les actions"
              value={settings.soundEffects}
              onValueChange={(value) => handleSettingChange('soundEffects', value)}
            />
            <SettingItem
              icon="iphone.radiowaves.left.and.right"
              title="Retour haptique"
              subtitle="Vibrations pour les interactions"
              value={settings.hapticFeedback}
              onValueChange={(value) => handleSettingChange('hapticFeedback', value)}
            />
          </Card>
        </View>

        {/* Extensions LNbits */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Extensions LNbits</Text>
          <Card style={styles.settingsCard}>
            <SettingItem
              icon="creditcard.fill"
              title="TPoS - Terminal Point de Vente"
              subtitle="Gestion des terminaux de paiement"
              value={lnbitsSettings.tposEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('tposEnabled', value)}
            />
            <SettingItem
              icon="person.2.fill"
              title="User Manager"
              subtitle="Gestion multi-utilisateurs"
              value={lnbitsSettings.userManagerEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('userManagerEnabled', value)}
            />
            <SettingItem
              icon="wave.3.right"
              title="Bolt Cards - NFC"
              subtitle="Paiements par carte NFC"
              value={lnbitsSettings.boltCardsEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('boltCardsEnabled', value)}
            />
            <SettingItem
              icon="doc.text.magnifyingglass"
              title="Decoder"
              subtitle="Analyse des factures Lightning"
              value={lnbitsSettings.decoderEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('decoderEnabled', value)}
            />
            <SettingItem
              icon="questionmark.circle.fill"
              title="Support Tickets"
              subtitle="Système de support client"
              value={lnbitsSettings.supportTicketsEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('supportTicketsEnabled', value)}
            />
            <SettingItem
              icon="calendar"
              title="Events"
              subtitle="Gestion des événements"
              value={lnbitsSettings.eventsEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('eventsEnabled', value)}
            />
            <SettingItem
              icon="envelope.fill"
              title="SMTP"
              subtitle="Envoi d'emails"
              value={lnbitsSettings.smtpEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('smtpEnabled', value)}
            />
            <SettingItem
              icon="arrow.branch"
              title="Split Payments"
              subtitle="Répartition des paiements"
              value={lnbitsSettings.splitPaymentsEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('splitPaymentsEnabled', value)}
            />
            <SettingItem
              icon="storefront.fill"
              title="Offline Shop"
              subtitle="Boutique hors ligne"
              value={lnbitsSettings.offlineShopEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('offlineShopEnabled', value)}
            />
            <SettingItem
              icon="bell.badge.fill"
              title="Stream Alert"
              subtitle="Notifications en temps réel"
              value={lnbitsSettings.streamAlertEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('streamAlertEnabled', value)}
            />
            <SettingItem
              icon="qrcode"
              title="LNURL-p"
              subtitle="Paiements Lightning statiques"
              value={lnbitsSettings.lnurlpEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('lnurlpEnabled', value)}
            />
            <SettingItem
              icon="doc.text.fill"
              title="Invoices"
              subtitle="Facturation avancée"
              value={lnbitsSettings.invoicesEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('invoicesEnabled', value)}
            />
            <SettingItem
              icon="shield.fill"
              title="Server Scrub"
              subtitle="Filtrage et sécurité"
              value={lnbitsSettings.serverScrubEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('serverScrubEnabled', value)}
            />
            <SettingItem
              icon="calendar.badge.plus"
              title="LN Calendar"
              subtitle="Calendrier Lightning"
              value={lnbitsSettings.lnCalendarEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('lnCalendarEnabled', value)}
            />
            <SettingItem
              icon="clock.fill"
              title="Scheduler"
              subtitle="Programmation des paiements"
              value={lnbitsSettings.schedulerEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('schedulerEnabled', value)}
            />
            <SettingItem
              icon="hammer.fill"
              title="Auction House"
              subtitle="Système d'enchères"
              value={lnbitsSettings.auctionHouseEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('auctionHouseEnabled', value)}
            />
            <SettingItem
              icon="star.fill"
              title="Paid Review"
              subtitle="Revues payantes"
              value={lnbitsSettings.paidReviewEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('paidReviewEnabled', value)}
            />
            <SettingItem
              icon="bitcoinsign.circle.fill"
              title="Sellcoins"
              subtitle="Vente de cryptomonnaies"
              value={lnbitsSettings.sellcoinsEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('sellcoinsEnabled', value)}
            />
            <SettingItem
              icon="terminal.fill"
              title="LNPoS"
              subtitle="Terminal point de vente offline"
              value={lnbitsSettings.lnposEnabled}
              onValueChange={(value) => handleLnbitsSettingChange('lnposEnabled', value)}
            />
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>User View</Text>
          <Card style={styles.settingsCard}>
            <Button
              title="Go to User View"
              onPress={() => router.push({ pathname: '/(tabs)' } as any)}
              variant="primary"
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Actions</Text>
          <Card style={styles.settingsCard}>
            <Button
              title="Exporter les paramètres"
              onPress={handleExportSettings}
              variant="secondary"
              style={{ marginBottom: 12 }}
            />
            <Button
              title="Importer les paramètres"
              onPress={handleImportSettings}
              variant="secondary"
              style={{ marginBottom: 12 }}
            />
            <Button
              title="Réinitialiser les paramètres"
              onPress={handleResetSettings}
              variant="secondary"
            />
          </Card>
        </View>

        {/* Informations de l'application */}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['text.primary'] }]}>Informations</Text>
          <Card style={styles.settingsCard}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors['text.secondary'] }]}>Version de l'application</Text>
              <Text style={[styles.infoValue, { color: colors['text.primary'] }]}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors['text.secondary'] }]}>Version LNbits</Text>
              <Text style={[styles.infoValue, { color: colors['text.primary'] }]}>0.12.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors['text.secondary'] }]}>Réseau Bitcoin</Text>
              <Text style={[styles.infoValue, { color: colors['text.primary'] }]}>Testnet</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors['text.secondary'] }]}>Dernière mise à jour</Text>
              <Text style={[styles.infoValue, { color: colors['text.primary'] }]}>24 octobre 2025</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingsCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
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

export default SettingsScreen;
