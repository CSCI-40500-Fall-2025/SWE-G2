// src/components/AvatarSection.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const AvatarSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://picsum.photos/100' }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.username}>@username</Text>
        <Text style={styles.bio}>This is bio section.</Text>
        <Text style={styles.stats}>number of Posts  •  number or Followers  •  number of Following</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  info: { flex: 1, marginLeft: 15 },
  username: { fontSize: 20, fontWeight: 'bold' },
  bio: { marginTop: 5, color: '#666' },
  stats: { marginTop: 10, fontWeight: 'bold' },
});

export default AvatarSection;
