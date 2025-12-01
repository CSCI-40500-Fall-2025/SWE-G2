import * as toxicity from '@tensorflow-models/toxicity';

const threshold = 0.85;
let model;

export const loadModel = async () => {
  console.log("⏳ Loading ML Toxicity Model...");
  try {
    model = await toxicity.load(threshold);
    console.log("🤖 ML Model Loaded Successfully!");
  } catch (error) {
    console.error("❌ Failed to load ML Model:", error);
  }
};

export const checkTextForToxicity = async (text) => {
  if (!model) {
    console.warn("⚠️ Model not loaded yet, skipping check.");
    return false;
  }

  const predictions = await model.classify([text]);
  let isToxic = false;

  predictions.forEach(prediction => {
    const result = prediction.results[0];
    
    if (result.match) {
      isToxic = true;
      
      const confidence = (result.probabilities[1] * 100).toFixed(2);
      
      console.log(`⚠️ TOXICITY DETECTED:`);
      console.log(`   Label: ${prediction.label}`);
      console.log(`   Confidence: ${confidence}%`);
      console.log(`   Text: "${text}"`);
    }
  });

  return isToxic;
};