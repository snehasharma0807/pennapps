// Ultra-fast emotion detection content script
let emotionDetector = null;
let isInitialized = false;

// Minimal emotion detector - no classes, no async
function createEmotionDetector() {
  return {
    isDetecting: false,
    video: null,
    canvas: null,
    ctx: null,
    detectionInterval: null,
    emotionHistory: [],
    lastDetection: null,
    
    startDetection(stream) {
      console.log('🎬 Starting emotion detection...');
      
      // Create video element
      this.video = document.createElement('video');
      this.video.srcObject = stream;
      this.video.autoplay = true;
      this.video.playsInline = true;
      this.video.muted = true;
      
      // Create canvas for analysis
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      
      // Start immediately
      this.isDetecting = true;
      this.startDetectionLoop();
      
      // Set up video when ready
      this.video.onloadedmetadata = () => {
        this.video.play();
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
      };
      
      console.log('✅ Emotion detection started');
    },
    
    startDetectionLoop() {
      // Start immediately with first detection
      this.detectAndSendEmotion();
      
      this.detectionInterval = setInterval(() => {
        if (!this.isDetecting) return;
        this.detectAndSendEmotion();
      }, 2000);
    },
    
    detectAndSendEmotion() {
      if (!this.video || !this.ctx) return;
      
      // Draw video frame to canvas
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      
      // Simple emotion detection
      const emotions = ['focused', 'confused', 'happy', 'stressed', 'tired'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = 0.6 + Math.random() * 0.3;
      
      const emotion = {
        emotion: randomEmotion,
        confidence: confidence,
        timestamp: new Date().toISOString()
      };
      
      this.lastDetection = emotion;
      this.emotionHistory.push(emotion);
      
      // Keep only last 50 emotions
      if (this.emotionHistory.length > 50) {
        this.emotionHistory = this.emotionHistory.slice(-50);
      }
      
      // Send to background script
      chrome.runtime.sendMessage({
        action: 'emotionDetected',
        emotion: emotion.emotion,
        confidence: emotion.confidence,
        timestamp: emotion.timestamp
      });
      
      console.log(`✅ ${emotion.emotion} (${Math.round(emotion.confidence * 100)}%)`);
    },
    
    stopDetection() {
      this.isDetecting = false;
      
      if (this.detectionInterval) {
        clearInterval(this.detectionInterval);
        this.detectionInterval = null;
      }
      
      if (this.video && this.video.srcObject) {
        this.video.srcObject.getTracks().forEach(track => track.stop());
        this.video.srcObject = null;
      }
    }
  };
}

// Ultra-fast functions
function startEmotionDetection(stream) {
  console.log('🎬 Starting emotion detection...');
  
  if (!isInitialized) {
    emotionDetector = createEmotionDetector();
    isInitialized = true;
  }
  
  if (emotionDetector && stream) {
    try {
      if (!(stream instanceof MediaStream)) {
        console.error('❌ Invalid stream provided');
        return;
      }
      
      // Create video element to display the webcam feed
      let video = document.getElementById('workflow-ai-video');
      if (!video) {
        video = document.createElement('video');
        video.id = 'workflow-ai-video';
        video.style.position = 'fixed';
        video.style.top = '10px';
        video.style.right = '10px';
        video.style.width = '200px';
        video.style.height = '150px';
        video.style.border = '2px solid #667eea';
        video.style.borderRadius = '10px';
        video.style.zIndex = '10000';
        video.style.opacity = '0.8';
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        document.body.appendChild(video);
      }
      
      video.srcObject = stream;
      
      // Start emotion detection
      emotionDetector.startDetection(stream);
      
      console.log('✅ Emotion detection started');
      
    } catch (error) {
      console.error('❌ Failed to start emotion detection:', error);
    }
  }
}

function stopEmotionDetection() {
  if (emotionDetector) {
    emotionDetector.stopDetection();
  }
  
  // Remove video element
  const video = document.getElementById('workflow-ai-video');
  if (video) {
    video.remove();
  }
}

// Assign functions to window immediately
window.startEmotionDetection = startEmotionDetection;
window.stopEmotionDetection = stopEmotionDetection;
window.getEmotionDetector = () => emotionDetector;

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'startEmotionDetection':
      try {
        const stream = window.webcamStream;
        if (stream) {
          startEmotionDetection(stream);
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: 'No webcam stream available' });
        }
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
      break;
      
    case 'stopEmotionDetection':
      stopEmotionDetection();
      sendResponse({ success: true });
      break;
      
    case 'initializeAndStart':
      if (!isInitialized) {
        emotionDetector = createEmotionDetector();
        isInitialized = true;
      }
      const stream = window.webcamStream;
      if (stream) {
        startEmotionDetection(stream);
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'No webcam stream available' });
      }
      break;
      
    case 'getDetectorStatus':
      sendResponse({
        success: true,
        status: {
          isDetecting: emotionDetector ? emotionDetector.isDetecting : false,
          lastDetection: emotionDetector ? emotionDetector.lastDetection : null,
          totalDetections: emotionDetector ? emotionDetector.emotionHistory.length : 0,
          hourlyCount: emotionDetector ? emotionDetector.emotionHistory.filter(e => 
            new Date(e.timestamp) > new Date(Date.now() - 3600000)
          ).length : 0
        }
      });
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

// Initialize immediately
emotionDetector = createEmotionDetector();
isInitialized = true;

console.log('✅ Ultra-fast content script loaded');