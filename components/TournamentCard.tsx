import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tournament } from '@/lib/types';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react-native';

interface TournamentCardProps {
  tournament: Tournament;
  onPress?: () => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onPress }) => {
  const getStatusColor = () => {
    switch (tournament.status) {
      case 'upcoming':
        return '#10B981';
      case 'active':
        return '#F59E0B';
      case 'completed':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{tournament.name}</Text>
          <Text style={styles.sport}>
            {tournament.sport === 'tennis' ? '🎾' : '🏓'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>
            {tournament.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {tournament.description}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {formatDate(tournament.start_date)}
            {tournament.end_date !== tournament.start_date && 
              ` - ${formatDate(tournament.end_date)}`
            }
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.detailText}>{tournament.location}</Text>
        </View>

        <View style={styles.detailRow}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {tournament.participants.length}/{tournament.max_participants} players
          </Text>
        </View>

        <View style={styles.detailRow}>
          <DollarSign size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            ${tournament.entry_fee} entry fee
          </Text>
        </View>
      </View>

      {tournament.status === 'upcoming' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Tournament</Text>
          </TouchableOpacity>
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  sport: {
    fontSize: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  joinButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});