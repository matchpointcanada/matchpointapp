import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { SkillBadge } from '@/components/SkillBadge';
import { Settings, CreditCard as Edit, Trophy, Calendar, Star, Crown, Users, TrendingUp } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [showSubscription, setShowSubscription] = useState(false);
  
  const subscriptionPlans = [
    {
      type: 'free',
      name: 'Free',
      price: '$0',
      features: ['Basic profile', 'Player matching', 'Direct messages only']
    },
    {
      type: 'pro',
      name: 'Pro',
      price: '$8.99/month',
      yearlyPrice: '$70/year',
      features: ['Everything in Free', 'Dynamic rankings', 'Tournament hosting', 'Group chats', 'Priority matching']
    },
    {
      type: 'coach',
      name: 'Coach',
      price: '$15/month',
      features: ['Everything in Pro', 'Advertise services', 'Coaching dashboard', 'Payment processing', 'Auto-recommendations']
    }
  ];

  const StatCard = ({ icon, value, label, color }: any) => (
    <View style={styles.statCard}>
      {icon}
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const SubscriptionModal = () => (
    <Modal visible={showSubscription} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.subscriptionModal}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowSubscription(false)}>
            <Text style={styles.modalCancel}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Subscription Plans</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.subscriptionContent}>
          {subscriptionPlans.map((plan) => (
            <View 
              key={plan.type} 
              style={[
                styles.planCard,
                user?.subscription_type === plan.type && styles.currentPlan
              ]}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                {user?.subscription_type === plan.type && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Current</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.planPricing}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                {plan.yearlyPrice && (
                  <Text style={styles.planYearlyPrice}>or {plan.yearlyPrice}</Text>
                )}
              </View>
              
              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureText}>✓ {feature}</Text>
                  </View>
                ))}
              </View>
              
              {user?.subscription_type !== plan.type && (
                <TouchableOpacity style={styles.selectPlanButton}>
                  <Text style={styles.selectPlanButtonText}>
                    {plan.type === 'free' ? 'Downgrade' : 'Upgrade'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Image
              source={{ 
                uri: user?.avatar || 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400' 
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.city}>{user?.city}</Text>
            
            <View style={styles.badges}>
              <SkillBadge skill={user?.skill_level || 'beginner'} />
              <View style={styles.subscriptionBadge}>
                <Crown size={16} color={user?.subscription_type === 'free' ? '#6B7280' : '#F59E0B'} />
                <Text style={[
                  styles.subscriptionText,
                  { color: user?.subscription_type === 'free' ? '#6B7280' : '#F59E0B' }
                ]}>
                  {user?.subscription_type?.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <StatCard
            icon={<TrendingUp size={24} color="#10B981" />}
            value={user?.ranking || 'Unranked'}
            label="Current Rank"
            color="#10B981"
          />
          <StatCard
            icon={<Trophy size={24} color="#F59E0B" />}
            value={user?.badges?.length || 0}
            label="Badges"
            color="#F59E0B"
          />
          <StatCard
            icon={<Calendar size={24} color="#8B5CF6" />}
            value={user?.match_history?.length || 0}
            label="Matches"
            color="#8B5CF6"
          />
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {user?.badges && user.badges.length > 0 ? (
            user.badges.map((badge) => (
              <View key={badge.id} style={styles.achievementItem}>
                <Text style={styles.achievementIcon}>{badge.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{badge.name}</Text>
                  <Text style={styles.achievementDescription}>{badge.description}</Text>
                </View>
                <Text style={styles.achievementDate}>
                  {new Date(badge.earned_at).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Trophy size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>No achievements yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Play matches to earn your first badge!
              </Text>
            </View>
          )}
        </View>

        {/* Match History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Matches</Text>
          {user?.match_history && user.match_history.length > 0 ? (
            user.match_history.slice(0, 3).map((match, index) => (
              <View key={index} style={styles.matchItem}>
                <View style={styles.matchInfo}>
                  <Text style={styles.matchOpponent}>vs. Opponent #{index + 1}</Text>
                  <Text style={styles.matchDate}>
                    {new Date(match.played_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.matchResult}>
                  <Text style={[
                    styles.matchScore,
                    { color: match.winner_id === user?.id ? '#10B981' : '#EF4444' }
                  ]}>
                    {match.score}
                  </Text>
                  <Text style={[
                    styles.matchOutcome,
                    { color: match.winner_id === user?.id ? '#10B981' : '#EF4444' }
                  ]}>
                    {match.winner_id === user?.id ? 'WIN' : 'LOSS'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Users size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>No matches played</Text>
              <Text style={styles.emptyStateSubtext}>
                Find players and start your first match!
              </Text>
            </View>
          )}
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowSubscription(true)}
          >
            <Crown size={20} color="#F59E0B" />
            <Text style={styles.actionButtonText}>Manage Subscription</Text>
            <Text style={styles.actionButtonArrow}>→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Settings size={20} color="#6B7280" />
            <Text style={styles.actionButtonText}>Account Settings</Text>
            <Text style={styles.actionButtonArrow}>→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]}
            onPress={logout}
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SubscriptionModal />
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
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  settingsButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  city: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    gap: 6,
  },
  subscriptionText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
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
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  achievementDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  matchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  matchInfo: {
    flex: 1,
  },
  matchOpponent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  matchDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  matchResult: {
    alignItems: 'flex-end',
  },
  matchScore: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  matchOutcome: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  actionButtonArrow: {
    fontSize: 16,
    color: '#6B7280',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    textAlign: 'center',
  },
  subscriptionModal: {
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
  subscriptionContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  planCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currentPlan: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  currentBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  planPricing: {
    marginBottom: 16,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  planYearlyPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  planFeatures: {
    marginBottom: 16,
  },
  featureItem: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  selectPlanButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectPlanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});