import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

interface TimelineStepProps {
  isFirst?: boolean;
  isLast?: boolean;
  isActive: boolean;
  isCompleted: boolean;
  title: string;
  description: string;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ isFirst, isLast, isActive, isCompleted, title, description }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        {!isFirst && (
          <View style={[styles.lineTop, { backgroundColor: colors['surface.default'] }]} />
        )}
        <IconSymbol
          name={isCompleted ? 'checkmark.circle.fill' : 'circle'}
          size={24}
          color={isCompleted ? colors['state.success.fg'] : colors['text.muted']}
        />
        {!isLast && (
          <View style={[styles.lineBottom, { backgroundColor: colors['surface.default'] }]} />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[styles.title, { color: isCompleted ? colors['text.primary'] : colors['text.muted'] }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <Text style={[styles.description, { color: colors['text.secondary'] }]}>{description}</Text>
      </View>
    </View>
  );
};

interface TimelineProps {
  steps: { title: string; description: string }[];
  currentStep: number;
}

export const Timeline: React.FC<TimelineProps> = ({ steps, currentStep }) => {
  return (
    <View>
      {steps.map((step, index) => (
        <TimelineStep
          key={index}
          isFirst={index === 0}
          isLast={index === steps.length - 1}
          isActive={index === currentStep}
          isCompleted={index < currentStep}
          title={step.title}
          description={step.description}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    position: 'relative',
    marginRight: 16,
  },
  lineTop: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 12,
    zIndex: -1,
  },
  lineBottom: {
    position: 'absolute',
    top: 24,
    width: 2,
    height: 24,
    zIndex: -1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
});
