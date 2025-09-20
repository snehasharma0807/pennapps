// Content script for injecting face-api.js and emotion detection
(function() {
  'use strict';

  // Inject face-api.js script
  const faceApiScript = document.createElement('script');
  faceApiScript.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
  faceApiScript.onload = () => {
    console.log('face-api.js loaded');
  };
  document.head.appendChild(faceApiScript);

  // Inject our emotion detection script
  const emotionScript = document.createElement('script');
  emotionScript.src = chrome.runtime.getURL('face-detection.js');
  document.head.appendChild(emotionScript);

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startEmotionDetection') {
      startEmotionDetection(message.stream);
    } else if (message.action === 'stopEmotionDetection') {
      stopEmotionDetection();
    }
  });

  let emotionDetector = null;

  function startEmotionDetection(stream) {
    if (emotionDetector) {
      emotionDetector.stopDetection();
    }

    emotionDetector = new EmotionDetector();
    emotionDetector.startDetection(stream);
  }

  function stopEmotionDetection() {
    if (emotionDetector) {
      emotionDetector.stopDetection();
      emotionDetector = null;
    }
  }
})();
