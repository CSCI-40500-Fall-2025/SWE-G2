import mongoose from "mongoose";

const flaggedLogSchema = new mongoose.Schema({
    originalText: { type: String, required: true },
    score: { type: Number, required: true },
    reason: { type: String, default: "TOXICITY_THRESHOLD_EXCEEDED" },
}, { timestamps: true });

flaggedLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model("FlaggedLog", flaggedLogSchema);