import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol.ios';

const OrderScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { name, priceSats, priceFcfa } = useLocalSearchParams();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleConfirmOrder = () => {
    setPaymentSuccess(true);
  };

  if (paymentSuccess) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.successContainer}>
          <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.icon, { color: '#10B981' }]}>
              <IconSymbol name="checkmark.circle.fill" size={50} color="#10B981" />
            </Text>
          </View>
          <Text style={[styles.title, { color: colors['text.primary'] }]}>Paiement réussi !</Text>
          <Text style={[styles.subtitle, { color: colors['text.secondary'] }]}>
            Votre demande de certificat a été soumise avec succès.
          </Text>
          <Button
            title="Retour à l'accueil"
            onPress={() => router.replace('/(tabs)')}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors['text.primary'] }]}>Review Your Order</Text>

        <Card style={styles.orderCard}>
          <Text style={[styles.serviceName, { color: colors['text.primary'] }]}>{name}</Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceSats, { color: colors['brand.primary'] }]}>{priceSats} sats</Text>
            <Text style={[styles.priceFcfa, { color: colors['text.muted'] }]}>~{priceFcfa} FCFA</Text>
          </View>
          <Text style={[styles.description, { color: colors['text.secondary'] }]}>
            You are about to purchase a digital, blockchain-verified version of your {name}.
          </Text>
        </Card>

        <Button title="Confirm and Proceed to Payment" onPress={handleConfirmOrder} variant="primary" style={{ marginTop: 24 }} />
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
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  orderCard: {
    padding: 24,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  priceSats: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  priceFcfa: {
    fontSize: 16,
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 50,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
});

export default OrderScreen;
