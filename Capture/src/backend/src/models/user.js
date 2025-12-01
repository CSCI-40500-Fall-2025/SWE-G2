import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
      unique: true,      //unique usernames
    },
    email: {
      type: String,
      required: true,
      unique: true,      //unique emails
    },
    // This will store the **bcrypt hash**, not the raw password
    password: {
      type: String,
      required: true,
    },
    profilePhoto: { 
      type: String, 
      default: "" 
    }
  },
  { timestamps: true }   // adds createdAt/updatedAt
);

const User = mongoose.model("Users", userSchema);

export default User;
