import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/config';

import HomeScreen from '../screens/HomeScreen';
import CertificateFormScreen from '../screens/CertificateFormScreen';
import PaymentScreen from '../screens/PaymentScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import PDFViewerScreen from '../screens/PDFViewerScreen';
import VerificationScreen from '../screens/VerificationScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.HOME}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
        <Stack.Screen name={ROUTES.CERTIFICATE_FORM} component={CertificateFormScreen} />
        <Stack.Screen name={ROUTES.PAYMENT} component={PaymentScreen} />
        <Stack.Screen name={ROUTES.QR_SCANNER} component={QRScannerScreen} />
        <Stack.Screen name={ROUTES.PDF_VIEWER} component={PDFViewerScreen} />
        <Stack.Screen name={ROUTES.VERIFICATION} component={VerificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
