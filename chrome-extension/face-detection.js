// Advanced Face detection and emotion recognition system
class EmotionDetector {
  constructor() {
    this.modelsLoaded = false;
    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.isDetecting = false;
    this.lastDetection = null;
    this.emotionHistory = [];
    this.detectionInterval = null;
    this.faceApiReady = false;
  }

  async initialize() {
    try {
      // Check if face-api.js is available
      if (typeof faceapi === 'undefined') {
        console.log('Face-api.js not loaded yet, using fallback detection');
        this.faceApiReady = false;
        return true; // Continue with fallback
      }

      // Load face-api.js models from CDN
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);

      this.modelsLoaded = true;
      this.faceApiReady = true;
      console.log('Face-api.js models loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to load face-api.js models:', error);
      console.log('Using fallback emotion detection');
      this.faceApiReady = false;
      return true; // Continue with fallback
    }
  }

  async startDetection(stream) {
    const loaded = await this.initialize();
    if (!loaded) {
      throw new Error('Failed to initialize emotion detection');
    }

    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.video.srcObject = stream;
    this.video.autoplay = true;
    this.video.playsInline = true;
    this.video.muted = true;

    // Wait for video to be ready
    await new Promise((resolve) => {
      this.video.onloadedmetadata = () => {
        this.video.play();
        resolve();
      };
    });

    this.isDetecting = true;
    this.detectLoop();
    console.log('Face detection started');
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
          // Store the latest detection
          this.lastDetection = emotion;
          
          // Add to emotion history
          this.emotionHistory.push({
            emotion,
            timestamp: new Date().toISOString(),
            confidence: this.calculateConfidence(emotion)
          });

          // Keep only last 50 emotions
          if (this.emotionHistory.length > 50) {
            this.emotionHistory = this.emotionHistory.slice(-50);
          }

          // Send emotion to background script
          chrome.runtime.sendMessage({
            action: 'emotionDetected',
            emotion: emotion,
            confidence: this.calculateConfidence(emotion),
            timestamp: new Date().toISOString()
          });

          console.log(`Emotion detected: ${emotion}`);
        }
      }
    } catch (error) {
      console.error('Emotion detection error:', error);
    }

    // Continue detection loop
    setTimeout(() => this.detectLoop(), 2000); // Check every 2 seconds
  }

  calculateConfidence(emotion) {
    // Calculate confidence based on recent history
    if (this.emotionHistory.length < 3) {
      return 0.7; // Medium confidence for new detections
    }

    // Count recent occurrences of this emotion
    const recentEmotions = this.emotionHistory.slice(-10);
    const emotionCount = recentEmotions.filter(e => e.emotion === emotion).length;
    
    // Higher confidence if emotion is consistent
    return Math.min(0.9, 0.5 + (emotionCount / 10) * 0.4);
  }

  async detectEmotion() {
    if (!this.video || !this.canvas || !this.ctx) return null;

    // Set canvas dimensions
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    // Draw video frame to canvas
    this.ctx.drawImage(this.video, 0, 0);

    let emotion = null;

    if (this.faceApiReady && typeof faceapi !== 'undefined') {
      // Use face-api.js for advanced detection
      try {
        const detections = await faceapi
          .detectAllFaces(this.canvas, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections.length > 0) {
          // Get the largest face (most prominent)
          const face = detections.reduce((prev, current) => 
            (prev.detection.box.area > current.detection.box.area) ? prev : current
          );

          emotion = this.mapExpressionsToEmotion(face.expressions);
        }
      } catch (error) {
        console.log('Face-api.js detection failed, using fallback:', error);
      }
    }

    // Fallback to computer vision analysis
    if (!emotion) {
      emotion = await this.fallbackEmotionDetection();
    }

    return emotion;
  }

  async fallbackEmotionDetection() {
    if (!this.canvas || !this.ctx) return null;

    try {
      // Get image data for analysis
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      
      // Simple computer vision analysis
      const analysis = this.analyzeImageData(imageData);
      
      // Combine with time-based patterns
      const timeBasedEmotion = this.getTimeBasedEmotion();
      
      // Combine analyses
      return this.combineEmotionAnalysis(analysis, timeBasedEmotion);
    } catch (error) {
      console.error('Fallback emotion detection failed:', error);
      return this.getTimeBasedEmotion();
    }
  }

  analyzeImageData(imageData) {
    const data = imageData.data;
    let brightness = 0;
    let contrast = 0;
    let edgeCount = 0;

    // Calculate brightness and basic image properties
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      brightness += (r + g + b) / 3;
    }
    
    brightness = brightness / (data.length / 4);

    // Simple edge detection for activity level
    for (let i = 0; i < data.length - 4; i += 4) {
      const r1 = data[i];
      const g1 = data[i + 1];
      const b1 = data[i + 2];
      
      const r2 = data[i + 4];
      const g2 = data[i + 8];
      const b2 = data[i + 12];
      
      const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
      if (diff > 50) edgeCount++;
    }

    // Analyze patterns
    if (brightness < 100) {
      return 'tired'; // Low brightness might indicate tiredness
    } else if (edgeCount > 10000) {
      return 'stressed'; // High activity might indicate stress
    } else {
      return 'focused'; // Balanced conditions
    }
  }

  getTimeBasedEmotion() {
    const hour = new Date().getHours();
    
    // Time-based emotion patterns
    if (hour >= 23 || hour <= 5) {
      return 'tired';
    } else if (hour >= 9 && hour <= 17) {
      return 'focused';
    } else if (hour >= 18 && hour <= 22) {
      return 'stressed'; // Evening stress
    } else {
      return 'focused';
    }
  }

  combineEmotionAnalysis(imageAnalysis, timeAnalysis) {
    // Simple combination logic
    if (imageAnalysis === 'tired' || timeAnalysis === 'tired') {
      return 'tired';
    } else if (imageAnalysis === 'stressed' || timeAnalysis === 'stressed') {
      return 'stressed';
    } else {
      return 'focused';
    }
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
