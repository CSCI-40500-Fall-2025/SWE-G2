import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    //Attributes/Feilds
    name: {
        type: String,
        required: true
    },
    user_name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("Users", userSchema);

export default User;