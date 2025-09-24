import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
//this is an endpoint

connectDB();

//middleare
app.use(express.json())

//first param is the the route, the second it leads to the router page
app.use("/api/user", userRouter)
//We make for post, profile, stc

app.listen(PORT , ()=>{
    console.log("Server started at PORT: ", PORT);
})