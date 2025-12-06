import mongoose from "mongoose";

const metricsSchema = new mongoose.Schema({
    totalCommentsChecked: { type: Number, default: 0 },
    totalBlocked: { type: Number, default: 0 },
    totalAccepted: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Metrics", metricsSchema);
