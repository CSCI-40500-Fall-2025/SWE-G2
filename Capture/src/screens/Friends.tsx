import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FriendList from '../components/FriendList';
import FriendSearch from '../components/FriendSearch';
import FriendRequests from '../components/FriendRequests';
import { FriendRequest, User, FriendListItem } from '../types/FriendTypes';
import log from '../utils/logger'; // Add logger import

type TabType = 'myFriends' | 'search' | 'requests';

// Mock data - self-contained
const MOCK_FRIENDS: FriendListItem[] = [
  { 
    id: '1', 
    username: 'Spongebob', 
    imageURL: Image.resolveAssetSource(require('../assets/spongebob.jpg')).uri, 
    status: 'accepted' 
  },
  { 
    id: '2', 
    username: 'Mr. Krabs', 
    imageURL: Image.resolveAssetSource(require('../assets/Mr.krabs.webp')).uri, 
    status: 'accepted' 
  },
  { 
    id: '3', 
    username: 'Flats the Flounder', 
    imageURL: Image.resolveAssetSource(require('../assets/Flats_the_flounder.webp')).uri, 
    status: 'accepted' 
  },
  { 
    id: '4', 
    username: 'Bubble Bass', 
    imageURL: Image.resolveAssetSource(require('../assets/Bubble_bass.webp')).uri, 
    status: 'accepted' 
  },
];

const MOCK_USERS: User[] = [
  { 
    id: '5', 
    username: 'patrick',
    avatar: Image.resolveAssetSource(require('../assets/patrick.jpg')).uri,
  },
  { 
    id: '6', 
    username: 'sandy',
    avatar: Image.resolveAssetSource(require('../assets/sandy.jpg')).uri,
  },
];

const MOCK_PENDING_REQUESTS: (FriendRequest & { fromUser: User })[] = [
  {
    id: '1',
    fromUserId: '5',
    toUserId: 'current',
    status: 'pending',
    createdAt: new Date(),
    fromUser: MOCK_USERS[0], // patrick
  },
  {
    id: '2',
    fromUserId: '6',
    toUserId: 'current',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000),
    fromUser: MOCK_USERS[1], // sandy
  },
];

const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('myFriends');
  const [friends, setFriends] = useState<FriendListItem[]>(MOCK_FRIENDS);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [friendRequests, setFriendRequests] = useState<(FriendRequest & { fromUser: User })[]>(MOCK_PENDING_REQUESTS);

  // Component lifecycle logs
  React.useEffect(() => {
    // DEBUG (1x)
    log.debug("DEBUG: Friends component mounting - state initialization");
    
    // INFO (1x)
    log.info("INFO: Friends screen loaded successfully");
    
    // WARNING (3x)
    log.warn("WARNING: Friends using mock data - not connected to backend");
    log.warn("WARNING: Friends image loading may be slow");
    log.warn("WARNING: Friends list synchronization needed");
  }, []);

  const handleSendRequest = (userId: string): void => {
    // DEBUG (1x)
    log.debug("DEBUG: Friend request initiation - user targeting");
    
    // INFO (1x)
    log.info("INFO: Sending friend request to user: " + userId);
    
    console.log('Sending friend request to user:', userId);
    setPendingRequests(prev => [...prev, userId]);
    
    // WARNING (1x)
    log.warn("WARNING: Friend request pending - awaiting user response");
    
    Alert.alert('Success', 'Friend request sent!');
  };

  const handleAcceptRequest = (requestId: string): void => {
    // DEBUG (2x)
    log.debug("DEBUG: Friend request acceptance process started");
    log.debug("DEBUG: Request validation and user lookup");
    
    console.log('Accepting friend request:', requestId);
    
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      // INFO (2x)
      log.info("INFO: Friend request accepted for user: " + request.fromUser.username);
      log.info("INFO: Adding user to friends list: " + request.fromUser.id);
      
      // Add to friends list
      const newFriend: FriendListItem = {
        id: request.fromUser.id,
        username: request.fromUser.username,
        imageURL: request.fromUser.avatar || '',
        status: 'accepted'
      };
      
      setFriends(prev => [...prev, newFriend]);
      
      // Remove from requests
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      
      // INFO (1x)
      log.info("INFO: Friendship established with: " + request.fromUser.username);
      
      Alert.alert('Success', `You are now friends with ${request.fromUser.username}!`);
    } else {
      // ERROR (1x)
      log.error("ERROR: Friend request not found - ID: " + requestId);
    }
  };

  const handleDeclineRequest = (requestId: string): void => {
    // DEBUG (1x)
    log.debug("DEBUG: Friend request decline process initiated");
    
    console.log('Declining friend request:', requestId);
    
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      // WARNING (1x)
      log.warn("WARNING: Friend request declined from: " + request.fromUser.username);
      
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      Alert.alert('Request Declined', `Friend request from ${request.fromUser.username} declined.`);
    } else {
      // ERROR (1x)
      log.error("ERROR: Friend request to decline not found - ID: " + requestId);
    }
  };

  const handleUnfriend = (userId: string): void => {
    // DEBUG (1x)
    log.debug("DEBUG: Unfriend process started for user: " + userId);
    
    console.log('Unfriending user:', userId);
    
    const friend = friends.find(f => f.id === userId);
    if (friend) {
      // WARNING (2x)
      log.warn("WARNING: Unfriending user: " + friend.username);
      log.warn("WARNING: Removing user from friends list: " + userId);
      
      setFriends(prev => prev.filter(f => f.id !== userId));
      
      // INFO (1x)
      log.info("INFO: Successfully unfriended: " + friend.username);
      
      Alert.alert('Unfriended', `You unfriended ${friend.username}`);
    } else {
      // ERROR (1x)
      log.error("ERROR: User to unfriend not found - ID: " + userId);
    }
  };

  const handleTabChange = (tab: TabType) => {
    // DEBUG (2x)
    log.debug("DEBUG: Tab change initiated - from " + activeTab + " to " + tab);
    log.debug("DEBUG: Tab content re-render triggered");
    
    // INFO (1x)
    log.info("INFO: User navigating to " + tab + " tab");
    
    setActiveTab(tab);
    
    // Additional logs based on target tab
    switch(tab) {
      case 'myFriends':
        log.info("INFO: Displaying friends list with " + friends.length + " friends");
        break;
      case 'search':
        log.info("INFO: Opening friend search interface");
        break;
      case 'requests':
        log.info("INFO: Viewing " + friendRequests.length + " pending friend requests");
        if (friendRequests.length > 0) {
          log.warn("WARNING: " + friendRequests.length + " pending requests need attention");
        }
        break;
    }
  };

  const renderActiveTab = () => {
    // DEBUG (1x)
    log.debug("DEBUG: Rendering active tab: " + activeTab);
    
    switch (activeTab) {
      case 'myFriends':
        // INFO (1x)
        log.info("INFO: Rendering FriendsList component");
        return <FriendList friends={friends} onUnfriend={handleUnfriend} />;
      case 'search':
        // INFO (1x)
        log.info("INFO: Rendering FriendSearch component");
        return <FriendSearch onSendRequest={handleSendRequest} pendingRequests={pendingRequests} mockUsers={MOCK_USERS} />;
      case 'requests':
        // INFO (1x)
        log.info("INFO: Rendering FriendRequests component");
        return <FriendRequests requests={friendRequests} onAccept={handleAcceptRequest} onDecline={handleDeclineRequest} />;
      default:
        // ERROR (1x)
        log.error("ERROR: Unknown tab type - defaulting to myFriends");
        return <FriendList friends={friends} onUnfriend={handleUnfriend} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      
      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'myFriends' && styles.activeTab]}
          onPress={() => handleTabChange('myFriends')}
        >
          <Text style={[styles.tabText, activeTab === 'myFriends' && styles.activeTabText]}>
            My Friends
          </Text>
          {activeTab === 'myFriends' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'search' && styles.activeTab]}
          onPress={() => handleTabChange('search')}
        >
          <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
            Search
          </Text>
          {activeTab === 'search' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => handleTabChange('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests
            {friendRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{friendRequests.length}</Text>
              </View>
            )}
          </Text>
          {activeTab === 'requests' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {renderActiveTab()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {
    // Active tab styling
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    position: 'relative',
  },
  activeTabText: {
    color: '#007AFF',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#007AFF',
  },
  tabContent: {
    flex: 1,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Friends;