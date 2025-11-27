import Post from "../models/Post.js";

// CREATE POST
export const createPost = async (req, res) => {
    try {
      // 1. Check if the file was actually uploaded by Multer
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided." });
      }
  
      // 2. Map the file path to 'imageURL'
      // 'req.file.path' is where Multer saved the image (e.g., "uploads/1709...jpg")
      const newPostData = {
        ...req.body,           // Spreads description, visibility, userID
        imageURL: req.file.path // Fulfills the "required" schema field
      };
  
      // 3. Create and Save
      const newPost = new Post(newPostData);
      const savedPost = await newPost.save();
  
      res.status(201).json(savedPost);
    } catch (error) {
      console.error("Error creating post:", error); // See exact error in terminal
      res.status(500).json({ message: error.message });
    }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ dateofPost: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ error: "Failed to fetch posts" });
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
