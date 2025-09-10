import React from 'react';
import { FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Number of columns
const NUM_COLUMNS = 3;

// Size of each image
const IMAGE_SIZE = SCREEN_WIDTH / NUM_COLUMNS;

// dummy images to fill the screen
const NUM_ROWS = 12; // adjust for taller screens if needed
const dummyPosts = Array.from({ length: NUM_COLUMNS * NUM_ROWS }, (_, i) => ({
  id: i.toString(),
  image: `https://picsum.photos/200?${i + 1}`,
}));

const PostsGrid: React.FC = () => {
  const renderPost = ({ item }: { item: { id: string; image: string } }) => (
    <Image source={{ uri: item.image }} style={styles.postImage} />
  );

  return (
    <FlatList
      data={dummyPosts}
      keyExtractor={(item) => item.id}
      numColumns={NUM_COLUMNS}
      renderItem={renderPost}
      scrollEnabled={true} // allow scrolling if content is bigger than screen
    />
  );
};

const styles = StyleSheet.create({
  postImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderWidth: 0.5,
    borderColor: '#fff',
  },
});

export default PostsGrid;
