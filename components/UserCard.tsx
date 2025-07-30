import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { User } from '@/lib/types';
import { SkillBadge } from './SkillBadge';

interface UserCardProps {
  user: Partial<User>;
  onPress?: () => void;
  showRanking?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onPress, showRanking = false }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.avatar || 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400' }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.city}>{user.city}</Text>
          {showRanking && user.ranking && (
            <Text style={styles.ranking}>Rank #{user.ranking}</Text>
          )}
        </View>
        <View style={styles.badges}>
          {user.skill_level && <SkillBadge skill={user.skill_level} size="small" />}
          <View style={styles.sportBadge}>
            <Text style={styles.sportText}>
              {user.sport_preference === 'both' ? '🎾🏓' : user.sport_preference === 'tennis' ? '🎾' : '🏓'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  city: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  ranking: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  badges: {
    alignItems: 'flex-end',
  },
  sportBadge: {
    marginTop: 4,
  },
  sportText: {
    fontSize: 16,
  },
});