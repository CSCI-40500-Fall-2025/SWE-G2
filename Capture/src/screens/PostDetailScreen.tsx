import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, Dimensions, Platform, Alert, KeyboardAvoidingView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import API_BASE from '../utils/api'; 

const screenWidth = Dimensions.get('window').width;

const PostDetailScreen: React.FC = ({ route }: any) => {
  const { post: initialPost } = route.params;
  const navigation = useNavigation();

  const [post, setPost] = useState(initialPost);
  const [commentText, setCommentText] = useState('');
  const [myUserId, setMyUserId] = useState<string | null>(null);
  
  // Track Reply Mode
  const [replyingTo, setReplyingTo] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('userId').then(setMyUserId);
    refreshPostData(); 
  }, []);

  const getImageUrl = (path: string) => {
    if (!path) return 'https://via.placeholder.com/400';
    if (path.startsWith('http')) return path; 
    const cleanPath = path.replace(/\\/g, '/');
    const serverRoot = API_BASE.replace(/\/api$/, ''); 
    return `${serverRoot}/${cleanPath}`;
  };

  const refreshPostData = async () => {
    try {
      const response = await fetch(`${API_BASE}/posts`); 
      const allPosts = await response.json();
      const updatedPost = allPosts.find((p: any) => p._id === post._id);
      if (updatedPost) setPost(updatedPost);
    } catch (e) { console.error(e); }
  };

  // --- LIKE HANDLERS ---

  const handleLikePost = async () => {
    if (!myUserId) return Alert.alert("Error", "Please login.");
    try {
      await fetch(`${API_BASE}/posts/${post._id}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: myUserId }),
      });
      refreshPostData();
    } catch (e) { console.error(e); }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!myUserId) return;
    try {
      await fetch(`${API_BASE}/posts/${post._id}/comment/${commentId}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: myUserId }),
      });
      refreshPostData();
    } catch (e) { console.error(e); }
  };

  // 🔴 NEW: Reply Like Handler
  const handleLikeReply = async (commentId: string, replyId: string) => {
    if (!myUserId) return;
    try {
      await fetch(`${API_BASE}/posts/${post._id}/comment/${commentId}/reply/${replyId}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: myUserId }),
      });
      refreshPostData();
    } catch (e) { console.error(e); }
  };

  // --- SUBMISSION ---

  const handleSubmit = async () => {
    if (!commentText.trim() || !myUserId) return;

    try {
      let url = `${API_BASE}/posts/${post._id}/comment`;
      if (replyingTo) {
        url = `${API_BASE}/posts/${post._id}/comment/${replyingTo.id}/reply`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: myUserId, text: commentText.trim() }),
      });

      if (response.ok) {
        refreshPostData();
        setCommentText('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const username = post.userID?.user_name || "Unknown";
  const userPhoto = post.userID?.profilePhoto ? getImageUrl(post.userID.profilePhoto) : 'https://i.pravatar.cc/150';
  const isPostLiked = myUserId && post.likes?.includes(myUserId);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      
      {/* Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text> 
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={{width: 30}} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
          
          <View style={styles.userHeader}>
            <Image source={{ uri: userPhoto }} style={styles.avatar} />
            <Text style={styles.username}>{username}</Text>
          </View>

          <Image source={{ uri: getImageUrl(post.imageURL) }} style={styles.image} resizeMode="cover" />

          <View style={styles.actionBar}>
            <TouchableOpacity onPress={handleLikePost}>
              <Text style={styles.iconText}>{isPostLiked ? "❤️" : "🤍"}</Text>
            </TouchableOpacity>
            <Text style={styles.likeCount}>{post.likes?.length || 0} likes</Text>
          </View>

          <View style={styles.details}>
            <Text style={styles.caption}>
              <Text style={styles.bold}>{username} </Text>
              {post.description}
            </Text>
            <Text style={styles.date}>{new Date(post.dateofPost).toDateString()}</Text>

            {/* --- COMMENTS SECTION --- */}
            <View style={styles.commentsSection}>
              {post.comments && post.comments.map((c: any, i: number) => {
                 const cName = c.userID?.user_name || "User";
                 const cLikes = c.likes || [];
                 const cIsLiked = myUserId && cLikes.includes(myUserId);

                 return (
                  <View key={i} style={styles.commentContainer}>
                    {/* Main Comment */}
                    <View style={styles.commentRow}>
                      <View style={{flex: 1}}>
                        <Text>
                          <Text style={styles.bold}>{cName} </Text>
                          {c.text}
                        </Text>
                        <TouchableOpacity onPress={() => setReplyingTo({ id: c._id, name: cName })}>
                          <Text style={styles.replyText}>Reply</Text>
                        </TouchableOpacity>
                      </View>
                      
                      {/* Comment Like */}
                      <View style={styles.heartContainer}>
                         <TouchableOpacity onPress={() => handleLikeComment(c._id)}>
                            <Text style={{fontSize: 12}}>{cIsLiked ? "❤️" : "🤍"}</Text>
                         </TouchableOpacity>
                         <Text style={styles.smallCount}>{cLikes.length}</Text>
                      </View>
                    </View>

                    {/* --- REPLIES --- */}
                    {c.replies && c.replies.map((r: any, rIdx: number) => {
                      const rLikes = r.likes || [];
                      const rIsLiked = myUserId && rLikes.includes(myUserId);

                      return (
                        <View key={rIdx} style={styles.replyRow}>
                           <View style={{flex: 1}}>
                             <Text style={styles.replyTextBody}>
                               <Text style={styles.bold}>{r.userID?.user_name || "User"} </Text>
                               {r.text}
                             </Text>
                           </View>

                           {/* 🔴 NEW: Reply Like UI */}
                           <View style={styles.replyHeartContainer}>
                              <TouchableOpacity onPress={() => handleLikeReply(c._id, r._id)}>
                                <Text style={{fontSize: 10}}>{rIsLiked ? "❤️" : "🤍"}</Text>
                              </TouchableOpacity>
                              {/* Only show count if > 0 */}
                              {rLikes.length > 0 && (
                                <Text style={styles.replySmallCount}>{rLikes.length}</Text>
                              )}
                           </View>
                        </View>
                      );
                    })}
                  </View>
                 );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          {replyingTo && (
            <View style={styles.replyingToBar}>
              <Text style={styles.replyingText}>Replying to @{replyingTo.name}</Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Text style={styles.cancelReply}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.inputRow}>
            <TextInput 
              style={styles.input} 
              placeholder={replyingTo ? `Reply to ${replyingTo.name}...` : "Add a comment..."}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.postBtn}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { padding: 5 },
  backIcon: { fontSize: 26, fontWeight: 'bold' },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  userHeader: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatar: { width: 30, height: 30, borderRadius: 15, marginRight: 10, backgroundColor: '#eee' },
  username: { fontWeight: 'bold' },
  image: { width: screenWidth, height: screenWidth },
  actionBar: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  iconText: { fontSize: 24 },
  likeCount: { marginLeft: 8, fontWeight: '600' },
  details: { paddingHorizontal: 12 },
  caption: { fontSize: 14, marginBottom: 5 },
  bold: { fontWeight: 'bold' },
  date: { color: '#888', fontSize: 12, marginBottom: 15 },
  
  commentsSection: { marginTop: 10 },
  commentContainer: { marginBottom: 15 },
  commentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heartContainer: { alignItems: 'center', marginLeft: 10 },
  smallCount: { fontSize: 9, color: '#888' },
  replyText: { color: '#888', fontSize: 12, marginTop: 4, fontWeight: '600' },

  // Reply Styles
  replyRow: { marginLeft: 40, marginTop: 5, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#eee', flexDirection: 'row', justifyContent: 'space-between' },
  replyTextBody: { fontSize: 13 },
  replyHeartContainer: { alignItems: 'center', marginLeft: 8 }, // Added container for reply heart
  replySmallCount: { fontSize: 8, color: '#888' }, // Smaller text for reply likes

  inputContainer: { borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  inputRow: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  input: { flex: 1, height: 40, backgroundColor: '#f9f9f9', borderRadius: 20, paddingHorizontal: 15 },
  postBtn: { color: '#0095f6', fontWeight: 'bold', marginLeft: 10 },
  replyingToBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, backgroundColor: '#f0f0f0' },
  replyingText: { color: '#666', fontSize: 12 },
  cancelReply: { color: '#666', fontWeight: 'bold' },
});

export default PostDetailScreen;