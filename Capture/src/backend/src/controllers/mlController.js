import Metrics from "../models/metrics.js";

export const getMLPerformance = async (req, res) => {
    try {
        const metrics = await Metrics.findOne();

        if (!metrics) {
            return res.status(200).json({ 
                message: "No data collected yet.",
                stats: null 
            });
        }

        const blockRate = metrics.totalCommentsChecked > 0 
            ? ((metrics.totalBlocked / metrics.totalCommentsChecked) * 100).toFixed(2) + "%"
            : "0%";

        res.status(200).json({
            status: "success",
            assessment: {
                timestamp: new Date(),
                traffic: {
                    totalProcessed: metrics.totalCommentsChecked
                },
                decisions: {
                    accepted: metrics.totalAccepted,
                    blocked: metrics.totalBlocked,
                    blockRate: blockRate
                },
                modelHealth: {
                    averageToxicityScore: metrics.averageScore.toFixed(4)
                }
            }
        });
    } catch (error) {
        console.error("Error fetching ML metrics:", error);
        res.status(500).json({ message: "Failed to generate assessment" });
    }
};