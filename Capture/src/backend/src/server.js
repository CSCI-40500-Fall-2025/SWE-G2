import userRouter from "./routes/userRouter.js";
import express from "express";

const app = express();
const PORT = process.env.PORT || 5001;
//this is an endpoint
//first param is the the route, the second it leads to the router page
app.use("/api/user", userRouter)
//We make for post, profile, stc

app.listen(PORT , ()=>{
    console.log("Server started at PORT: ", PORT);
})