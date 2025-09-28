import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FriendRequest, User } from '../types/FriendTypes';

interface FriendRequestsProps {
  requests: (FriendRequest & { fromUser: User })[];
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ requests, onAccept, onDecline }) => {
  const renderRequestItem = ({ item }: { item: FriendRequest & { fromUser: User } }) => (
    <View style={styles.requestRow}>
      <Image source={{ uri: item.fromUser.avatar }} style={styles.avatar} />
      <View style={styles.requestInfo}>
        <Text style={styles.username}>{item.fromUser.username}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => onAccept(item.id)}
        >
          <Text style={styles.acceptText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={() => onDecline(item.id)}
        >
          <Text style={styles.declineText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (requests.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No friend requests</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={requests}
      renderItem={renderRequestItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e5e7eb',
  },
  requestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  acceptButton: {
    backgroundColor: '#007AFF',
  },
  declineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  acceptText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  declineText: {
    color: '#666',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default FriendRequests;