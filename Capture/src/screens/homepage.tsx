import React from 'react';
import {Modal, Image, View, Text, Button, StyleSheet, ScrollView} from 'react-native';
import UserPosts from '../components/UserPosts';
import { SafeAreaView } from 'react-native-safe-area-context';

type UserPostPopupProps = { 
  visible: boolean; //controls visibility of the modal
  onClose: () => void; //function to close the modal
  post: UserPosts | null; //the user post data to display
};


const Homepage: React.FC = () => {
    const posts = [
    new UserPosts('FroakieNumber1Fan', new Date(), Image.resolveAssetSource(require('../assets/froakie.webp')).uri, 'Look what I caught bro'), // Example local image 
    new UserPosts('DigginYoButtTwin', new Date(2024, 6, 7), 'https://static.wikia.nocookie.net/ficspecies/images/7/7a/Diglett.png/revision/latest?cb=20190806222311', 'Me when the gang pull up'),
    new UserPosts('MouseYN', new Date(2022, 11, 1), 'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2022/11/maushold.jpg', 'Too many mouthes to feed'),
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.feedContainer}>
        {posts.map((post, idx) => (
          <View key={idx} style={styles.card}>
            <Image source={{ uri: post.imageURL }} style={styles.image} />
            <Text style={styles.username}>{post.userID}</Text>
            <Text style={styles.date}>{post.dateofPost.toDateString()}</Text>
            <Text style={styles.description}>{post.description}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};




const styles = StyleSheet.create({
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContainer: {
//     width: '80%',
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
    feedContainer: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Homepage;