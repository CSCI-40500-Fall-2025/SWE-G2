export default class UserPosts { //simple class to hold user posts data
    userID: string;
    dateofPost: Date;
    imageURL: string
    description: string
    constructor(userID: string, dateofPost: Date, imageURL: string, description: string) {
        this.userID = userID;
        this.dateofPost = dateofPost;
        this.imageURL = imageURL;
        this.description = description;
    }
}


//test for user data pop up link
// const UserPostPopup: React.FC<UserPostPopupProps> = ({ visible, onClose, post }) => {
//   if (!post) return null; //if no post data, render nothing

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalBackground}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.title}>Post Details</Text>
//           <Text>User ID: {post.userID}</Text>
//           <Text>Date: {post.dateofPost.toDateString()}</Text>
//           <Text>Description: {post.description}</Text>
//           {/* In a real app, you would use an Image component to display the image */}
//           <Button title="Close" onPress={onClose} />
//         </View>
//       </View>
//     </Modal>
//   );
// };
