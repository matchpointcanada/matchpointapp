import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { TournamentCard } from '@/components/TournamentCard';
import { mockTournaments } from '@/lib/api';
import { Plus, Filter, Trophy, Calendar } from 'lucide-react-native';

export default function TournamentsScreen() {
  const { user } = useAuth();
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');
  const [tournaments] = useState(mockTournaments);

  const canCreateTournament = user?.subscription_type === 'pro' || user?.subscription_type === 'coach';

  const filteredTournaments = tournaments.filter(tournament => {
    if (filter === 'all') return true;
    return tournament.status === filter;
  });

  const CreateTournamentModal = () => (
    <Modal visible={showCreateTournament} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.createModal}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowCreateTournament(false)}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Create Tournament</Text>
          <TouchableOpacity onPress={() => alert('Tournament creation coming soon!')}>
            <Text style={styles.modalSave}>Create</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.createContent}>
          <Text style={styles.comingSoon}>Tournament creation coming soon!</Text>
          <Text style={styles.comingSoonText}>
            This feature will allow Pro and Coach users to create and manage tournaments.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Tournaments</Text>
            <Text style={styles.headerSubtitle}>
              {filteredTournaments.length} tournaments available
            </Text>
          </View>
          
          {canCreateTournament && (
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => setShowCreateTournament(true)}
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(['all', 'upcoming', 'active', 'completed'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterTab, filter === status && styles.activeFilterTab]}
              onPress={() => setFilter(status)}
            >
              <Text style={[
                styles.filterTabText,
                filter === status && styles.activeFilterTabText
              ]}>
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tournaments List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {!canCreateTournament && (
            <View style={styles.upgradeNotice}>
              <Trophy size={24} color="#F59E0B" />
              <Text style={styles.upgradeTitle}>Upgrade to Join Tournaments</Text>
              <Text style={styles.upgradeText}>
                Pro users can participate in tournaments and track their competitive progress.
              </Text>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
              </TouchableOpacity>
            </View>
          )}

          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onPress={() => {/* Navigate to tournament details */}}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No tournaments found</Text>
              <Text style={styles.emptyStateText}>
                {filter === 'all' 
                  ? 'No tournaments are currently available'
                  : `No ${filter} tournaments found`
                }
              </Text>
            </View>
          )}
        </ScrollView>

        <CreateTournamentModal />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  createButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 24,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#10B981',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  upgradeNotice: {
    backgroundColor: '#FFFBEB',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginTop: 8,
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 14,
    color: '#B45309',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  createModal: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalSave: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  createContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  comingSoon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});