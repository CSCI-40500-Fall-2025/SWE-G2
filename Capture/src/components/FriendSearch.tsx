import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { User, FriendStatus } from '../types/FriendTypes';

interface FriendSearchProps {
  onSendRequest: (userId: string) => void;
  pendingRequests: string[];
  mockUsers: User[]; // List of all users to search from (mock data)
}

const FriendSearch: React.FC<FriendSearchProps> = ({ onSendRequest, pendingRequests, mockUsers }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
    
    if (query.length > 0) {
      // Search through mock users
      const results = mockUsers.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const getButtonStatus = (userId: string): FriendStatus => {
    if (pendingRequests.includes(userId)) return 'pending';
    return 'none';
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const status = getButtonStatus(item.id);
    
    return (
      <View style={styles.userRow}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            status === 'pending' && styles.pendingButton
          ]}
          onPress={() => onSendRequest(item.id)}
          disabled={status === 'pending'}
        >
          <Text style={styles.buttonText}>
            {status === 'pending' ? 'Request Sent' : 'Add Friend'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by username..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      
      {searchResults.length === 0 && searchQuery.length > 0 ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>No users found</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  resultsList: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  pendingButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
});

export default FriendSearch;