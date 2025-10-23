import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({ title, onPress, variant = 'primary', style, textStyle }: ButtonProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: variant === 'primary' ? colors['brand.primary'] : colors['surface.default'],
    },
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color: variant === 'primary' ? colors['brand.primary.on'] : colors['text.primary'],
    },
    textStyle,
  ];

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress}>
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
