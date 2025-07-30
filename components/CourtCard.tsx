import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Court } from '@/lib/types';

interface CourtCardProps {
  court: Court;
  onPress?: () => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({ court, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: court.photos[0] || 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{court.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {court.rating}</Text>
          </View>
        </View>
        <Text style={styles.address}>{court.address}</Text>
        <View style={styles.details}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {court.sport_type === 'both' ? '🎾🏓' : court.sport_type === 'tennis' ? '🎾' : '🏓'}
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: court.is_public ? '#10B981' : '#F97316' }]}>
            <Text style={styles.tagText}>{court.is_public ? 'Public' : 'Private'}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{court.surface_type}</Text>
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
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
});