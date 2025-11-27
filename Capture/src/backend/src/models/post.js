import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dateofPost: {
      type: Date,
      default: Date.now,
    },

    imageURL: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    profilePhotoURL: {
      type: String,
      required: false,
    },

    visibility: {
      type: String,
      enum: ["public", "shared", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
