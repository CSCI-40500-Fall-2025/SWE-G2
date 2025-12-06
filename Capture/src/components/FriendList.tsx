import React, { useState, useMemo } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { FriendListItem } from '../types/FriendTypes';

interface FriendListProps {
  friends: FriendListItem[];
  onUnfriend: (userId: string) => void;
}

const FriendList: React.FC<FriendListProps> = ({ friends, onUnfriend }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = useMemo(() => {
    return friends.filter(friend =>
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  const handleUnfriendPress = (friend: FriendListItem) => {
    Alert.alert(
      `Remove ${friend.username}?`,
      `Are you sure you want to remove ${friend.username} from your friends?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => onUnfriend(friend.id)
        },
      ]
    );
  };

  const renderFriendItem = ({ item }: { item: FriendListItem }) => (
    <View style={styles.friendCardContainer}>
      <View style={styles.friendCard}>
        <Image source={{ uri: item.imageURL }} style={styles.avatar} />
        <View style={styles.friendInfo}>
          <Text style={styles.username}>{item.username}</Text>
        </View>
        <TouchableOpacity
          style={styles.unfriendButton}
          onPress={() => handleUnfriendPress(item)}
        >
          <Text style={styles.unfriendText}>Unfriend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search friends..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  if (friends.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No friends yet</Text>
        <Text style={styles.emptySubtext}>Add friends to see them here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderSearchBar()}
      <FlatList
        data={filteredFriends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f1f3',
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  friendCardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e5e7eb',
    marginRight: 16,
  },
  friendInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    marginLeft: 0,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  unfriendButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1.5,
    borderColor: '#d1d5db',
  },
  unfriendText: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default FriendList;