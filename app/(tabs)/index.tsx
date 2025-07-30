import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { UserCard } from '@/components/UserCard';
import { CourtCard } from '@/components/CourtCard';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { mockUsers, mockCourts, mockTournaments } from '@/lib/api';
import { Bell, Trophy, Calendar, TrendingUp, Users, MapPin, MessageSquare } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [nearbyPlayers, setNearbyPlayers] = useState(mockUsers.slice(0, 3));
  const [nearbyCourts, setNearbyCourts] = useState(mockCourts.slice(0, 2));
  const [upcomingTournaments, setUpcomingTournaments] = useState(mockTournaments.slice(0, 2));

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      router.replace('/auth');
    }
  }, [user]);

  if (!user) {
    return null; // Prevent flash while redirecting
  }

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{getGreeting()}, {user?.name}!</Text>
            <Text style={styles.subtitle}>Ready to play some {user?.sport_preference}?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#10B981" />
            <Text style={styles.statNumber}>
              {user?.ranking || 'Unranked'}
            </Text>
            <Text style={styles.statLabel}>Current Rank</Text>
          </View>
          <View style={styles.statCard}>
            <Trophy size={20} color="#F59E0B" />
            <Text style={styles.statNumber}>{user?.badges?.length || 0}</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={20} color="#8B5CF6" />
            <Text style={styles.statNumber}>{user?.match_history?.length || 0}</Text>
            <Text style={styles.statLabel}>Matches Played</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/matchmaking')}
          >
            <Users size={24} color="#10B981" />
            <Text style={styles.quickActionText}>Find Players</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/courts')}
          >
            <MapPin size={24} color="#8B5CF6" />
            <Text style={styles.quickActionText}>Find Courts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/tournaments')}
          >
            <Trophy size={24} color="#F59E0B" />
            <Text style={styles.quickActionText}>Tournaments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/feed')}
          >
            <MessageSquare size={24} color="#EC4899" />
            <Text style={styles.quickActionText}>Social Feed</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby Players */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Players Near You</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/matchmaking')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {nearbyPlayers.map((player) => (
            <UserCard key={player.id} user={player} showRanking />
          ))}
        </View>

        {/* Nearby Courts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Courts Near You</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/courts')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {nearbyCourts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </View>

        {/* Upcoming Tournaments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
            <TouchableOpacity onPress={() => router.push('/tournaments')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingTournaments.map((tournament: any) => (
            <View key={tournament.id} style={styles.tournamentCard}>
              <View style={styles.tournamentHeader}>
                <Text style={styles.tournamentName}>{tournament.name}</Text>
                <Text style={styles.tournamentSport}>
                  {tournament.sport === 'tennis' ? '🎾' : '🏓'}
                </Text>
              </View>
              <Text style={styles.tournamentDate}>
                {new Date(tournament.start_date).toLocaleDateString()}
              </Text>
              <Text style={styles.tournamentLocation}>{tournament.location}</Text>
              <View style={styles.tournamentFooter}>
                <Text style={styles.entryFee}>${tournament.entry_fee}</Text>
                <Text style={styles.participants}>
                  {tournament.participants.length}/{tournament.max_participants} players
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <FloatingActionButton route="/feed" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  notificationButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  tournamentCard: {
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
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tournamentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  tournamentSport: {
    fontSize: 20,
  },
  tournamentDate: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 4,
  },
  tournamentLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  tournamentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryFee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  participants: {
    fontSize: 14,
    color: '#6B7280',
  },
});