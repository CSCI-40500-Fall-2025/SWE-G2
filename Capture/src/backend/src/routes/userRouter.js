import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUsersById,
  registerUser,
  loginUser,
} from "../controllers/userController.js";

const router = express.Router();

// ----- AUTH ROUTES -----
router.post("/register", registerUser);  // POST /api/user/register
router.post("/login", loginUser);        // POST /api/user/login

// ----- EXISTING CRUD ROUTES -----
router.get("/", getUsers);               // GET /api/user
router.get("/:id", getUsersById);        // GET /api/user/:id
router.post("/", createUser);            // POST /api/user  (can reuse for admin/testing)
router.put("/:id", updateUser);          // PUT /api/user/:id
router.delete("/:id", deleteUser);       // DELETE /api/user/:id

export default router;
