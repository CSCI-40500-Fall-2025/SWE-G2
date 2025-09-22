import express from "express";
import {getUser, createUser, updateUser, deleteUser} from "../controllers/userController.js"
const router = express.Router();

router.get("/", getUser);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete(":id", deleteUser);
 

export default router

// app.get("/api/user", (req, res) => {
//     res.status(200).send("Getting user right now");

// })

// app.post("/api/user/:id", (req, res) =>{
//     res.status(201).json({message: "user created successfully"})
// })

// app.put("/api/user/:id", (req, res) =>{
//     res.status(200).json({message: "user updated successfully"})
// })

// app.delete("/api/user/:id", (req, res) =>{
//     res.status(200).json({message: "user deleted successfully"})
// })
