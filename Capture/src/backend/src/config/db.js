import mongoose from 'mongoose';
export const connectDB = async() =>{
    try {
    // Debug log — make sure the env var is being read
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is missing. Check your .env file.");
    }
    console.log("✅ MONGO_URI loaded from env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection was successful");
  } catch (error) {
    console.error("🔥 Database connection error:", error.message);
    process.exit(1); // Exit app if DB fails
  }
}
