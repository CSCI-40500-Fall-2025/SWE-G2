import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", 
      required: true,
    },
    dateofPost: { type: Date, default: Date.now },
    imageURL: { type: String, required: true },
    description: { type: String, required: true },
    profilePhotoURL: { type: String, required: false },
    visibility: {
      type: String,
      enum: ["public", "shared", "private"],
      default: "public",
    },
    
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
    ],

    comments: [
        {
          userID: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
          text: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
          likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
          replies: [
            {
              userID: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
              text: { type: String, required: true },
              createdAt: { type: Date, default: Date.now },
              likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }]
            }
          ]
        },
      ],
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;