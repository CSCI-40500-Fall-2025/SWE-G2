import express from "express";
import multer from "multer";
import fs from "fs";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment, 
  deleteComment,
  togglePostLike,
  toggleCommentLike,
  addReply,
  toggleReplyLike
} from "../controllers/postController.js";

const router = express.Router();

// Setup Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }   
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// CRUD ROUTES
router.post("/", upload.single("photo"), createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", upload.single("photo"), updatePost);
router.delete("/:id", deletePost);
router.post("/:id/comment", addComment);
router.delete("/:id/comment/:commentId", deleteComment);
router.put("/:id/like", togglePostLike);
router.put("/:id/comment/:commentId/like", toggleCommentLike);
router.post("/:id/comment/:commentId/reply", addReply);
router.put("/:id/comment/:commentId/reply/:replyId/like", toggleReplyLike);
export default router;
