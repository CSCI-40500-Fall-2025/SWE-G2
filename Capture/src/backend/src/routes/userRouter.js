import express from "express";
import multer from "multer";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUsersById,
  registerUser,
  loginUser,
  uploadAvatar
} from "../controllers/userController.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ----- AUTH ROUTES -----
router.post("/register", registerUser);  // POST /api/user/register
router.post("/login", loginUser);        // POST /api/user/login

// ----- EXISTING CRUD ROUTES -----
router.get("/", getUsers);               // GET /api/user
router.get("/:id", getUsersById);        // GET /api/user/:id
router.post("/", createUser);            // POST /api/user  (can reuse for admin/testing)
router.put("/:id", updateUser);          // PUT /api/user/:id
router.delete("/:id", deleteUser);       // DELETE /api/user/:id
router.put("/:id/avatar", upload.single("photo"), uploadAvatar);
export default router;
