import * as toxicity from "@tensorflow-models/toxicity";
import Metrics from "./models/metrics.js"; 
import FlaggedLog from "./models/flaggedLog.js"; 
import PassedLog from "./models/passedLog.js"; 

let model = null; 
const BASE_THRESHOLD = 0.85;

export const loadModel = async () => {
    if (model) return model;
    console.log("⏳ Loading ML Toxicity Model...");
    try {
        model = await toxicity.load(BASE_THRESHOLD);
        console.log("🤖 ML Model Loaded Successfully!");
    } catch (error) {
        console.error("❌ Failed to load ML Model:", error);
    }
    return model;
};

const computeToxicityScore = (predictions) => {
    let maxScore = 0;
    predictions.forEach(pred => {
        pred.results.forEach(result => {
            const prob = result.probabilities[1];
            if (prob > maxScore) maxScore = prob;
        });
    });
    return maxScore;
};

export const checkTextForToxicity = async (text) => {
    if (!model) await loadModel();
    const predictions = await model.classify([text]);
    return computeToxicityScore(predictions); 
};

//----------------------------------------
// UPDATED: Log to FlaggedLog OR PassedLog
//----------------------------------------
export const updateMetrics = async (score, wasBlocked, text) => {
    
    // 1. Update Global Numbers
    let metrics = await Metrics.findOne();
    if (!metrics) metrics = new Metrics();

    const oldTotal = metrics.totalCommentsChecked;
    const currentAvg = metrics.averageScore;

    // Rolling Average Formula
    const newAverage = ((currentAvg * oldTotal) + score) / (oldTotal + 1);

    metrics.averageScore = newAverage;
    metrics.totalCommentsChecked += 1;

    // 2. Handle Logging based on status
    if (wasBlocked) {
        metrics.totalBlocked += 1;
        
        // Log to Flagged Logs (Keep for 30 days)
        await FlaggedLog.create({
            originalText: text,
            score: score
        });
    } else {
        metrics.totalAccepted += 1;

        // Log to Passed Logs (Keep for 7 days)
        await PassedLog.create({
            originalText: text,
            score: score
        });
    }

    await metrics.save();
};