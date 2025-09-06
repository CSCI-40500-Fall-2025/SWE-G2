import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AvatarSection from '../components/AvatarSection';
import PostsGrid from '../components/PostsGrid';

const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AvatarSection />
      <PostsGrid />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    paddingTop: 10, 
  },
});

export default ProfileScreen;
