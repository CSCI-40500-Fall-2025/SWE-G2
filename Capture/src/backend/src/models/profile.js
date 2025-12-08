import mongoose from "mongoose";

const profileShema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users", 
            required: true,
        },
        userImgUrl: { type: String, required: true },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }],
        numFollowers:{
            type: Number,
            default: function(){
                return this.followers.length;
            }
        },
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }],
        numFollowing: {
            type: Number,
            default: function(){
                return this.following.length;
            }
        },
        posts: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Posts" }
        ],
        numPost: {
            type: Number,
            default: function () {
                return this.posts.length;
            }
        },
        isPrivate: {
            type: Boolean,
            //false meaning its not
            default: false
        }
    }
)

const Profile = mongoose.model("Profile", profileShema);

export default Profile;
