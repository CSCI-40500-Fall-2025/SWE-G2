import React from 'react';
//import {Modal, Image, View, Text, Button, StyleSheet, ScrollView} from 'react-native';
import FriendList from '../components/FriendList';
//import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaView, View, Text, Image, FlatList, StyleSheet,ScrollView,Button} from 'react-native';

const Friends: React.FC = () => {
  const friends = [
  new FriendList('Spongebob', Image.resolveAssetSource(require('../assets/spongebob.jpg')).uri),
  new FriendList('Mr. Krabs',Image.resolveAssetSource(require('../assets/Mr.krabs.webp')).uri),
  new FriendList('Flats the Flounder',Image.resolveAssetSource(require('../assets/Flats_the_flounder.webp')).uri),
  new FriendList('Bubble Bass',Image.resolveAssetSource(require('../assets/Bubble_bass.webp')).uri),
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.title}>Friends</Text>
        {friends.map((f, i) => (
          <View key={i} style={styles.row}>
            <Image source={{uri: f.imageURL}} style={styles.avatar} />
            <Text style={styles.username}>{f.username}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );

};


const styles = StyleSheet.create({

  title: {
    fontSize: 22,          // size
    fontWeight: '700',     // weight: '400' | '700' | 'normal' | 'bold'
    color: '#111827',      // color
    letterSpacing: 0.3,    // optional
    lineHeight: 26,        // optional
    // fontFamily: 'Poppins-SemiBold', // set this after adding a custom font
  },

  list: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    flexShrink: 1,
  },




});


export default Friends;

//<Image source={uri: f.image} style={styles.avatar} />            <Image source={f.image} style={styles.avatar} />