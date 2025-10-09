import React from 'react';
import { Image, View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import UserPosts from '../components/UserPosts';
import { SafeAreaView } from 'react-native-safe-area-context';


const screenWidth = Dimensions.get('window').width;

const Homepage: React.FC = () => {
  const posts = [
    new UserPosts(
      'FroakieNumber1Fan',
      new Date(),
      Image.resolveAssetSource(require('../assets/froakie.webp')).uri,
      'Look what I caught bro',
      'https://i.pravatar.cc/150?img=15'
    ),
    new UserPosts(
      'DigletInYoBooty',
      new Date(2024, 6, 7),
'https://static.wikia.nocookie.net/ficspecies/images/7/7a/Diglett.png/revision/latest?cb=20190806222311',      'Me when the gang pull up',
      'https://i.pravatar.cc/150?img=22'
    ),
    new UserPosts(
      'MouseholdTheHousehold',
      new Date(2022, 11, 1),
'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2022/11/maushold.jpg',      'Too many mouthes to feed',
      'https://i.pravatar.cc/150?img=4'
    ),
  ];

  const handleProfilePress = () => {
    // 👇 later, navigate to EditProfile or Profile screen
    console.log("Profile icon pressed!");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER BAR --- */}
      <View style={styles.headerBar}>
        <Text style={styles.appTitle}>Capture</Text>

        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={{ uri: 'https://picsum.photos/100' }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      {/* --- FEED --- */}
      <ScrollView
        contentContainerStyle={styles.feedContainer}
        showsVerticalScrollIndicator={false}
      >
        {posts.map((post, idx) => (
          <View key={idx} style={styles.postContainer}>
            {/* Header */}
            <View style={styles.postHeader}>
              <Image source={{ uri: post.profilePhotoURL }} style={styles.avatar} />
              <View style={styles.userMeta}>
                <Text style={styles.username}>{post.userID}</Text>
                <Text style={styles.date}>{post.dateofPost.toDateString()}</Text>
              </View>
            </View>

            {/* Post image */}
            <Image source={{ uri: post.imageURL }} style={styles.image} />

            {/* Caption */}
            <Text style={styles.description}>{post.description}</Text>

            {/* Divider */}
            {idx !== posts.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  appTitle: {
    fontSize: 28,
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Avenir-Heavy',
      android: 'sans-serif-medium',
    }),
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
  },


  // --- Feed / posts ---
  feedContainer: {
    paddingBottom: 40,
  },
  postContainer: {
    width: screenWidth,
    backgroundColor: '#fff',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ddd',
  },
  userMeta: {
    marginLeft: 10,
  },
  username: {
    fontWeight: '700',
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: '#eee',
  },
  description: {
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
  },
});

export default Homepage;
