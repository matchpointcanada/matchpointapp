export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  sport_preference: 'tennis' | 'pickleball' | 'both';
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  city: string;
  ranking?: number;
  badges: Badge[];
  subscription_type: 'free' | 'pro' | 'coach';
  match_history: Match[];
  created_at: string;
}

export interface Coach extends User {
  services: string[];
  hourly_rate: number;
  availability: string[];
  bio: string;
  years_experience: number;
  certifications: string[];
}

export interface Court {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  sport_type: 'tennis' | 'pickleball' | 'both';
  surface_type: 'hard' | 'clay' | 'grass' | 'indoor';
  is_public: boolean;
  amenities: string[];
  rating: number;
  photos: string[];
  submitted_by: string;
  approved: boolean;
  created_at: string;
}

export interface Match {
  id: string;
  player1_id: string;
  player2_id: string;
  court_id?: string;
  sport: 'tennis' | 'pickleball';
  score: string;
  winner_id: string;
  played_at: string;
  ranking_points: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  sport: 'tennis' | 'pickleball';
  start_date: string;
  end_date: string;
  location: string;
  entry_fee: number;
  max_participants: number;
  participants: string[];
  brackets: TournamentBracket[];
  host_id: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface TournamentBracket {
  round: number;
  matches: Match[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  chat_id: string;
}

export interface Chat {
  id: string;
  type: 'one_on_one' | 'group' | 'event';
  participants: string[];
  last_message?: ChatMessage;
  created_at: string;
  event_id?: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  type: 'match_result' | 'achievement' | 'general' | 'coach_ad';
  images?: string[];
  match_id?: string;
  badge_id?: string;
  created_at: string;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface SubscriptionPlan {
  type: 'free' | 'pro' | 'coach';
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
}

export interface PaymentMethod {
  id: string;
  type: 'stripe' | 'paypal';
  last_four?: string;
  brand?: string;
  is_default: boolean;
}