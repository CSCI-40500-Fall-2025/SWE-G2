import {mongoose} from 'mongoose';
const uri = process.env.MONGO_URI;
export const connectDB = async() =>{
    try {
    // Debug log — make sure the env var is being read
    if (!uri) {
      throw new Error("❌ MONGO_URI is missing. Check your .env file.");
    }
    console.log("✅ MONGO_URI loaded from env");
    await mongoose.connect(uri);
    console.log("Connection was successful");
  } catch (error) {
    console.error("🔥 Database connection error:", error.message);
    process.exit(1); // Exit app if DB fails
  }
}
