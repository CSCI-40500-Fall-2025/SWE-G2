import mongoose from "mongoose";

const passedLogSchema = new mongoose.Schema({
    originalText: { type: String, required: true },
    score: { type: Number, required: true },
}, { timestamps: true });

passedLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.model("PassedLog", passedLogSchema);