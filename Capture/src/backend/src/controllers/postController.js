import Post from "../models/post.js";


export const createPost = async (req, res) => {
    try {
        console.log("🔥 CREATE POST REQUEST BODY:", req.body);
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided." });
        }
      
      const { description, visibility, userID } = req.body;
  
        console.log("CREATING POST FOR USER ID:", userID); 
        const newPost = new Post({
        userID: userID,
        description: description,
        visibility: visibility || 'public',
        imageURL: req.file.path, 
    });
        console.log("🕵️ SPY 5 [Backend]: Post Object to Save:", newPost);
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {

      const posts = await Post.find()
        .populate("userID", "user_name profilePhoto") 
        .populate("comments.userID", "user_name")
        .populate("comments.replies.userID", "user_name")
        .sort({ createdAt: -1 });

      res.status(200).json(posts); 
    } catch (err) {
      console.error("getPosts Error:", err);

      res.status(500).json({ message: "Server Error" });
    }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

export const addComment = async (req, res) => {
    try {
      const { id } = req.params; // Post ID
      const { userID, text } = req.body; // Comment data
  
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          $push: { comments: { userID, text } }, // MongoDB $push command
        },
        { new: true } // Return the updated post so we can show it immediately
      );
  
      if (!updatedPost) return res.status(404).json({ message: "Post not found" });
  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params; 
        const { userID } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                $pull: { 
                comments: { 
                _id: commentId, 
                userID: userID //only delete if this user owns the comment
            } 
        }
    },
    { new: true }
    );

    if (!updatedPost) {
    return res.status(404).json({ message: "Post not found or unauthorized" });
    }

    res.status(200).json(updatedPost);
} catch (err) {
    res.status(500).json({ message: err.message });
}
};
// UPDATE POST
export const updatePost = async (req, res) => {
    try {
        const updates = { ...req.body };

        if (req.file) {
            updates.imageURL = `/uploads/${req.file.filename}`;
        }

        const post = await Post.findByIdAndUpdate(req.params.id, updates, {
            new: true,
        });

        if (!post) return res.status(404).json({ error: "Post not found" });

        res.json(post);
    } catch {
        res.status(500).json({ error: "Failed to update post" });
    }
    };

// DELETE POST
export const deletePost = async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);

        if (!deleted) return res.status(404).json({ error: "Post not found" });

        res.json({ message: "Post deleted" });
    } catch {
        res.status(500).json({ error: "Failed to delete post" });
    }
    };
//toggle Like on a post
export const togglePostLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { userID } = req.body;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

            const index = post.likes.indexOf(userID);
        
        if (index === -1) {
            post.likes.push(userID);
        } else {
            post.likes.splice(index, 1);
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };
  
//toggle Like on a comment
export const toggleCommentLike = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const { userID } = req.body;

        console.log(`❤️ DEBUG: Toggling Like | Post: ${id} | Comment: ${commentId} | User: ${userID}`);

        const post = await Post.findById(id);
        if (!post) {
            console.error("❌ Post not found");
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.find(c => c._id.toString() === commentId);
        
        if (!comment) {
            console.error("❌ Comment not found inside post");
            return res.status(404).json({ message: "Comment not found" });
        }
        if (!comment.likes) {
            comment.likes = [];
        }

        const index = comment.likes.indexOf(userID);
        if (index === -1) {
            comment.likes.push(userID);
            console.log("✅ Like Added");
        } else {
            comment.likes.splice(index, 1);
            console.log("✅ Like Removed");
        }

        post.markModified('comments');

        await post.save();
        res.status(200).json(post); 

    } catch (err) {
        console.error("❌ BACKEND CRASH:", err);
        res.status(500).json({ message: err.message });
    }
};
export const addReply = async (req, res) => {
    try {
      const { id, commentId } = req.params; 
      const { userID, text } = req.body;
  
      console.log(`↩️ ADDING REPLY | Post: ${id} | Comment: ${commentId} | User: ${userID}`);
  
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      const comment = post.comments.find(c => c._id.toString() === commentId);
      if (!comment) {
        console.error("❌ Comment not found");
        return res.status(404).json({ message: "Comment not found" });
      }

      comment.replies.push({
        userID: userID,
        text: text
      });
  
      await post.save();
      console.log("✅ Reply Saved");
      
      const populatedPost = await Post.findById(id)
        .populate("userID", "user_name profilePhoto")
        .populate("comments.userID", "user_name")
        .populate("comments.replies.userID", "user_name");
  
      res.status(200).json(populatedPost);
  
    } catch (err) {
      console.error("❌ REPLY ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  };
export const toggleReplyLike = async (req, res) => {
    try {
        const { id, commentId, replyId } = req.params;
        const { userID } = req.body;
  
        console.log(`❤️ Toggling Reply Like | Reply: ${replyId} | User: ${userID}`);
  
        const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
  
        const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

        const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });
  
    if (!reply.likes) reply.likes = [];

      const index = reply.likes.indexOf(userID);
    if (index === -1) {
        reply.likes.push(userID);
    } else {
        reply.likes.splice(index, 1);
      }
        post.markModified('comments'); 
        await post.save();

        res.status(200).json(post);
    } catch (err) {
      console.error("Reply Like Error:", err);
      res.status(500).json({ message: err.message });
    }
};