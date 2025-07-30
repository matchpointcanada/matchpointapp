import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SkillBadgeProps {
  skill: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  size?: 'small' | 'medium' | 'large';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, size = 'medium' }) => {
  const getSkillColor = () => {
    switch (skill) {
      case 'beginner':
        return '#10B981'; // Green
      case 'intermediate':
        return '#F59E0B'; // Yellow
      case 'advanced':
        return '#F97316'; // Orange
      case 'pro':
        return '#DC2626'; // Red
      default:
        return '#6B7280'; // Gray
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10 };
      case 'large':
        return { paddingHorizontal: 16, paddingVertical: 6, fontSize: 16 };
      default:
        return { paddingHorizontal: 12, paddingVertical: 4, fontSize: 12 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.badge, { backgroundColor: getSkillColor() }, sizeStyles]}>
      <Text style={[styles.text, { fontSize: sizeStyles.fontSize }]}>
        {skill.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});