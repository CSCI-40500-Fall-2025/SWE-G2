// controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET /api/user
export async function getUsers(req, res) {
  try {
    // don't leak password hashes
    const users = await User.find().select("-password");
    // const users = await User.find().sort({ createdAt: -1 }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error: in getUsers method", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/user/:id
export async function getUsersById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error: in getUsersById method", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/user  (generic create)
// For simplicity, we reuse the register logic here:
export async function createUser(req, res) {
  return registerUser(req, res);
}

// PUT /api/user/:id
export async function updateUser(req, res) {
  try {
    const { name, user_name, email, password } = req.body;

    const updateFields = { name, user_name, email };

    // If password is provided, hash it before updating
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User has been updated!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error: in updateUser method", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /api/user/:id
export async function deleteUser(req, res) {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Deletion has been successful" });
  } catch (error) {
    console.error("Error: in deleteUser method", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// =============== AUTH-SPECIFIC CONTROLLERS ===============

// POST /api/user/register
export async function registerUser(req, res) {
  try {
    const { name, user_name, email, password } = req.body;

    if (!user_name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields (user_name, email, password)" });
    }

    // If name not sent from frontend, we can default to user_name
    const finalName = name || user_name;

    // Check if email or username already exists
    const existing = await User.findOne({
      $or: [{ email }, { user_name }],
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Email or username already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: finalName,
      user_name,
      email,
      password: hashedPassword, // IMPORTANT: store hash, not plain text
    });

    return res.status(201).json({
      message: "User was created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        user_name: newUser.user_name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error: in registerUser method", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/user/login
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body; // we can add username login later if needed

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    // Later: generate JWT here.
    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        user_name: user.user_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error: in loginUser method", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
