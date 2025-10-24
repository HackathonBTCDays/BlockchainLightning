import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { AppProvider } from '@/Provider/AppContext';
import Toast, { BaseToast } from 'react-native-toast-message';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

const styles = StyleSheet.create({
  toastWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  toastContainer: {
    backgroundColor: '#333',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 10,
  },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

const toastConfig = {
  success: (props: any) => (
    <View style={styles.toastWrapper}>
      <View style={styles.toastContainer}>
        <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
        <Text style={styles.toastText}>{props.text1}</Text>
      </View>
    </View>
  ),
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    <Toast config={toastConfig} />
    </AppProvider>
   
  );
}
