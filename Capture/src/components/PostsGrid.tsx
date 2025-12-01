import React, { useState, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Dimensions, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import API_BASE from '../utils/api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const NUM_COLUMNS = 3;
const IMAGE_SIZE = SCREEN_WIDTH / NUM_COLUMNS;

// ... interface Post ... (Keep existing interface)
interface Post {
  _id: string;
  imageURL: string;
  userID: { _id: string } | string | null;
}

const PostsGrid: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>(); // <--- 2. HOOK

  useEffect(() => { fetchMyPosts(); }, []);

  const fetchMyPosts = async () => {
    // ... (Keep your existing fetch logic exactly the same) ...
    try {
      const myId = await AsyncStorage.getItem('userId');
      if (!myId) return;
      const response = await fetch(`${API_BASE}/posts`);
      const allPosts = await response.json();
      if (Array.isArray(allPosts)) {
        const myPosts = allPosts.filter((post: Post) => {
          if (!post.userID) return false;
          const postUserId = typeof post.userID === 'object' ? post.userID._id : post.userID;
          return postUserId === myId;
        });
        setPosts(myPosts.reverse());
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const getImageUrl = (path: string) => {
    if (!path) return 'https://via.placeholder.com/200';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    const serverRoot = API_BASE.replace(/\/api$/, '');
    return `${serverRoot}/${cleanPath}`;
  };

  const renderPost = ({ item }: { item: Post }) => (
    // 3. WRAP IN TOUCHABLE & NAVIGATE
    <TouchableOpacity 
      style={styles.imageContainer}
      onPress={() => navigation.navigate('PostDetail', { post: item })} // Pass post data
    >
      <Image 
        source={{ uri: getImageUrl(item.imageURL) }} 
        style={styles.postImage} 
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{marginTop: 20}} />;

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item._id}
      numColumns={NUM_COLUMNS}
      renderItem={renderPost}
      ListEmptyComponent={<Text style={styles.emptyText}>No posts yet.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderWidth: 1,
    borderColor: '#fff',
  },
  postImage: { width: '100%', height: '100%' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#888' },
});

export default PostsGrid;