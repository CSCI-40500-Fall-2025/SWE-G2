import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FriendListItem } from '../types/FriendTypes';

interface FriendListProps {
  friends: FriendListItem[];
  onUnfriend: (userId: string) => void;
}

const FriendList: React.FC<FriendListProps> = ({ friends, onUnfriend }) => {
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
    <View style={styles.friendRow}>
      <Image source={{ uri: item.imageURL }} style={styles.avatar} />
      <Text style={styles.username}>{item.username}</Text>
      <TouchableOpacity
        style={styles.unfriendButton}
        onPress={() => handleUnfriendPress(item)}
      >
        <Text style={styles.unfriendText}>Unfriend</Text>
      </TouchableOpacity>
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
    <FlatList
      data={friends}
      renderItem={renderFriendItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e5e7eb",
  },
  username: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  unfriendButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ff3b30',
  },
  unfriendText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default FriendList;