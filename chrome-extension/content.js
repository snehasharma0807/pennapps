// Advanced content script for emotion detection
(function() {
  'use strict';

  let emotionDetector = null;
  let faceApiLoaded = false;
  let isInitialized = false;

  // Load face-api.js
  function loadFaceApi() {
    return new Promise((resolve, reject) => {
      if (typeof faceapi !== 'undefined') {
        faceApiLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
      script.onload = () => {
        faceApiLoaded = true;
        console.log('Face-api.js loaded successfully in content script');
        resolve();
      };
      script.onerror = () => {
        console.log('Face-api.js failed to load, using fallback detection');
        resolve(); // Continue with fallback
      };
      document.head.appendChild(script);
    });
  }

  // Load face-detection.js
  function loadFaceDetection() {
    return new Promise((resolve, reject) => {
      if (typeof EmotionDetector !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('face-detection.js');
      script.onload = () => {
        console.log('Face detection script loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load face detection script');
        reject(new Error('Failed to load face detection script'));
      };
      document.head.appendChild(script);
    });
  }

  // Initialize emotion detection system
  async function initializeEmotionDetection() {
    if (isInitialized) return;
    
    try {
      await loadFaceApi();
      await loadFaceDetection();
      
      // Create emotion detector
      emotionDetector = new EmotionDetector();
      await emotionDetector.initialize();
      
      isInitialized = true;
      console.log('Emotion detection system initialized in content script');
    } catch (error) {
      console.error('Failed to initialize emotion detection:', error);
    }
  }

  // Start emotion detection with webcam
  async function startEmotionDetection(stream) {
    if (!isInitialized) {
      await initializeEmotionDetection();
    }
    
    if (emotionDetector) {
      try {
        await emotionDetector.startDetection(stream);
        console.log('Emotion detection started in content script');
      } catch (error) {
        console.error('Failed to start emotion detection:', error);
      }
    }
  }

  // Stop emotion detection
  function stopEmotionDetection() {
    if (emotionDetector) {
      emotionDetector.stopDetection();
      console.log('Emotion detection stopped in content script');
    }
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case 'startEmotionDetection':
        startEmotionDetection(message.stream);
        break;
      case 'stopEmotionDetection':
        stopEmotionDetection();
        break;
      case 'getDetectorStatus':
        sendResponse({
          isInitialized: isInitialized,
          isDetecting: emotionDetector ? emotionDetector.isDetecting : false,
          lastDetection: emotionDetector ? emotionDetector.lastDetection : null
        });
        break;
    }
  });

  // Global functions for background script to call
  window.startEmotionDetection = startEmotionDetection;
  window.stopEmotionDetection = stopEmotionDetection;
  window.getEmotionDetector = () => emotionDetector;

  // Initialize when script loads
  initializeEmotionDetection();
})();
