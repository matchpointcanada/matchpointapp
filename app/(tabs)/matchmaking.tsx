import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { UserCard } from '@/components/UserCard';
import { mockUsers } from '@/lib/api';
import { User } from '@/lib/types';
import { Search, Filter, MapPin, Users, Zap } from 'lucide-react-native';

export default function MatchmakingScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [filters, setFilters] = useState({
    sport: 'all',
    skillLevel: 'all',
    radius: 10,
    availability: 'all'
  });

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery]);

  const applyFilters = () => {
    let filtered = [...mockUsers];

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sport filter
    if (filters.sport !== 'all') {
      filtered = filtered.filter(u => 
        u.sport_preference === filters.sport || u.sport_preference === 'both'
      );
    }

    // Apply skill level filter
    if (filters.skillLevel !== 'all') {
      filtered = filtered.filter(u => u.skill_level === filters.skillLevel);
    }

    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setFilters({
      sport: 'all',
      skillLevel: 'all',
      radius: 10,
      availability: 'all'
    });
    setSearchQuery('');
  };

  const QuickMatchCard = () => (
    <View style={styles.quickMatchCard}>
      <View style={styles.quickMatchHeader}>
        <Zap size={24} color="#10B981" />
        <Text style={styles.quickMatchTitle}>Quick Match</Text>
      </View>
      <Text style={styles.quickMatchSubtitle}>
        Find players nearby for an instant match
      </Text>
      <TouchableOpacity style={styles.quickMatchButton}>
        <Text style={styles.quickMatchButtonText}>Find Match Now</Text>
      </TouchableOpacity>
    </View>
  );

  const FilterModal = () => (
    <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.filterModal}>
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.filterCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filters</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.filterClear}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterContent}>
          {/* Sport Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sport</Text>
            <View style={styles.filterOptions}>
              {['all', 'tennis', 'pickleball'].map((sport) => (
                <TouchableOpacity
                  key={sport}
                  style={[
                    styles.filterOption,
                    filters.sport === sport && styles.filterOptionActive
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, sport }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.sport === sport && styles.filterOptionTextActive
                  ]}>
                    {sport === 'all' ? 'All Sports' : sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Skill Level Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Skill Level</Text>
            <View style={styles.filterOptions}>
              {['all', 'beginner', 'intermediate', 'advanced', 'pro'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.filterOption,
                    filters.skillLevel === level && styles.filterOptionActive
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, skillLevel: level }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.skillLevel === level && styles.filterOptionTextActive
                  ]}>
                    {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Radius Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Distance</Text>
            <View style={styles.radiusContainer}>
              <Text style={styles.radiusText}>{filters.radius} miles</Text>
              <View style={styles.radiusButtons}>
                {[5, 10, 25, 50].map((radius) => (
                  <TouchableOpacity
                    key={radius}
                    style={[
                      styles.radiusButton,
                      filters.radius === radius && styles.radiusButtonActive
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, radius }))}
                  >
                    <Text style={[
                      styles.radiusButtonText,
                      filters.radius === radius && styles.radiusButtonTextActive
                    ]}>
                      {radius}mi
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.filterFooter}>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Players</Text>
        <View style={styles.headerStats}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.headerStatsText}>{filteredUsers.length} players nearby</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search players by name or city..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color="#10B981" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Match */}
        <QuickMatchCard />

        {/* Active Filters */}
        {(filters.sport !== 'all' || filters.skillLevel !== 'all' || searchQuery) && (
          <View style={styles.activeFilters}>
            <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterTags}>
                {filters.sport !== 'all' && (
                  <View style={styles.filterTag}>
                    <Text style={styles.filterTagText}>
                      {filters.sport.charAt(0).toUpperCase() + filters.sport.slice(1)}
                    </Text>
                  </View>
                )}
                {filters.skillLevel !== 'all' && (
                  <View style={styles.filterTag}>
                    <Text style={styles.filterTagText}>
                      {filters.skillLevel.charAt(0).toUpperCase() + filters.skillLevel.slice(1)}
                    </Text>
                  </View>
                )}
                {searchQuery && (
                  <View style={styles.filterTag}>
                    <Text style={styles.filterTagText}>"{searchQuery}"</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Players List */}
        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Available Players</Text>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((player) => (
              <UserCard 
                key={player.id} 
                user={player} 
                showRanking 
                onPress={() => {/* Navigate to player profile */}}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MapPin size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No players found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your filters or expanding your search radius
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <FilterModal />
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerStatsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  content: {
    flex: 1,
  },
  quickMatchCard: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    alignItems: 'center',
  },
  quickMatchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  quickMatchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  quickMatchSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 16,
  },
  quickMatchButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  quickMatchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  activeFilters: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  filterTags: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterTagText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '500',
  },
  playersSection: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
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
  filterModal: {
    flex: 1,
    backgroundColor: 'white',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterClear: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterOptionActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: 'white',
  },
  radiusContainer: {
    alignItems: 'center',
  },
  radiusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  radiusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  radiusButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  radiusButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  radiusButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  radiusButtonTextActive: {
    color: 'white',
  },
  filterFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});