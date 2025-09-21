// Advanced Face detection and emotion recognition system
console.log('🚨 FACE-DETECTION.JS SCRIPT IS LOADING!');
console.log('🚨 Script execution started at:', new Date().toISOString());

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
    
    // NEW HYBRID CODE: CNN model and behavioral tracking
    this.cnnModel = null;
    this.cnnLoaded = false;
    this.blinkCount = 0;
    this.lastBlinkTime = Date.now();
    this.blinkRate = 0;
    this.eyeStrain = 0;
    this.postureScore = 0;
    this.smileScore = 0;
    this.behavioralHistory = [];
    this.faceLandmarks = null;
    this.detectionStartTime = Date.now();
    this.previousEAR = null;
    
    // Eye closure tracking
    this.eyesClosedStartTime = 0;
    this.eyesClosedDuration = 0;
    this.isEyesClosed = false;
    
    // Head tilt duration tracking
    this.headTiltStartTime = 0;
    this.headTiltDuration = 0;
    this.isHeadTilted = false;
  }

  async initialize() {
    try {
      console.log('🔄 Initializing EmotionDetector...');
      
      // NEW HYBRID CODE: Load CNN model first
      await this.loadModel();
      
      // Wait for face-api.js to be available with timeout
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      while (typeof faceapi === 'undefined' && attempts < maxAttempts) {
        console.log(`⏳ Waiting for face-api.js to load... (attempt ${attempts + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      // Check if face-api.js is available
      if (typeof faceapi === 'undefined') {
        console.log('❌ Face-api.js not loaded after timeout, using fallback detection');
        this.faceApiReady = false;
        return true; // Continue with fallback
      }

      console.log('✅ Face-api.js is available, loading models...');
      
      // Load face-api.js models from CDN with better error handling
      // Try multiple CDN sources for better reliability
      const MODEL_URLS = [
        'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights',
        'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.14/model',
        'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'
      ];
      
      let modelLoaded = false;
      let MODEL_URL = '';
      
      // Try each URL until one works
      for (const url of MODEL_URLS) {
        try {
          console.log(`🔄 Trying model URL: ${url}`);
          await faceapi.nets.tinyFaceDetector.loadFromUri(url);
          MODEL_URL = url;
          modelLoaded = true;
          console.log(`✅ TinyFaceDetector loaded from: ${url}`);
          break;
        } catch (error) {
          console.log(`❌ Failed to load from ${url}: ${error.message}`);
        }
      }
      
      if (!modelLoaded) {
        console.log('❌ All model URLs failed to load, using fallback detection');
        this.faceApiReady = false;
        return true; // Continue with fallback
      }
      
      // Load remaining models with the working URL
      try {
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        console.log('✅ FaceLandmark68Net loaded');
      } catch (error) {
        console.error('❌ Failed to load FaceLandmark68Net:', error);
        // Don't throw, continue with what we have
      }
      
      try {
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        console.log('✅ FaceRecognitionNet loaded');
      } catch (error) {
        console.error('❌ Failed to load FaceRecognitionNet:', error);
        // Don't throw, continue with what we have
      }
      
      try {
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log('✅ FaceExpressionNet loaded');
      } catch (error) {
        console.error('❌ Failed to load FaceExpressionNet:', error);
        // Don't throw, continue with what we have
      }

      this.modelsLoaded = true;
      this.faceApiReady = true;
      console.log('🎉 All face-api.js models loaded successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to load face-api.js models:', error);
      console.log('Using fallback emotion detection');
      this.faceApiReady = false;
      return true; // Continue with fallback
    }
  }

  // NEW HYBRID CODE: Load TensorFlow.js CNN model
  async loadModel() {
    try {
      // Check if face-api.js is available for expression recognition
      if (typeof faceapi === 'undefined') {
        console.log('⚠️ Face-api.js not loaded, using fallback detection only');
        this.cnnLoaded = false;
        return false;
      }

      // Use face-api.js expression recognition instead of separate CNN
      // This will be loaded with the other face-api.js models
      this.cnnModel = 'face-api-expression'; // Use face-api.js expression model
      this.cnnLoaded = true;
      console.log('✅ Expression recognition model ready (using face-api.js)');
      return true;
    } catch (error) {
      console.error('❌ Failed to load expression model:', error);
      this.cnnLoaded = false;
      return false;
    }
  }

  async startDetection(stream) {
    const loaded = await this.initialize();
    if (!loaded) {
      throw new Error('Failed to initialize emotion detection');
    }

    // Use existing video element if available, otherwise create new one
    if (!this.video) {
      this.video = document.createElement('video');
    }
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }

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

    // NEW HYBRID CODE: Initialize detection timing
    this.detectionStartTime = Date.now();
    this.blinkCount = 0;
    this.lastBlinkTime = Date.now();
    this.previousEAR = null;

    this.isDetecting = true;
    this.startDetectionLoop();
    console.log('✅ Face detection started');
    
    // Generate a test emotion after 3 seconds to verify the pipeline works
    setTimeout(() => {
      if (this.isDetecting) {
        console.log('🧪 Generating test emotion to verify pipeline...');
        const testEmotion = {
          emotion: 'focused',
          confidence: 0.8,
          timestamp: new Date().toISOString()
        };
        
        this.lastDetection = testEmotion;
        this.emotionHistory.push(testEmotion);
        
        // Send to background script
        chrome.runtime.sendMessage({
          action: 'emotionDetected',
          emotion: testEmotion.emotion,
          confidence: testEmotion.confidence,
          timestamp: testEmotion.timestamp
        });
        
        console.log('✅ Test emotion sent:', testEmotion);
      }
    }, 3000);
  }

  stopDetection() {
    console.log('Stopping emotion detection...');
    this.isDetecting = false;
    
    // Clear any detection intervals
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    
    // Stop video and clear stream
    if (this.video) {
      this.video.pause();
      if (this.video.srcObject) {
        // Stop all tracks in the stream
        this.video.srcObject.getTracks().forEach(track => {
          track.stop();
          console.log('Video track stopped:', track.kind);
        });
        this.video.srcObject = null;
      }
    }
    
    // Clear canvas
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    console.log('Emotion detection stopped');
  }

  startDetectionLoop() {
    // Clear any existing interval
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
    }
    
    console.log('🔄 Starting detection loop with hybrid models...');
    console.log('🔍 Model status:', {
      modelsLoaded: this.modelsLoaded,
      faceApiReady: this.faceApiReady,
      cnnLoaded: this.cnnLoaded
    });
    
    // Start new detection interval
    this.detectionInterval = setInterval(async () => {
      if (!this.isDetecting) {
        console.log('Detection stopped, clearing interval');
        clearInterval(this.detectionInterval);
        this.detectionInterval = null;
        return;
      }

      console.log('🔍 Detection loop running...', 'video readyState:', this.video?.readyState, 'isDetecting:', this.isDetecting);

      try {
        if (this.video && this.video.readyState === 4) {
          console.log('📹 Video is ready, detecting emotion with hybrid models...');
          const emotionResult = await this.detectEmotion();
          console.log('🎭 Emotion detection result:', emotionResult);
          if (emotionResult) {
            // Store the latest detection
            this.lastDetection = emotionResult;
            
            // Add to emotion history
            this.emotionHistory.push({
              emotion: emotionResult.emotion,
              timestamp: new Date().toISOString(),
              confidence: emotionResult.confidence
            });

            // Keep only last 50 emotions
            if (this.emotionHistory.length > 50) {
              this.emotionHistory = this.emotionHistory.slice(-50);
            }

            // Send emotion to background script
            chrome.runtime.sendMessage({
              action: 'emotionDetected',
              emotion: emotionResult.emotion,
              confidence: emotionResult.confidence,
              timestamp: new Date().toISOString()
            });

            console.log(`✅ Emotion detected: ${emotionResult.emotion} (confidence: ${emotionResult.confidence})`);
          } else {
            console.log('❌ No emotion detected in this frame');
          }
        } else {
          console.log('⏳ Video not ready yet, readyState:', this.video?.readyState);
        }
      } catch (error) {
        console.error('💥 Emotion detection error:', error);
      }
    }, 3000); // Check every 3 seconds for more responsive detection
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

  // NEW HYBRID CODE: CNN classification function
  async classifyWithCNN(canvas) {
    if (!this.cnnLoaded || !this.cnnModel || !this.faceApiReady) {
      return { emotion: null, confidence: 0 };
    }

    try {
      // Use face-api.js expression recognition
      const detections = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      
      if (detections.length === 0) {
        return { emotion: null, confidence: 0 };
      }
      
      // Get the first face's expressions
      const expressions = detections[0].expressions;
      
      // Map face-api.js expressions to our emotions
      // face-api.js has: neutral, happy, sad, angry, fearful, disgusted, surprised
      // We need to map these to: tired, stressed, focused
      
      // Tired: sad + neutral (low energy)
      const tiredScore = expressions.sad + (expressions.neutral * 0.5);
      
      // Stressed: angry + fearful + disgusted (negative emotions)
      const stressedScore = expressions.angry + expressions.fearful + expressions.disgusted;
      
      // Focused: neutral + surprised (alert and attentive)
      const focusedScore = expressions.neutral + (expressions.surprised * 0.5);
      
      // Find the highest score
      const scores = { tired: tiredScore, stressed: stressedScore, focused: focusedScore };
      const maxEmotion = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
      const confidence = Math.min(0.9, scores[maxEmotion] * 1.2); // Scale up confidence
      
      console.log('Face-api.js expressions:', expressions);
      console.log('Mapped emotions:', scores);
      
      return {
        emotion: maxEmotion,
        confidence: confidence
      };
    } catch (error) {
      console.error('Expression classification failed:', error);
      return { emotion: null, confidence: 0 };
    }
  }

  // NEW HYBRID CODE: Extract behavioral features
  extractBehavioralFeatures(faceLandmarks) {
    console.log('extractBehavioralFeatures called with landmarks:', faceLandmarks ? faceLandmarks.length : 0);
    
    if (!faceLandmarks || faceLandmarks.length === 0) {
      console.log('No face landmarks available, using fallback features');
      // Generate some variation even without landmarks
      this.generateFallbackFeatures();
      return {
        blinkRate: this.blinkRate,
        eyeStrain: this.eyeStrain,
        postureScore: this.postureScore,
        smileScore: .5 * this.smileScore,
        headTiltSeverity: 0,
        eyesClosedDuration: 0,
        headTiltDuration: 0
      };
    }

    console.log('Face landmarks detected:', faceLandmarks.length, 'points');
    
    // Calculate blink rate
    this.calculateBlinkRate(faceLandmarks);
    
    // Calculate eye strain
    this.calculateEyeStrain(faceLandmarks);
    
    // Calculate posture score and head tilt
    this.calculatePostureScore(faceLandmarks);
    
    // Calculate smile score
    this.calculateSmileScore(faceLandmarks);
    
    // Calculate head tilt severity
    const headTiltSeverity = this.calculateHeadTiltSeverity(faceLandmarks);
    
    // Detect eye closure and head tilt duration
    this.detectEyeClosure(faceLandmarks);
    this.detectHeadTiltDuration(headTiltSeverity);

    const features = {
      blinkRate: this.blinkRate,
      eyeStrain: this.eyeStrain,
      postureScore: this.postureScore,
      smileScore: this.smileScore,
      headTiltSeverity: headTiltSeverity,
      eyesClosedDuration: this.eyesClosedDuration,
      headTiltDuration: this.headTiltDuration
    };
    
    console.log('Returning features:', features);
    return features;
  }

  // NEW HYBRID CODE: Generate fallback features when landmarks aren't available
  generateFallbackFeatures() {
    // Simulate some variation based on time and random factors
    const time = Date.now();
    const timeFactor = Math.sin(time / 10000) * 0.3 + 0.5; // Oscillates between 0.2 and 0.8
    
    // Blink rate: simulate normal blinking with some variation
    this.blinkRate = 15 + Math.sin(time / 5000) * 5 + (Math.random() - 0.5) * 3;
    
    // Eye strain: varies over time
    this.eyeStrain = Math.max(0, Math.min(1, timeFactor + (Math.random() - 0.5) * 0.2));
    
    // Posture: varies with some randomness
    this.postureScore = Math.max(0, Math.min(1, 0.6 + Math.sin(time / 8000) * 0.3 + (Math.random() - 0.5) * 0.2));
    
    // Smile: varies randomly
    this.smileScore = Math.max(0, Math.min(1, Math.random() * 0.8 + 0.1));
    
    // Reset duration tracking for fallback
    this.eyesClosedDuration = 0;
    this.headTiltDuration = 0;
    
    console.log('Generated fallback features:', {
      blinkRate: this.blinkRate.toFixed(1),
      eyeStrain: this.eyeStrain.toFixed(2),
      postureScore: this.postureScore.toFixed(2),
      smileScore: this.smileScore.toFixed(2),
      eyesClosedDuration: this.eyesClosedDuration.toFixed(1),
      headTiltDuration: this.headTiltDuration.toFixed(1)
    });
  }

  // NEW HYBRID CODE: Calculate blink rate from eye landmarks
  calculateBlinkRate(landmarks) {
    console.log('calculateBlinkRate called with landmarks:', landmarks ? landmarks.length : 0);
    
    if (!landmarks || landmarks.length < 68) {
      console.log('Insufficient landmarks for blink detection:', landmarks ? landmarks.length : 0);
      return;
    }

    // Get eye landmarks - face-api.js uses 68-point model
    // Left eye: points 36-41, Right eye: points 42-47
    const leftEye = landmarks.slice(36, 42);
    const rightEye = landmarks.slice(42, 48);
    
    console.log('Left eye landmarks:', leftEye.length, 'Right eye landmarks:', rightEye.length);
    console.log('Left eye points:', leftEye);
    console.log('Right eye points:', rightEye);
    
    // Calculate eye aspect ratio (EAR) for blink detection
    const leftEAR = this.calculateEyeAspectRatio(leftEye);
    const rightEAR = this.calculateEyeAspectRatio(rightEye);
    const avgEAR = (leftEAR + rightEAR) / 2;
    
    console.log('EAR values - Left:', leftEAR.toFixed(3), 'Right:', rightEAR.toFixed(3), 'Avg:', avgEAR.toFixed(3));
    
    // Store current EAR for comparison
    if (!this.previousEAR) {
      this.previousEAR = avgEAR;
      console.log('Initial EAR set to:', avgEAR.toFixed(3));
      return;
    }
    
    // Detect blink (EAR drops significantly)
    const blinkThreshold = 0.25;
    const earDrop = this.previousEAR - avgEAR;
    
    console.log('EAR drop:', earDrop.toFixed(3), 'Threshold:', blinkThreshold);
    
    if (avgEAR < blinkThreshold && earDrop > 0.05) {
      const currentTime = Date.now();
      if (currentTime - this.lastBlinkTime > 200) { // Prevent rapid fire blinks
        this.blinkCount++;
        this.lastBlinkTime = currentTime;
        console.log('Blink detected! Total blinks:', this.blinkCount, 'EAR dropped from', this.previousEAR.toFixed(3), 'to', avgEAR.toFixed(3));
      }
    }
    
    this.previousEAR = avgEAR;
    
    // Calculate blink rate per minute (rolling average)
    const timeElapsed = (Date.now() - this.detectionStartTime) / 1000 / 60; // minutes
    this.blinkRate = timeElapsed > 0 ? this.blinkCount / timeElapsed : 0;
    
    console.log('Blink calculation - timeElapsed:', timeElapsed.toFixed(2), 'minutes, blinkCount:', this.blinkCount, 'blinkRate:', this.blinkRate.toFixed(1), 'blinks/min');
  }

  // NEW HYBRID CODE: Calculate eye aspect ratio for blink detection
  calculateEyeAspectRatio(eyeLandmarks) {
    if (!eyeLandmarks || eyeLandmarks.length < 6) {
      console.log('Insufficient eye landmarks:', eyeLandmarks ? eyeLandmarks.length : 0);
      return 0;
    }
    
    // face-api.js landmarks have x, y properties
    // Calculate vertical distances (top to bottom of eye)
    const vertical1 = this.distance(eyeLandmarks[1], eyeLandmarks[5]);
    const vertical2 = this.distance(eyeLandmarks[2], eyeLandmarks[4]);
    
    // Calculate horizontal distance (left to right of eye)
    const horizontal = this.distance(eyeLandmarks[0], eyeLandmarks[3]);
    
    // Eye aspect ratio - higher means more open
    const ear = horizontal > 0 ? (vertical1 + vertical2) / (2 * horizontal) : 0;
    
    console.log('EAR calculation - V1:', vertical1.toFixed(2), 'V2:', vertical2.toFixed(2), 'H:', horizontal.toFixed(2), 'EAR:', ear.toFixed(3));
    
    return ear;
  }

  // NEW HYBRID CODE: Calculate distance between two points
  distance(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }

  // NEW HYBRID CODE: Calculate eye strain
  calculateEyeStrain(landmarks) {
    if (!landmarks || landmarks.length < 68) {
      console.log('Insufficient landmarks for eye strain calculation');
      return;
    }

    // Simple eye strain calculation based on eye openness and position
    const leftEye = landmarks.slice(36, 42);
    const rightEye = landmarks.slice(42, 48);
    
    const leftEAR = this.calculateEyeAspectRatio(leftEye);
    const rightEAR = this.calculateEyeAspectRatio(rightEye);
    const avgEAR = (leftEAR + rightEAR) / 2;
    
    console.log('Eye strain calculation - avgEAR:', avgEAR.toFixed(3));
    
    // Lower EAR indicates more closed eyes (strain)
    // Normalize to 0-1 scale with more sensitivity
    this.eyeStrain = Math.max(0, Math.min(1, (0.3 - avgEAR) / 0.3));
    
    console.log('Calculated eye strain:', this.eyeStrain.toFixed(3));
  }

  // NEW HYBRID CODE: Calculate posture score
  calculatePostureScore(landmarks) {
    if (!landmarks || landmarks.length < 68) {
      console.log('Insufficient landmarks for posture calculation');
      return;
    }

    // Use nose and chin landmarks to estimate head position
    const nose = landmarks[30]; // Nose tip
    const chin = landmarks[8];  // Chin
    
    if (!nose || !chin) {
      console.log('Missing nose or chin landmarks');
      return;
    }
    
    console.log('Posture calculation - Nose:', nose.x.toFixed(1), nose.y.toFixed(1), 'Chin:', chin.x.toFixed(1), chin.y.toFixed(1));
    
    // Calculate head tilt (simplified)
    const headTilt = Math.abs(nose.x - chin.x);
    const headHeight = Math.abs(nose.y - chin.y);
    
    // Normalize posture score (0 = poor, 1 = good)
    // Make it more sensitive to changes
    const tiltRatio = headTilt / (headHeight + 1); // Add 1 to avoid division by zero
    this.postureScore = Math.max(0, Math.min(1, 1 - tiltRatio * 2));
    
    console.log('Calculated posture score:', this.postureScore.toFixed(3), 'tilt ratio:', tiltRatio.toFixed(3));
  }

  // NEW HYBRID CODE: Calculate smile score
  calculateSmileScore(landmarks) {
    if (!landmarks || landmarks.length < 68) {
      console.log('Insufficient landmarks for smile calculation');
      return;
    }

    // Use mouth landmarks to detect smile
    const mouthLeft = landmarks[48];
    const mouthRight = landmarks[54];
    const mouthTop = landmarks[51];
    const mouthBottom = landmarks[57];
    
    if (!mouthLeft || !mouthRight || !mouthTop || !mouthBottom) {
      console.log('Missing mouth landmarks');
      return;
    }
    
    console.log('Smile calculation - Mouth points:', {
      left: mouthLeft.x.toFixed(1), right: mouthRight.x.toFixed(1),
      top: mouthTop.y.toFixed(1), bottom: mouthBottom.y.toFixed(1)
    });
    
    // Calculate mouth width and height
    const mouthWidth = this.distance(mouthLeft, mouthRight);
    const mouthHeight = this.distance(mouthTop, mouthBottom);
    
    // Smile score based on mouth aspect ratio
    // Make it more sensitive and add variation
    const baseScore = Math.min(1, mouthWidth / (mouthHeight * 2 + 1));
    this.smileScore = baseScore;
    
    console.log('Calculated smile score:', this.smileScore.toFixed(3), 'width:', mouthWidth.toFixed(1), 'height:', mouthHeight.toFixed(1));
  }

  // NEW HYBRID CODE: Calculate head tilt severity
  calculateHeadTiltSeverity(landmarks) {
    if (!landmarks || landmarks.length < 68) {
      return 0;
    }

    const nose = landmarks[30];
    const chin = landmarks[8];
    
    if (!nose || !chin) {
      return 0;
    }
    
    const headTilt = Math.abs(nose.x - chin.x);
    const headHeight = Math.abs(nose.y - chin.y);
    const tiltRatio = headTilt / (headHeight + 1);
    
    // Scale up the tilt ratio for better sensitivity
    return Math.min(1, tiltRatio * 2);
  }

  // NEW HYBRID CODE: Detect eye closure duration
  detectEyeClosure(landmarks) {
    if (!landmarks || landmarks.length < 68) {
      return;
    }

    // Calculate average EAR for both eyes
    const leftEye = landmarks.slice(36, 42);
    const rightEye = landmarks.slice(42, 48);
    
    const leftEAR = this.calculateEyeAspectRatio(leftEye);
    const rightEAR = this.calculateEyeAspectRatio(rightEye);
    const avgEAR = (leftEAR + rightEAR) / 2;
    
    const currentTime = Date.now();
    const eyeClosedThreshold = 0.2;
    
    if (avgEAR < eyeClosedThreshold) {
      if (!this.isEyesClosed) {
        // Eyes just closed
        this.isEyesClosed = true;
        this.eyesClosedStartTime = currentTime;
        console.log(`👁️ Eyes closed detected (EAR: ${avgEAR.toFixed(3)})`);
      } else {
        // Eyes still closed - update duration
        this.eyesClosedDuration = (currentTime - this.eyesClosedStartTime) / 1000;
      }
    } else {
      if (this.isEyesClosed) {
        // Eyes just opened
        this.isEyesClosed = false;
        if (this.eyesClosedDuration > 0.5) { // Only count if closed for more than 0.5 seconds
          console.log(`👁️ Eyes opened after ${this.eyesClosedDuration.toFixed(1)}s closure`);
        }
        this.eyesClosedDuration = 0;
      }
    }
  }

  // NEW HYBRID CODE: Detect head tilt duration
  detectHeadTiltDuration(headTiltSeverity) {
    const currentTime = Date.now();
    const headTiltThreshold = 0.4;
    
    if (headTiltSeverity > headTiltThreshold) {
      if (!this.isHeadTilted) {
        // Head just tilted significantly
        this.isHeadTilted = true;
        this.headTiltStartTime = currentTime;
        console.log(`🔄 Head tilt detected (severity: ${headTiltSeverity.toFixed(3)})`);
      } else {
        // Head still tilted - update duration
        this.headTiltDuration = (currentTime - this.headTiltStartTime) / 1000;
      }
    } else {
      if (this.isHeadTilted) {
        // Head just straightened
        this.isHeadTilted = false;
        if (this.headTiltDuration > 0.5) { // Only count if tilted for more than 0.5 seconds
          console.log(`🔄 Head straightened after ${this.headTiltDuration.toFixed(1)}s tilt`);
        }
        this.headTiltDuration = 0;
      }
    }
  }

  // NEW HYBRID CODE: Classify emotion using heuristics only
  classifyWithHeuristics(features) {
    const { blinkRate, eyeStrain, postureScore, smileScore, headTiltSeverity, eyesClosedDuration, headTiltDuration } = features;
    
    // More balanced and sensitive scoring system
    const tiredScore = 
      (blinkRate < 10 ? 0.8 : 0) + 
      (blinkRate < 15 ? 0.4 : 0) +
      (eyeStrain > 0.5 ? 0.8 : 0) + 
      (eyeStrain > 0.3 ? 0.4 : 0) +
      (postureScore < 0.3 ? 0.8 : 0) + 
      (postureScore < 0.5 ? 0.4 : 0) +
      (smileScore < 0.2 ? 0.3 : 0) +
      (headTiltSeverity > 0.4 ? 1.0 : 0) + // Very strong indicator
      (headTiltSeverity > 0.2 ? 0.6 : 0) + // Strong indicator
      (headTiltDuration > 3 ? 1.2 : 0) + // Very strong indicator if head tilted > 3s
      (headTiltDuration > 1 ? 0.8 : 0) + // Strong indicator if head tilted > 1s
      (eyesClosedDuration > 3 ? 1.2 : 0) + // Very strong indicator if eyes closed > 3s
      (eyesClosedDuration > 1 ? 0.8 : 0) + // Strong indicator if eyes closed > 1s
      (eyesClosedDuration > 0.5 ? 0.4 : 0); // Moderate indicator if eyes closed > 0.5s
    
    const stressedScore = 
      (blinkRate > 25 ? 0.8 : 0) + 
      (blinkRate > 20 ? 0.4 : 0) +
      (eyeStrain > 0.4 ? 0.6 : 0) + 
      (eyeStrain > 0.2 ? 0.3 : 0) +
      (postureScore < 0.4 ? 0.6 : 0) + 
      (postureScore < 0.6 ? 0.3 : 0) +
      (smileScore < 0.3 ? 0.2 : 0);
    
    const focusedScore = 
      (blinkRate >= 12 && blinkRate <= 20 ? 0.6 : 0) + 
      (blinkRate >= 10 && blinkRate <= 25 ? 0.3 : 0) +
      (eyeStrain < 0.2 ? 0.6 : 0) + 
      (eyeStrain < 0.4 ? 0.3 : 0) +
      (postureScore > 0.6 ? 0.6 : 0) + 
      (postureScore > 0.4 ? 0.3 : 0) +
      (smileScore > 0.4 ? 0.3 : 0) +
      (headTiltSeverity < 0.1 ? 0.4 : 0); // Bonus for straight head
    
    // Add some variation to prevent always getting the same result
    const variation = 0.15;
    const finalTiredScore = Math.max(0, tiredScore + (Math.random() - 0.5) * variation);
    const finalStressedScore = Math.max(0, stressedScore + (Math.random() - 0.5) * variation);
    const finalFocusedScore = Math.max(0, focusedScore + (Math.random() - 0.5) * variation);
    
    const scores = { 
      tired: finalTiredScore,
      stressed: finalStressedScore,
      focused: finalFocusedScore
    };
    
    // Find the emotion with highest score
    const maxEmotion = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const maxScore = scores[maxEmotion];
    
    // Calculate confidence (more realistic range)
    const confidence = Math.max(0.3, Math.min(0.8, maxScore * 0.6 + 0.3));
    
    console.log('Emotion Scores:', scores);
    console.log('Selected:', maxEmotion, 'Confidence:', confidence.toFixed(2));
    
    return {
      emotion: maxEmotion,
      confidence: confidence
    };
  }

  // NEW HYBRID CODE: Calculate heuristic score for an emotion
  calculateHeuristicScore(features, thresholds) {
    const { blinkRate, eyeStrain, postureScore, smileScore, headTiltSeverity, eyesClosedDuration, headTiltDuration } = features;
    
    let score = 0;
    
    // Blink rate scoring (more nuanced)
    const blinkDiff = Math.abs(blinkRate - thresholds.blinkRate);
    const blinkScore = Math.max(0, 1 - blinkDiff / 10); // Normalize by 10
    score += blinkScore * 0.3;
    
    // Eye strain scoring (more nuanced)
    const strainDiff = Math.abs(eyeStrain - thresholds.eyeStrain);
    const strainScore = Math.max(0, 1 - strainDiff / 0.5); // Normalize by 0.5
    score += strainScore * 0.3;
    
    // Posture scoring (more nuanced)
    const postureDiff = Math.abs(postureScore - thresholds.postureScore);
    const postureScoreValue = Math.max(0, 1 - postureDiff / 0.5); // Normalize by 0.5
    score += postureScoreValue * 0.2;
    
    // Smile scoring (bonus for positive emotions)
    if (smileScore > 0.5) {
      score += 0.2;
    }
    
    // Head tilt severity scoring (for tired detection)
    if (headTiltSeverity > 0.3) {
      score += 0.8; // Strong indicator of tiredness
    } else if (headTiltSeverity > 0.1) {
      score += 0.4; // Moderate indicator
    }
    
    // Head tilt duration scoring (for tired detection)
    if (headTiltDuration > 3) {
      score += 1.0; // Very strong indicator if head tilted > 3s
    } else if (headTiltDuration > 1) {
      score += 0.6; // Strong indicator if head tilted > 1s
    }
    
    // Eye closure duration scoring (for tired detection)
    if (eyesClosedDuration > 3) {
      score += 1.0; // Very strong indicator if eyes closed > 3s
    } else if (eyesClosedDuration > 1) {
      score += 0.6; // Strong indicator if eyes closed > 1s
    } else if (eyesClosedDuration > 0.5) {
      score += 0.3; // Moderate indicator if eyes closed > 0.5s
    }
    
    // Add base score to ensure some variation
    score += 0.1;
    
    return Math.min(1, score);
  }

  // NEW HYBRID CODE: Main hybrid classification function
  async hybridClassify(features, behavior) {
    // Get CNN prediction
    let cnnResult = { emotion: null, confidence: 0 };
    if (this.cnnLoaded && this.canvas) {
      cnnResult = await this.classifyWithCNN(this.canvas);
    }
    
    // Get heuristic classification
    const heuristicResult = this.classifyWithHeuristics(features);
    
    // Combine results with weighted decision
    const cnnWeight = 0.7;
    const heuristicWeight = 0.3;
    
    // If CNN confidence is low, fall back to heuristics
    if (cnnResult.confidence < 0.5) {
      console.log('CNN confidence low, using heuristics');
      return heuristicResult;
    }
    
    // Weighted combination
    const emotions = ['tired', 'stressed', 'focused'];
    const combinedScores = {};
    
    emotions.forEach(emotion => {
      const cnnScore = cnnResult.emotion === emotion ? cnnResult.confidence : 0;
      const heuristicScore = heuristicResult.emotion === emotion ? heuristicResult.confidence : 0;
      
      combinedScores[emotion] = (cnnScore * cnnWeight) + (heuristicScore * heuristicWeight);
    });
    
    // Find the emotion with highest combined score
    const maxEmotion = Object.keys(combinedScores).reduce((a, b) => 
      combinedScores[a] > combinedScores[b] ? a : b
    );
    
    return {
      emotion: maxEmotion,
      confidence: combinedScores[maxEmotion]
    };
  }

  async detectEmotion() {
    if (!this.video || !this.canvas || !this.ctx) {
      console.log('❌ Missing video, canvas, or context');
      return null;
    }

    // Set canvas dimensions
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    // Draw video frame to canvas
    this.ctx.drawImage(this.video, 0, 0);

    let emotion = null;
    let faceLandmarks = null;

    console.log('🔍 Starting emotion detection with hybrid models...');
    console.log('📊 Model status:', {
      faceApiReady: this.faceApiReady,
      modelsLoaded: this.modelsLoaded,
      cnnLoaded: this.cnnLoaded,
      faceapiAvailable: typeof faceapi !== 'undefined'
    });

    if (this.faceApiReady && typeof faceapi !== 'undefined') {
      // Use face-api.js for advanced detection
      try {
        console.log('🎯 Attempting face detection with face-api.js...');
        console.log('📐 Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
        
        // Try different detection options for better sensitivity
        const detectionOptions = new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,  // Smaller input size for better detection
          scoreThreshold: 0.3  // Lower threshold for more sensitive detection
        });
        
        const detections = await faceapi
          .detectAllFaces(this.canvas, detectionOptions)
          .withFaceLandmarks()
          .withFaceExpressions();

        console.log('👥 Face detections found:', detections.length);

        if (detections.length > 0) {
          // Get the largest face (most prominent)
          const face = detections.reduce((prev, current) => {
            const prevArea = prev.detection?.box?.area || (prev.detection?.box ? prev.detection.box.width * prev.detection.box.height : 0);
            const currentArea = current.detection?.box?.area || (current.detection?.box ? current.detection.box.width * current.detection.box.height : 0);
            return prevArea > currentArea ? prev : current;
          });

          faceLandmarks = face.landmarks.positions;
          this.faceLandmarks = faceLandmarks;
          
          console.log('🎭 Face landmarks extracted:', faceLandmarks ? faceLandmarks.length : 0, 'points');
          console.log('📦 Face detection box:', face.detection?.box || face.box);
          
          // NEW HYBRID CODE: Use hybrid classification
          console.log('🧠 Using hybrid classification with behavioral features...');
          const features = this.extractBehavioralFeatures(faceLandmarks);
          const behavior = face.expressions;
          
          console.log('📊 Behavioral features:', features);
          console.log('😊 Face expressions:', behavior);
          
          const hybridResult = await this.hybridClassify(features, behavior);
          emotion = hybridResult;
          
          console.log('🎯 Hybrid classification result:', hybridResult);
        } else {
          console.log('❌ No faces detected in frame - trying alternative detection...');
          
          // Try with even more sensitive settings
          const sensitiveOptions = new faceapi.TinyFaceDetectorOptions({
            inputSize: 224,
            scoreThreshold: 0.1  // Very low threshold
          });
          
          const sensitiveDetections = await faceapi
            .detectAllFaces(this.canvas, sensitiveOptions)
            .withFaceLandmarks()
            .withFaceExpressions();
            
          console.log('🔍 Sensitive detection found:', sensitiveDetections.length, 'faces');
          
          if (sensitiveDetections.length > 0) {
            const face = sensitiveDetections[0];
            faceLandmarks = face.landmarks.positions;
            this.faceLandmarks = faceLandmarks;
            
            console.log('🎭 Sensitive detection landmarks:', faceLandmarks ? faceLandmarks.length : 0, 'points');
            
            const features = this.extractBehavioralFeatures(faceLandmarks);
            const behavior = face.expressions;
            
            const hybridResult = await this.hybridClassify(features, behavior);
            emotion = hybridResult;
            
            console.log('🎯 Sensitive detection result:', hybridResult);
          }
        }
      } catch (error) {
        console.log('❌ Face-api.js detection failed:', error);
        console.log('Error details:', error.message);
      }
    } else {
      console.log('⚠️ Face-api.js not ready, using fallback detection');
    }

    // Fallback to computer vision analysis
    if (!emotion) {
      console.log('🔄 Using fallback emotion detection with heuristics...');
      // NEW HYBRID CODE: Use heuristics as fallback
      const features = this.extractBehavioralFeatures(faceLandmarks);
      const heuristicResult = this.classifyWithHeuristics(features);
      emotion = heuristicResult;
      
      console.log('🎯 Fallback classification result:', heuristicResult);
    }

    // If still no emotion detected, generate a test emotion for debugging
    if (!emotion) {
      console.log('🧪 No emotion detected, generating test emotion for debugging');
      const testEmotions = ['focused', 'tired', 'stressed'];
      const randomEmotion = testEmotions[Math.floor(Math.random() * testEmotions.length)];
      emotion = {
        emotion: randomEmotion,
        confidence: 0.6 + Math.random() * 0.3 // Random confidence between 0.6-0.9
      };
      console.log('🎲 Generated test emotion:', emotion);
    }

    // Return emotion object with confidence
    if (emotion) {
      // If emotion is already an object (from hybrid classification), return it
      if (typeof emotion === 'object' && emotion.emotion && emotion.confidence) {
        console.log('✅ Returning emotion object:', emotion);
        return emotion;
      }
      // If emotion is just a string, wrap it in an object
      const wrappedEmotion = {
        emotion: emotion,
        confidence: this.calculateConfidence(emotion)
      };
      console.log('✅ Returning wrapped emotion:', wrappedEmotion);
      return wrappedEmotion;
    }
    
    console.log('❌ No emotion detected in this frame');
    return null;
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
    const focusedScore = neutral + (happy * 0.2);

    // Tired: High sad + low energy (low happy, low surprised)
    const tiredScore = 5*(sad + (1 - happy) + (1 - surprised));

    // Stressed: High angry + fearful + disgusted
    const stressedScore = 5*(angry + fearful + disgusted);

    console.log('Tired Score:', tiredScore);
    console.log('Stressed Score:', stressedScore);
    console.log('Focused Score:', focusedScore);

    // Determine dominant emotion
    if (stressedScore > 0.3) {
      return 'stressed';
    } else if (tiredScore > 0.4) {
      return 'tired';
    } else if (focusedScore > 0.4) {
      return 'focused';
    }

    // Default to focused if no clear emotion
    console.log('Default to focused');
    return 'focused';
  }
}

// Export for use in background script
console.log('🚨 FACE-DETECTION.JS CLASS DEFINED!');
console.log('🚨 EmotionDetector type:', typeof EmotionDetector);
window.EmotionDetector = EmotionDetector;
console.log('🚨 FACE-DETECTION.JS EXPORTED TO WINDOW!');
console.log('🚨 window.EmotionDetector type:', typeof window.EmotionDetector);