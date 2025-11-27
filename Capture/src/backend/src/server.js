import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
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
app.use("/api/posts", postRouter);

//We make for post, profile, stc

app.listen(PORT , ()=>{
    console.log("Server started at PORT: ", PORT);
})

//Make sure to add a .env file in the same src folder with the following:
//MONGO_URI=your_mongo_db_connection_string
//PORT=5001 (or whatever port you want)
