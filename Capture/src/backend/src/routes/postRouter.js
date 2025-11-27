import express from "express";
import multer from "multer";
import fs from "fs";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
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

export default router;
