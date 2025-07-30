import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { CourtCard } from '@/components/CourtCard';
import { mockCourts } from '@/lib/api';
import { Court } from '@/lib/types';
import { Search, Filter, List, Map, Plus, MapPin, Star } from 'lucide-react-native';

export default function CourtsScreen() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddCourt, setShowAddCourt] = useState(false);
  const [courts, setCourts] = useState(mockCourts);
  const [filteredCourts, setFilteredCourts] = useState(mockCourts);
  const [location, setLocation] = useState<any>(null);
  const [filters, setFilters] = useState({
    sport: 'all',
    surface: 'all',
    type: 'all',
    rating: 0
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, courts]);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const applyFilters = () => {
    let filtered = [...courts];

    if (searchQuery) {
      filtered = filtered.filter(court => 
        court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        court.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.sport !== 'all') {
      filtered = filtered.filter(court => 
        court.sport_type === filters.sport || court.sport_type === 'both'
      );
    }

    if (filters.surface !== 'all') {
      filtered = filtered.filter(court => court.surface_type === filters.surface);
    }

    if (filters.type !== 'all') {
      const isPublic = filters.type === 'public';
      filtered = filtered.filter(court => court.is_public === isPublic);
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(court => court.rating >= filters.rating);
    }

    setFilteredCourts(filtered);
  };

  const AddCourtModal = () => (
    <Modal visible={showAddCourt} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.addCourtModal}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAddCourt(false)}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add New Court</Text>
          <TouchableOpacity>
            <Text style={styles.modalSave}>Submit</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.addCourtContent}>
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Court Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter court name"
            />
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Address</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter full address"
              multiline
            />
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Sport Type</Text>
            <View style={styles.sportOptions}>
              {['tennis', 'pickleball', 'both'].map((sport) => (
                <TouchableOpacity key={sport} style={styles.sportOption}>
                  <Text style={styles.sportOptionText}>
                    {sport === 'both' ? 'Both Sports' : sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Surface Type</Text>
            <View style={styles.sportOptions}>
              {['hard', 'clay', 'grass', 'indoor'].map((surface) => (
                <TouchableOpacity key={surface} style={styles.sportOption}>
                  <Text style={styles.sportOptionText}>
                    {surface.charAt(0).toUpperCase() + surface.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Court Type</Text>
            <View style={styles.sportOptions}>
              <TouchableOpacity style={styles.sportOption}>
                <Text style={styles.sportOptionText}>Public</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sportOption}>
                <Text style={styles.sportOptionText}>Private</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.submissionNote}>
            Court submissions are reviewed by our team before being approved.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );

  const FilterModal = () => (
    <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.filterModal}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity onPress={() => setFilters({ sport: 'all', surface: 'all', type: 'all', rating: 0 })}>
            <Text style={styles.modalSave}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterContent}>
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sport</Text>
            <View style={styles.filterOptions}>
              {['all', 'tennis', 'pickleball'].map((sport) => (
                <TouchableOpacity
                  key={sport}
                  style={[styles.filterOption, filters.sport === sport && styles.filterOptionActive]}
                  onPress={() => setFilters(prev => ({ ...prev, sport }))}
                >
                  <Text style={[styles.filterOptionText, filters.sport === sport && styles.filterOptionTextActive]}>
                    {sport === 'all' ? 'All Sports' : sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Surface</Text>
            <View style={styles.filterOptions}>
              {['all', 'hard', 'clay', 'grass', 'indoor'].map((surface) => (
                <TouchableOpacity
                  key={surface}
                  style={[styles.filterOption, filters.surface === surface && styles.filterOptionActive]}
                  onPress={() => setFilters(prev => ({ ...prev, surface }))}
                >
                  <Text style={[styles.filterOptionText, filters.surface === surface && styles.filterOptionTextActive]}>
                    {surface === 'all' ? 'All Surfaces' : surface.charAt(0).toUpperCase() + surface.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Type</Text>
            <View style={styles.filterOptions}>
              {['all', 'public', 'private'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.filterOption, filters.type === type && styles.filterOptionActive]}
                  onPress={() => setFilters(prev => ({ ...prev, type }))}
                >
                  <Text style={[styles.filterOptionText, filters.type === type && styles.filterOptionTextActive]}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
            <View style={styles.ratingOptions}>
              {[0, 3, 4, 4.5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[styles.ratingOption, filters.rating === rating && styles.ratingOptionActive]}
                  onPress={() => setFilters(prev => ({ ...prev, rating }))}
                >
                  <Star size={16} color={filters.rating === rating ? 'white' : '#F59E0B'} />
                  <Text style={[styles.ratingOptionText, filters.rating === rating && styles.ratingOptionTextActive]}>
                    {rating === 0 ? 'Any' : `${rating}+`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Courts</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddCourt(true)}
          >
            <Plus size={20} color="#10B981" />
          </TouchableOpacity>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewToggleButton, viewMode === 'map' && styles.viewToggleButtonActive]}
              onPress={() => setViewMode('map')}
            >
              <Map size={16} color={viewMode === 'map' ? 'white' : '#6B7280'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewToggleButton, viewMode === 'list' && styles.viewToggleButtonActive]}
              onPress={() => setViewMode('list')}
            >
              <List size={16} color={viewMode === 'list' ? 'white' : '#6B7280'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courts..."
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

      {/* Content */}
      {viewMode === 'map' ? (
        <MapView
          style={styles.map}
          region={location}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {filteredCourts.map((court) => (
            <Marker
              key={court.id}
              coordinate={{
                latitude: court.latitude,
                longitude: court.longitude,
              }}
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{court.name}</Text>
                  <Text style={styles.calloutRating}>⭐ {court.rating}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <ScrollView style={styles.listView}>
          <Text style={styles.resultsCount}>
            {filteredCourts.length} courts found
          </Text>
          {filteredCourts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </ScrollView>
      )}

      <FilterModal />
      <AddCourtModal />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  viewToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewToggleButtonActive: {
    backgroundColor: '#10B981',
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
  map: {
    flex: 1,
  },
  callout: {
    alignItems: 'center',
    padding: 8,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  calloutRating: {
    fontSize: 12,
    color: '#F59E0B',
    marginTop: 2,
  },
  listView: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterModal: {
    flex: 1,
    backgroundColor: 'white',
  },
  addCourtModal: {
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
  filterContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addCourtContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  formSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportOptions: {
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
  sportOption: {
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
  sportOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: 'white',
  },
  ratingOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  ratingOptionActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  ratingOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  ratingOptionTextActive: {
    color: 'white',
  },
  submissionNote: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});