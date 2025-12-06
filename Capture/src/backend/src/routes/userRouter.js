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
import { getMLPerformance } from "../controllers/mlController.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ----- AUTH ROUTES -----
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/metrics/performance", getMLPerformance);

// ----- EXISTING CRUD ROUTES -----
router.get("/", getUsers);               
router.get("/:id", getUsersById); // ⚠️ This catches everything else!
router.post("/", createUser);            
router.put("/:id", updateUser);          
router.delete("/:id", deleteUser);       
router.put("/:id/avatar", upload.single("photo"), uploadAvatar);

export default router;