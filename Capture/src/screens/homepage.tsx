import React, { useState, useEffect, useCallback } from 'react';
import { 
  Image, View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Dimensions, Platform, TextInput, RefreshControl, ActivityIndicator, 
  Alert, KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE from '../utils/api'; 

const screenWidth = Dimensions.get('window').width;

// 1. DEFAULT BLANK AVATAR
const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

// --- INTERFACES ---
interface User { _id: string; user_name: string; profilePhoto?: string; }
interface Reply { _id: string; userID: User; text: string; likes: string[]; }
interface Comment { _id: string; userID: User; text: string; likes: string[]; replies: Reply[]; }
interface Post { _id: string; userID: User; imageURL: string; description: string; dateofPost: string; comments: Comment[]; likes: string[]; }

const Homepage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [expandedPostIds, setExpandedPostIds] = useState<Set<string>>(new Set());
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ postId: string, commentId: string, username: string } | null>(null);

  const fetchPosts = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      setMyUserId(id);
      const response = await fetch(`${API_BASE}/posts`);
      const data = await response.json();
      if (Array.isArray(data)) setPosts(data);
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchPosts(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchPosts(); }, []);

  const getImageUrl = (path: string) => {
    if (!path) return DEFAULT_AVATAR; // Fallback
    if (path.startsWith('http')) return path; 
    const cleanPath = path.replace(/\\/g, '/');
    const serverRoot = API_BASE.replace(/\/api$/, ''); 
    return `${serverRoot}/${cleanPath}`;
  };

  // --- HANDLERS ---
  const handleLikePost = async (postId: string) => {
    if (!myUserId) return Alert.alert("Error", "Please login.");
    setPosts(prev => prev.map(p => p._id === postId ? {
       ...p, likes: p.likes?.includes(myUserId!) ? p.likes.filter(id => id !== myUserId) : [...(p.likes||[]), myUserId!]
    } : p));
    try {
      await fetch(`${API_BASE}/posts/${postId}/like`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userID: myUserId }) });
    } catch (e) { fetchPosts(); }
  };

  const handleLikeComment = async (postId: string, commentId: string) => {
    if (!myUserId) return;
    try {
      await fetch(`${API_BASE}/posts/${postId}/comment/${commentId}/like`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userID: myUserId }) });
      fetchPosts(); 
    } catch (e) { console.error(e); }
  };

  const handleLikeReply = async (postId: string, commentId: string, replyId: string) => {
    if (!myUserId) return;
    try {
      await fetch(`${API_BASE}/posts/${postId}/comment/${commentId}/reply/${replyId}/like`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userID: myUserId }) });
      fetchPosts(); 
    } catch (e) { console.error(e); }
  };

  const handleSubmitText = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || text.trim() === '') return;
    if (!myUserId) { Alert.alert("Error", "Login required"); return; }

    try {
      let url = `${API_BASE}/posts/${postId}/comment`;
      if (replyingTo && replyingTo.postId === postId) {
        url = `${API_BASE}/posts/${postId}/comment/${replyingTo.commentId}/reply`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: myUserId, text: text.trim() }),
      });

      const responseData = await response.json();

      if (response.ok) {
  
        fetchPosts(); 
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        setReplyingTo(null); 
      } else {

        if (response.status === 400 && responseData.message.includes("toxic")) {
          Alert.alert(
            "Whoa there!",
            "We detected that this comment might be toxic or offensive. Please keep the community friendly.",
            [{ text: "Okay, I'll be nice" }]
          );
        } else {
          Alert.alert("Error", responseData.message || "Failed to post.");
        }
      }
    } catch (error) { 
      Alert.alert('Error', 'Connection to server failed'); 
    }
  };

  const initiateReply = (postId: string, commentId: string, username: string) => {
    setReplyingTo({ postId, commentId, username });
  };

  const toggleComments = (postId: string) => {
    setExpandedPostIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId); else newSet.add(postId);
      return newSet;
    });
  };

  if (isLoading) return <ActivityIndicator size="large" style={styles.center} color="#000" />;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.headerBar}>
          <Text style={styles.appTitle}>Capture</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.feedContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {posts.map((post) => {
            const username = post.userID?.user_name || "Unknown";
            
            // 2. UPDATED LOGIC: Use DEFAULT_AVATAR if profilePhoto is missing
            const userPhoto = post.userID?.profilePhoto 
              ? getImageUrl(post.userID.profilePhoto) 
              : DEFAULT_AVATAR;

            const likes = post.likes || [];
            const isLikedByMe = myUserId && likes.includes(myUserId);
            const safeComments = post.comments || [];
            const isExpanded = expandedPostIds.has(post._id);
            const commentsToShow = isExpanded ? safeComments : safeComments.slice(0, 2);

            return (
              <View key={post._id} style={styles.postContainer}>
                {/* Header */}
                <View style={styles.postHeader}>
                  <Image source={{ uri: userPhoto }} style={styles.avatar} />
                  <Text style={styles.username}>{username}</Text>
                </View>
                <Image source={{ uri: getImageUrl(post.imageURL) }} style={styles.image} resizeMode="cover" />
                
                {/* Actions */}
                <View style={styles.actionBar}>
                  <View style={styles.actionLeft}>
                    <TouchableOpacity onPress={() => handleLikePost(post._id)}>
                      <Text style={styles.iconText}>{isLikedByMe ? "❤️" : "🤍"}</Text>
                    </TouchableOpacity>
                    <Text style={styles.likeCountText}>{likes.length} likes</Text>
                  </View>
                </View>

                {/* Caption */}
                <View style={styles.textSection}>
                  <Text style={styles.captionText}>
                    <Text style={styles.boldUser}>{username} </Text>
                    {post.description}
                  </Text>
                  <Text style={styles.dateText}>{new Date(post.dateofPost).toDateString()}</Text>

                  {/* Comments */}
                  <View style={styles.commentsList}>
                    {commentsToShow.map((c, idx) => {
                      const cName = c.userID?.user_name || "User";
                      const cLikes = c.likes || [];
                      const cIsLiked = myUserId && cLikes.includes(myUserId);

                      return (
                        <View key={idx} style={styles.commentContainer}>
                          <View style={styles.commentRowContainer}>
                            <View style={{flex: 1}}>
                              <Text style={styles.commentRow}>
                                <Text style={styles.boldUser}>{cName} </Text>
                                {c.text}
                              </Text>
                              <TouchableOpacity onPress={() => initiateReply(post._id, c._id, cName)}>
                                <Text style={styles.replyLabel}>Reply</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.likeContainer}>
                              <TouchableOpacity onPress={() => handleLikeComment(post._id, c._id)}>
                                <Text style={{fontSize: 10}}>{cIsLiked ? "❤️" : "🤍"}</Text>
                              </TouchableOpacity>
                              {cLikes.length > 0 && <Text style={styles.likeCountNum}>{cLikes.length}</Text>}
                            </View>
                          </View>

                          {/* Replies */}
                          {c.replies && c.replies.map((r, rIdx) => {
                             const rLikes = r.likes || [];
                             const rIsLiked = myUserId && rLikes.includes(myUserId);
                             return (
                               <View key={rIdx} style={styles.replyRow}>
                                  <View style={styles.replyContent}>
                                    <Text style={styles.replyTextBody}>
                                      <Text style={styles.boldUser}>{r.userID?.user_name || "User"} </Text>
                                      {r.text}
                                    </Text>
                                  </View>
                                  <View style={styles.likeContainer}>
                                    <TouchableOpacity onPress={() => handleLikeReply(post._id, c._id, r._id)}>
                                      <Text style={{fontSize: 9}}>{rIsLiked ? "❤️" : "🤍"}</Text>
                                    </TouchableOpacity>
                                    {rLikes.length > 0 && <Text style={styles.likeCountNum}>{rLikes.length}</Text>}
                                  </View>
                               </View>
                             );
                          })}
                        </View>
                      );
                    })}
                    {safeComments.length > 2 && (
                      <TouchableOpacity onPress={() => toggleComments(post._id)}>
                        <Text style={styles.showMoreText}>
                          {isExpanded ? "Hide comments" : `View all ${safeComments.length} comments`}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Input */}
                  <View style={styles.inputSection}>
                    {replyingTo && replyingTo.postId === post._id && (
                      <View style={styles.replyingBar}>
                        <Text style={styles.replyingText}>Replying to @{replyingTo.username}</Text>
                        <TouchableOpacity onPress={() => setReplyingTo(null)}><Text style={styles.cancelX}>✕</Text></TouchableOpacity>
                      </View>
                    )}
                    <View style={styles.addCommentContainer}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder={replyingTo && replyingTo.postId === post._id ? "Write a reply..." : "Add a comment..."}
                        placeholderTextColor="#999"
                        value={commentInputs[post._id] || ''}
                        onChangeText={(text) => setCommentInputs(prev => ({ ...prev, [post._id]: text }))}
                      />
                      {commentInputs[post._id]?.length > 0 && (
                        <TouchableOpacity onPress={() => handleSubmitText(post._id)}>
                          <Text style={styles.postBtnText}>Post</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                </View>
              </View>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBar: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#efefef', alignItems: 'center' },
  appTitle: { fontSize: 24, fontWeight: 'bold' },
  feedContainer: { paddingBottom: 50 },
  postContainer: { marginBottom: 20 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10, backgroundColor: '#eee' },
  username: { fontWeight: 'bold', fontSize: 14 },
  image: { width: screenWidth, height: screenWidth, backgroundColor: '#f0f0f0' },
  actionBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' },
  actionLeft: { flexDirection: 'row', alignItems: 'center' },
  iconText: { fontSize: 24 },
  likeCountText: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
  textSection: { paddingHorizontal: 12 },
  boldUser: { fontWeight: 'bold' },
  captionText: { fontSize: 14, marginBottom: 5 },
  dateText: { fontSize: 10, color: '#888', marginBottom: 10 },
  commentsList: { marginBottom: 5 },
  commentContainer: { marginBottom: 8 },
  commentRowContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  commentRow: { fontSize: 13 },
  replyLabel: { color: '#666', fontSize: 11, fontWeight: '600', marginTop: 2 },
  
  // Like Container (Shared by Comments and Replies)
  likeContainer: { 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginLeft: 10,
    minWidth: 20 
  },
  likeCountNum: { fontSize: 8, color: '#888', marginTop: 1 },

  // Reply Styles
  replyRow: { 
    marginTop: 6, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  replyContent: { 
    flex: 1, 
    marginLeft: 30, // Indent Text Only
    paddingLeft: 8, 
    borderLeftWidth: 2, 
    borderLeftColor: '#eee' 
  },
  replyTextBody: { fontSize: 12, color: '#333' },

  showMoreText: { color: '#888', fontSize: 13, marginTop: 5 },
  inputSection: { marginTop: 5 },
  addCommentContainer: { flexDirection: 'row', alignItems: 'center' },
  commentInput: { flex: 1, fontSize: 14, paddingVertical: 5 },
  postBtnText: { color: '#0095f6', fontWeight: '600', marginLeft: 10 },
  replyingBar: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f0f0f0', padding: 6, marginBottom: 4, borderRadius: 4 },
  replyingText: { fontSize: 11, color: '#555' },
  cancelX: { fontWeight: 'bold', fontSize: 12, color: '#555' },
});

export default Homepage;