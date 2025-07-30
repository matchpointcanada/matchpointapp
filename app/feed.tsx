import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Post, Comment } from '@/lib/types';
import { Heart, MessageCircle, Share, Trophy, Users } from 'lucide-react-native';

export default function FeedScreen() {
  const { user } = useAuth();
  
  // Mock feed data
  const mockPosts: Post[] = [
    {
      id: '1',
      user_id: '2',
      content: 'Just won my first tournament match! 🎾 The training is paying off.',
      type: 'match_result',
      match_id: '1',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      likes: ['1', '3'],
      comments: [
        {
          id: '1',
          user_id: '1',
          content: 'Congratulations! Well played!',
          created_at: new Date(Date.now() - 1800000).toISOString()
        }
      ]
    },
    {
      id: '2',
      user_id: '3',
      content: 'Looking for a hitting partner this weekend. Anyone up for some pickleball?',
      type: 'general',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      likes: ['1', '2'],
      comments: []
    },
    {
      id: '3',
      user_id: '1',
      content: 'Earned my "Rising Star" badge! 🌟 Thanks to everyone who helped me improve.',
      type: 'achievement',
      badge_id: '1',
      created_at: new Date(Date.now() - 10800000).toISOString(),
      likes: ['2', '3', '4'],
      comments: [
        {
          id: '2',
          user_id: '2',
          content: 'Well deserved! Keep it up!',
          created_at: new Date(Date.now() - 9000000).toISOString()
        }
      ]
    }
  ];

  const [posts, setPosts] = useState(mockPosts);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const toggleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(user?.id || '');
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(id => id !== user?.id)
              : [...post.likes, user?.id || '']
          };
        }
        return post;
      })
    );
  };

  const getPostTypeIcon = (type: Post['type']) => {
    switch (type) {
      case 'match_result':
        return <Trophy size={16} color="#10B981" />;
      case 'achievement':
        return <Trophy size={16} color="#F59E0B" />;
      case 'coach_ad':
        return <Users size={16} color="#8B5CF6" />;
      default:
        return null;
    }
  };

  const PostItem = ({ post }: { post: Post }) => {
    const isLiked = post.likes.includes(user?.id || '');

    return (
      <View style={styles.postCard}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.userAvatar}
          />
          <View style={styles.postUserInfo}>
            <View style={styles.postUserName}>
              <Text style={styles.userName}>
                {post.user_id === '1' ? user?.name : 
                 post.user_id === '2' ? 'Sarah Johnson' : 
                 'Mike Chen'}
              </Text>
              {getPostTypeIcon(post.type)}
            </View>
            <Text style={styles.postTime}>
              {formatTimeAgo(post.created_at)}
            </Text>
          </View>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleLike(post.id)}
          >
            <Heart 
              size={20} 
              color={isLiked ? '#EC4899' : '#6B7280'} 
              fill={isLiked ? '#EC4899' : 'none'}
            />
            <Text style={[
              styles.actionText,
              { color: isLiked ? '#EC4899' : '#6B7280' }
            ]}>
              {post.likes.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color="#6B7280" />
            <Text style={styles.actionText}>{post.comments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Share size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Comments */}
        {post.comments.length > 0 && (
          <View style={styles.commentsSection}>
            {post.comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commentText}>
                    <Text style={styles.commentUser}>
                      {comment.user_id === '1' ? user?.name : 'Sarah Johnson'}
                    </Text>
                    {' '}
                    {comment.content}
                  </Text>
                  <Text style={styles.commentTime}>
                    {formatTimeAgo(comment.created_at)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
          <Text style={styles.headerSubtitle}>
            Stay updated with your tennis & pickleball community
          </Text>
        </View>

        {/* Feed */}
        <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}

          {/* Empty State for more posts */}
          <View style={styles.endOfFeed}>
            <Text style={styles.endOfFeedText}>You're all caught up! 🎾</Text>
            <Text style={styles.endOfFeedSubtext}>
              Check back later for more updates from your community
            </Text>
          </View>
        </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  feed: {
    flex: 1,
  },
  postCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  postTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  postContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 18,
  },
  commentUser: {
    fontWeight: '600',
  },
  commentTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  endOfFeed: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  endOfFeedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  endOfFeedSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});