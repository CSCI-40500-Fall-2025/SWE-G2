import User from '../models/user.js'

export async function getUsers(req,res){
    try {
        const user = await User.find();
        // const user = await User.find.sort({createdAt: -1}) //sorted by newest to oldest
        //^This could be useful for recent friends/post/etc, Have this in mind
        res.status(200).json(user);
    } catch (error) {
        console.error("Error: in getUsers method", error);
        res.status(500).json({message: "Internal server error"})

    }
}

export async function getUsersById(req, res){
    try {
        const user = await User.findById(req.params.id);
        if(!user) res.status(404).json({message: "User is not found"})
        res.json(user);
    } catch (error) {
        console.error("Error: in getUsersById method", error);
        res.status(500).json({message: "Internal server error"})

    }
}

export async function createUser(req,res){
    try {
        const {name, user_name, email, password} = req.body;
        const newUser = new User({name, user_name, email, password});

        await newUser.save();
        res.status(201).json({message: "User was created successfully"})
    } catch (error) {
        console.error("Error: in createUser method", error);
        res.status(500).json({message: "Internal server error"})
    }
}

export async function updateUser(req,res) {
    try {
        const {name, user_name, email, password} = req.body;
        const updateuser =  await User.findByIdAndUpdate(req.params.id,{name, user_name, email, password}, {
            new: true,
        });
        if(!updateuser){
            return res.status("404").json({message: "User not found"});
        }
        res.status(200).json({message: "User has been updated!"})

    } catch (error) {
        console.error("Error: in updateUser method", error);
        res.status(500).json({message: "Internal server error"})
    }
}

export async function deleteUser(req,res) {
    try {
        const del = await User.findByIdAndDelete(req.params.id);
        if(!del) return res.status("404").json({message: "User not found"});
        res.status(200).json({message: "Deletion have been successful   "})
    } catch (error) {
        console.error("Error: in deleteUser method", error);
        res.status(500).json({message: "Internal server error"})
    }
}