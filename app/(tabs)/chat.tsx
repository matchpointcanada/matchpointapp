import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Chat, ChatMessage } from '@/lib/types';
import { Search, MessageCircle, Users, Send } from 'lucide-react-native';

export default function ChatScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'groups'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock chat data
  const mockChats: Chat[] = [
    {
      id: '1',
      type: 'one_on_one',
      participants: ['1', '2'],
      last_message: {
        id: '1',
        sender_id: '2',
        content: 'Hey, want to play tennis this evening?',
        timestamp: new Date().toISOString(),
        chat_id: '1'
      },
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      type: 'group',
      participants: ['1', '2', '3', '4'],
      last_message: {
        id: '2',
        sender_id: '3',
        content: 'Tournament starts at 9 AM tomorrow!',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        chat_id: '2'
      },
      created_at: new Date().toISOString(),
      event_id: '1'
    }
  ];

  const [chats] = useState(mockChats);

  const getFilteredChats = () => {
    let filtered = chats;
    
    if (activeTab === 'direct') {
      filtered = chats.filter(chat => chat.type === 'one_on_one');
    } else if (activeTab === 'groups') {
      filtered = chats.filter(chat => chat.type === 'group' || chat.type === 'event');
    }

    if (searchQuery) {
      // In a real app, you'd search by participant names or chat titles
      filtered = filtered.filter(chat => 
        chat.last_message?.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const ChatItem = ({ chat }: { chat: Chat }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.chatAvatar}>
        {chat.type === 'one_on_one' ? (
          <MessageCircle size={24} color="#10B981" />
        ) : (
          <Users size={24} color="#8B5CF6" />
        )}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>
            {chat.type === 'one_on_one' 
              ? 'Sarah Johnson' // In real app, get participant name
              : chat.type === 'event' 
                ? 'Bay Area Tennis Championship'
                : 'Tennis Group'
            }
          </Text>
          <Text style={styles.chatTime}>
            {chat.last_message && formatTime(chat.last_message.timestamp)}
          </Text>
        </View>
        
        <View style={styles.chatPreview}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {chat.last_message?.content || 'No messages yet'}
          </Text>
          {chat.type === 'event' && (
            <View style={styles.eventBadge}>
              <Text style={styles.eventBadgeText}>Event</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <MessageCircle size={48} color="#D1D5DB" />
      <Text style={styles.emptyStateTitle}>No conversations yet</Text>
      <Text style={styles.emptyStateText}>
        {user?.subscription_type === 'free' 
          ? 'Upgrade to Pro to start group chats and access full messaging'
          : 'Start a conversation with other players'
        }
      </Text>
      {user?.subscription_type === 'free' && (
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        {user?.subscription_type !== 'free' && (
          <TouchableOpacity style={styles.newChatButton}>
            <MessageCircle size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'direct' && styles.activeTab]}
          onPress={() => setActiveTab('direct')}
        >
          <Text style={[styles.tabText, activeTab === 'direct' && styles.activeTabText]}>
            Direct
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
            Groups
          </Text>
          {user?.subscription_type === 'free' && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {getFilteredChats().length > 0 ? (
          getFilteredChats().map(chat => (
            <ChatItem key={chat.id} chat={chat} />
          ))
        ) : (
          <EmptyState />
        )}
      </ScrollView>

      {/* Subscription Notice */}
      {user?.subscription_type === 'free' && (
        <View style={styles.subscriptionNotice}>
          <Text style={styles.subscriptionNoticeText}>
            💬 Free users can only receive direct messages. Upgrade to Pro for full chat access!
          </Text>
        </View>
      )}
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
  newChatButton: {
    backgroundColor: '#10B981',
    padding: 10,
    borderRadius: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  searchInputContainer: {
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  proBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  chatTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  eventBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  eventBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
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
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  subscriptionNotice: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F59E0B',
  },
  subscriptionNoticeText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
  },
});