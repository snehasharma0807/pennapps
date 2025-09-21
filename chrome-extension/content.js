// Advanced content script for emotion detection
(function() {
  'use strict';

  let emotionDetector = null;
  let faceApiLoaded = false;

  // Load face-api.js
  function loadFaceApi() {
    return new Promise((resolve, reject) => {
      if (typeof faceapi !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
      script.onload = () => {
        faceApiLoaded = true;
        console.log('Face-api.js loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.log('Face-api.js failed to load, using fallback detection');
        resolve(); // Continue with fallback
      };
      document.head.appendChild(script);
    });
  }

  // Initialize emotion detection system
  async function initializeEmotionDetection() {
    await loadFaceApi();
    
    // Create emotion detector
    emotionDetector = new EmotionDetector();
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'startEmotionDetection') {
        startEmotionDetection(message.stream);
      } else if (message.action === 'stopEmotionDetection') {
        stopEmotionDetection();
      }
    });

    // Global function for background script to call
    window.startEmotionDetection = async function(stream) {
      if (emotionDetector) {
        await emotionDetector.startDetection(stream);
      }
    };

    window.stopEmotionDetection = function() {
      if (emotionDetector) {
        emotionDetector.stopDetection();
      }
    };

    console.log('Emotion detection system initialized');
  }

  // Start emotion detection
  async function startEmotionDetection(stream) {
    if (!emotionDetector) {
      await initializeEmotionDetection();
    }
    
    if (emotionDetector) {
      try {
        await emotionDetector.startDetection(stream);
        console.log('Emotion detection started');
      } catch (error) {
        console.error('Failed to start emotion detection:', error);
      }
    }
  }

  // Stop emotion detection
  function stopEmotionDetection() {
    if (emotionDetector) {
      emotionDetector.stopDetection();
      emotionDetector = null;
    }
    console.log('Emotion detection stopped');
  }

  // Initialize when script loads
  initializeEmotionDetection();
})();
