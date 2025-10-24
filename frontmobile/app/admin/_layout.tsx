import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        headerTitle: '',
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 15 }}>
            <IconSymbol
              name="person.crop.circle"
              size={28}
              color={Colors[colorScheme ?? 'light'].text}
              style={{ marginRight: 15 }}
            />
            <IconSymbol name="bell" size={28} color={Colors[colorScheme ?? 'light'].text} />
          </View>
        ),
      }}>
      <Tabs.Screen
        name="AdminDashboardScreen"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="TPoSScreen"
        options={{
          title: 'TPoS',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="creditcard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="UserManagementScreen"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="SupportScreen"
        options={{
          title: 'Support',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="questionmark.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="SettingsScreen"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
