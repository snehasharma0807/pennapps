// Face detection and emotion recognition using face-api.js
class EmotionDetector {
  constructor() {
    this.modelsLoaded = false;
    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.isDetecting = false;
  }

  async initialize() {
    try {
      // Load face-api.js models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);

      this.modelsLoaded = true;
      console.log('Face-api.js models loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to load face-api.js models:', error);
      return false;
    }
  }

  async startDetection(stream) {
    if (!this.modelsLoaded) {
      const loaded = await this.initialize();
      if (!loaded) {
        throw new Error('Failed to load face-api.js models');
      }
    }

    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.video.srcObject = stream;
    this.video.play();

    this.isDetecting = true;
    this.detectLoop();
  }

  stopDetection() {
    this.isDetecting = false;
    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
    }
  }

  async detectLoop() {
    if (!this.isDetecting) return;

    try {
      if (this.video && this.video.readyState === 4) {
        const emotion = await this.detectEmotion();
        if (emotion) {
          // Send emotion to background script
          chrome.runtime.sendMessage({
            action: 'emotionDetected',
            emotion: emotion
          });
        }
      }
    } catch (error) {
      console.error('Emotion detection error:', error);
    }

    // Continue detection loop
    setTimeout(() => this.detectLoop(), 1000);
  }

  async detectEmotion() {
    if (!this.video || !this.canvas || !this.ctx) return null;

    // Set canvas dimensions
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    // Draw video frame to canvas
    this.ctx.drawImage(this.video, 0, 0);

    // Detect faces and expressions
    const detections = await faceapi
      .detectAllFaces(this.canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detections.length === 0) return null;

    // Get the largest face (most prominent)
    const face = detections.reduce((prev, current) => 
      (prev.detection.box.area > current.detection.box.area) ? prev : current
    );

    // Map face-api.js expressions to our emotions
    const expressions = face.expressions;
    const emotion = this.mapExpressionsToEmotion(expressions);

    return emotion;
  }

  mapExpressionsToEmotion(expressions) {
    // Map face-api.js expressions to our three emotions
    const { neutral, happy, sad, angry, fearful, disgusted, surprised } = expressions;

    // Focused: High neutral + some happy
    const focusedScore = neutral + (happy * 0.5);

    // Tired: High sad + low energy (low happy, low surprised)
    const tiredScore = sad + (1 - happy) + (1 - surprised);

    // Stressed: High angry + fearful + disgusted
    const stressedScore = angry + fearful + disgusted;

    // Determine dominant emotion
    if (stressedScore > 0.3) {
      return 'stressed';
    } else if (tiredScore > 0.4) {
      return 'tired';
    } else if (focusedScore > 0.4) {
      return 'focused';
    }

    // Default to focused if no clear emotion
    return 'focused';
  }
}

// Export for use in background script
window.EmotionDetector = EmotionDetector;
