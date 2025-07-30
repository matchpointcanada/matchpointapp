import axios from 'axios';

const API_BASE_URL = 'https://api.matchpoint.app'; // Replace with actual API URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Mock data for development
export const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    sport_preference: 'tennis',
    skill_level: 'advanced',
    city: 'San Francisco',
    ranking: 150,
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    name: 'Mike Chen',
    sport_preference: 'pickleball',
    skill_level: 'intermediate',
    city: 'San Francisco',
    ranking: 280,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export const mockCourts = [
  {
    id: '1',
    name: 'Golden Gate Tennis Club',
    address: '1200 Montgomery St, San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
    sport_type: 'tennis',
    surface_type: 'hard',
    is_public: false,
    amenities: ['Parking', 'Pro Shop', 'Locker Rooms'],
    rating: 4.5,
    photos: ['https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400'],
  },
  {
    id: '2',
    name: 'Mission Bay Pickleball Courts',
    address: '1200 4th St, San Francisco, CA',
    latitude: 37.7699,
    longitude: -122.3900,
    sport_type: 'pickleball',
    surface_type: 'hard',
    is_public: true,
    amenities: ['Free Parking', 'Restrooms'],
    rating: 4.2,
    photos: ['https://images.pexels.com/photos/8007412/pexels-photo-8007412.jpeg?auto=compress&cs=tinysrgb&w=400'],
  },
];

export const mockTournaments = [
  {
    id: '1',
    name: 'Bay Area Tennis Championship',
    description: 'Annual tennis tournament for all skill levels',
    sport: 'tennis',
    start_date: '2024-03-15T09:00:00Z',
    end_date: '2024-03-17T18:00:00Z',
    location: 'Golden Gate Tennis Club',
    entry_fee: 75,
    max_participants: 32,
    participants: ['1', '2'],
    host_id: '1',
    status: 'upcoming',
  },
];

// API functions
export const getUsersNearby = async (latitude: number, longitude: number, radius: number) => {
  // Mock implementation
  return mockUsers.filter(user => user.city === 'San Francisco');
};

export const getCourtsNearby = async (latitude: number, longitude: number, radius: number) => {
  // Mock implementation
  return mockCourts;
};

export const getTournaments = async () => {
  // Mock implementation
  return mockTournaments;
};