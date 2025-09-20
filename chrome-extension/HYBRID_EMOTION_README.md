# Hybrid Emotion Recognition System

This enhanced emotion detection system combines CNN predictions with behavioral heuristics to provide more accurate emotion classification for the three target emotions: **tired**, **stressed**, and **focused**.

## Features

### 🧠 CNN Integration
- **TensorFlow.js Model**: Loads a pre-trained CNN model from `model.json`
- **Real-time Classification**: Processes video frames at 224x224 resolution
- **Confidence Scoring**: Provides confidence levels for each prediction
- **Fallback Logic**: Uses heuristics when CNN confidence < 0.5

### 📊 Behavioral Heuristics
- **Blink Rate**: Tracks eye blinks per minute using facial landmarks
- **Eye Strain**: Calculates eye openness and strain levels
- **Posture Score**: Analyzes head position and tilt
- **Smile Score**: Detects facial expressions and mouth curvature

### ⚖️ Hybrid Decision Making
- **Weighted Combination**: 70% CNN + 30% heuristics
- **Adaptive Fallback**: Automatically switches to heuristics when CNN is uncertain
- **Confidence Thresholding**: Ensures reliable predictions

## Setup Instructions

### 1. Model Preparation
Place your trained CNN model files in the chrome extension directory:
```
chrome-extension/
├── model.json          # Your trained model architecture
├── weights.bin         # Model weights (if separate)
└── face-detection.js   # Updated hybrid system
```

### 2. Dependencies
The system requires these libraries (loaded via CDN):
- **TensorFlow.js**: `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js`
- **face-api.js**: `https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js`

### 3. Model Format
Your CNN model should:
- Accept input shape: `[1, 224, 224, 3]` (batch, height, width, channels)
- Output 3 classes: `[tired, stressed, focused]`
- Be saved in TensorFlow.js format using `tf.LayersModel.save()`

## Usage

### Basic Implementation
```javascript
// Create detector instance
const detector = new EmotionDetector();

// Initialize (loads CNN model and face-api.js)
await detector.initialize();

// Start detection with camera stream
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
await detector.startDetection(stream);

// Access results
console.log(detector.lastDetection); // Current emotion
console.log(detector.blinkRate);     // Blinks per minute
console.log(detector.eyeStrain);     // Eye strain level (0-1)
console.log(detector.postureScore);  // Posture quality (0-1)
console.log(detector.smileScore);    // Smile intensity (0-1)
```

### Demo Page
Open `hybrid-emotion-demo.html` in your browser to see the system in action:
- Real-time emotion detection
- Live behavioral feature monitoring
- CNN vs heuristic comparison
- Visual feedback and statistics

## Key Methods

### `loadModel()`
Loads the TensorFlow.js CNN model from `model.json`.

### `classifyWithCNN(canvas)`
Runs CNN inference on a video frame:
- Resizes input to 224x224
- Normalizes pixel values
- Returns emotion and confidence

### `extractBehavioralFeatures(landmarks)`
Calculates behavioral metrics:
- Blink rate from eye landmarks
- Eye strain from eye aspect ratio
- Posture score from head position
- Smile score from mouth landmarks

### `hybridClassify(features, behavior)`
Main classification function:
- Combines CNN and heuristic results
- Uses weighted decision (70% CNN, 30% heuristics)
- Falls back to heuristics if CNN confidence < 0.5

## Configuration

### Weights and Thresholds
You can adjust the system behavior by modifying these values:

```javascript
// CNN vs heuristic weights
const cnnWeight = 0.7;
const heuristicWeight = 0.3;

// Confidence threshold for CNN fallback
const confidenceThreshold = 0.5;

// Behavioral thresholds for each emotion
const tiredThresholds = {
  blinkRate: 15,    // Low blink rate
  eyeStrain: 0.7,   // High eye strain
  postureScore: 0.3 // Poor posture
};
```

### Emotion Mapping
The system maps facial expressions to emotions:
- **Tired**: Low blink rate, high eye strain, poor posture
- **Stressed**: High blink rate, medium eye strain, poor posture
- **Focused**: Normal blink rate, low eye strain, good posture

## Performance Notes

- **Memory Management**: Tensors are automatically disposed to prevent memory leaks
- **Detection Frequency**: Runs every 2 seconds by default
- **Fallback Support**: Works even without CNN model (heuristics only)
- **Browser Compatibility**: Requires modern browsers with WebGL support

## Troubleshooting

### CNN Model Not Loading
- Ensure `model.json` is in the correct directory
- Check that TensorFlow.js is loaded before initialization
- Verify model format compatibility

### Poor Detection Accuracy
- Adjust behavioral thresholds based on your use case
- Fine-tune CNN model on your specific data
- Consider lighting and camera quality

### Performance Issues
- Reduce detection frequency if needed
- Ensure GPU acceleration is enabled
- Monitor memory usage in browser dev tools

## File Structure

```
chrome-extension/
├── face-detection.js           # Main hybrid emotion detector
├── hybrid-emotion-demo.html    # Demo page
├── model.json                  # Your CNN model (add this)
├── weights.bin                 # Model weights (if separate)
└── HYBRID_EMOTION_README.md    # This documentation
```

## Next Steps

1. **Train Your CNN Model**: Create a model trained on your specific emotion data
2. **Fine-tune Thresholds**: Adjust behavioral parameters for your use case
3. **Add More Features**: Extend with additional behavioral metrics
4. **Optimize Performance**: Profile and optimize for your target devices

The hybrid system provides a robust foundation for emotion recognition that combines the power of deep learning with the reliability of behavioral analysis.
