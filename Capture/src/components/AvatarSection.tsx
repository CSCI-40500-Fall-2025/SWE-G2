import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import API_BASE from '../utils/api';

// 1. A clean, blank default avatar (Hosted URL)
// You can also use require('../assets/default-avatar.png') if you have a local file
const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const AvatarSection: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (!id) return;
      const response = await fetch(`${API_BASE}/user/${id}`); 
      const data = await response.json();
      setUser(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 2. HANDLE IMAGE PICK & UPLOAD
  const handleUpdateAvatar = async () => {
    try {
      // Open Gallery
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      });

      if (result.didCancel || !result.assets?.[0]) return;

      const asset = result.assets[0];
      uploadToBackend(asset);

    } catch (error) {
      Alert.alert("Error", "Could not open gallery");
    }
  };

  const uploadToBackend = async (asset: any) => {
    if (!user?._id) return;
    setUploading(true);

    try {
      const form = new FormData();
      
      form.append('photo', {
        uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
        name: asset.fileName || `avatar_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
      } as any);

      const response = await fetch(`${API_BASE}/user/${user._id}/avatar`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          // Content-Type is automatic with FormData
        },
        body: form,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser); // Update UI instantly
        Alert.alert("Success", "Profile picture updated!");
      } else {
        Alert.alert("Error", "Failed to upload image");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{marginTop: 20}} />;

  // 3. LOGIC: Determine which image to show
  const username = user?.user_name || "User";
  const bio = user?.bio || "No bio yet."; 
  
  let imageSource;
  if (user?.profilePhoto) {
    // If user has a photo, fix the URL (remove /api if needed)
    const cleanPath = user.profilePhoto.replace(/\\/g, '/');
    const serverRoot = API_BASE.replace(/\/api$/, '');
    imageSource = { uri: `${serverRoot}/${cleanPath}` };
  } else {
    // If no photo, use default
    imageSource = { uri: DEFAULT_AVATAR };
  }

  return (
    <View style={styles.container}>
      
      {/* 4. WRAP IMAGE IN TOUCHABLE */}
      <TouchableOpacity onPress={handleUpdateAvatar} disabled={uploading}>
        <View style={styles.avatarContainer}>
          <Image source={imageSource} style={styles.avatar} />
          
          {/* Optional: Show loading spinner over image while uploading */}
          {uploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
          
          {/* Optional: Little "Edit" badge */}
          {!uploading && (
            <View style={styles.editBadge}>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Text style={styles.username}>@{username}</Text>
      <Text style={styles.bio}>{bio}</Text>
      
      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  
  // Avatar Styling
  avatarContainer: { position: 'relative', marginBottom: 10 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#eee', borderWidth: 1, borderColor: '#ddd' },
  
  // Edit Badge
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0095f6',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  editIcon: { fontSize: 12 },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },

  username: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  bio: { color: '#666', marginBottom: 15 },
  statsContainer: { flexDirection: 'row', width: '80%', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontWeight: 'bold', fontSize: 16 },
  statLabel: { color: '#888', fontSize: 12 },
});

export default AvatarSection;