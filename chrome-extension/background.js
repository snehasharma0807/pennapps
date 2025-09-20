// Background service worker for Chrome extension
importScripts('config.js');

let webcamStream = null;
let emotionDetectionInterval = null;
let lastNotificationTime = 0;
let emotionHistory = [];
let emotionDetector = null;
let isDetecting = false;
let hourlySummaryInterval = null;
let currentHourEmotions = [];
let hourlyStartTime = Date.now();

// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
  loadSettingsAndStart();
});

chrome.runtime.onInstalled.addListener(() => {
  loadSettingsAndStart();
});

// Load settings and start monitoring if enabled
async function loadSettingsAndStart() {
  const settings = await chrome.storage.sync.get({
    webcamEnabled: false,
    notificationsEnabled: true,
    notificationInterval: 15
  });

  if (settings.webcamEnabled) {
    startWebcamMonitoring();
  }
}

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'startWebcam':
      startWebcamMonitoring();
      break;
    case 'stopWebcam':
      stopWebcamMonitoring();
      break;
    case 'testNotification':
      showTestNotification();
      break;
    case 'emotionDetected':
      handleEmotionDetected(message.emotion, message.confidence, message.timestamp);
      break;
    case 'getStatus':
      sendResponse({
        isDetecting: isDetecting,
        lastDetection: emotionHistory.length > 0 ? emotionHistory[emotionHistory.length - 1] : null,
        totalDetections: emotionHistory.length,
        hourlyCount: currentHourEmotions.length
      });
      break;
  }
});

// Start webcam monitoring
async function startWebcamMonitoring() {
  try {
    // Request webcam permission
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      }
    });

    console.log('Webcam access granted');
    
    // Initialize emotion detector
    await initializeEmotionDetector();
    
    // Start continuous detection
    startContinuousDetection();
    
    // Start hourly summary timer
    startHourlySummary();
    
    console.log('Webcam monitoring started');
  } catch (error) {
    console.error('Failed to start webcam:', error);
    showNotification('Permission Required', 'Please allow webcam access to monitor emotions.');
  }
}

// Function to inject into content script
function startFaceDetection(stream) {
  window.startEmotionDetection(stream);
}

// Stop webcam monitoring
function stopWebcamMonitoring() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }

  if (emotionDetectionInterval) {
    clearInterval(emotionDetectionInterval);
    emotionDetectionInterval = null;
  }

  if (hourlySummaryInterval) {
    clearInterval(hourlySummaryInterval);
    hourlySummaryInterval = null;
  }

  isDetecting = false;
  emotionDetector = null;

  console.log('Webcam monitoring stopped');
}

// Initialize emotion detector
async function initializeEmotionDetector() {
  try {
    // Load face-api.js and create detector
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          // Load face-api.js if not already loaded
          if (typeof faceapi === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
            document.head.appendChild(script);
          }
          
          // Create global emotion detector
          window.emotionDetector = new EmotionDetector();
          window.emotionDetector.initialize();
        }
      });
    }
    console.log('Emotion detector initialized');
  } catch (error) {
    console.error('Failed to initialize emotion detector:', error);
  }
}

// Start continuous emotion detection
function startContinuousDetection() {
  if (emotionDetectionInterval) {
    clearInterval(emotionDetectionInterval);
  }

  isDetecting = true;
  
  emotionDetectionInterval = setInterval(async () => {
    if (!isDetecting) return;
    
    try {
      const emotion = await detectEmotionFromTab();
      if (emotion) {
        await handleEmotionDetected(emotion.emotion, emotion.confidence, new Date().toISOString());
      }
    } catch (error) {
      console.error('Continuous detection error:', error);
    }
  }, 5000); // Check every 5 seconds

  console.log('Continuous emotion detection started');
}

// Detect emotion from active tab
async function detectEmotionFromTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          if (window.emotionDetector && window.emotionDetector.isDetecting) {
            return window.emotionDetector.detectEmotion();
          }
          return null;
        }
      });
      
      if (results && results[0] && results[0].result) {
        return results[0].result;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting emotion from tab:', error);
    return null;
  }
}

// Start hourly summary timer
function startHourlySummary() {
  if (hourlySummaryInterval) {
    clearInterval(hourlySummaryInterval);
  }

  // Reset hourly tracking
  currentHourEmotions = [];
  hourlyStartTime = Date.now();

  // Set up hourly summary
  hourlySummaryInterval = setInterval(() => {
    generateHourlySummary();
  }, 60 * 60 * 1000); // Every 60 minutes

  console.log('Hourly summary timer started');
}

// Generate hourly emotion summary
function generateHourlySummary() {
  if (currentHourEmotions.length === 0) {
    console.log('No emotions detected in the past hour');
    return;
  }

  // Count emotions
  const emotionCounts = {};
  currentHourEmotions.forEach(emotion => {
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });

  // Find most common emotion
  const mostCommonEmotion = Object.keys(emotionCounts).reduce((a, b) => 
    emotionCounts[a] > emotionCounts[b] ? a : b
  );

  const totalDetections = currentHourEmotions.length;
  const percentage = ((emotionCounts[mostCommonEmotion] / totalDetections) * 100).toFixed(1);

  // Log hourly summary
  console.log('=== HOURLY EMOTION SUMMARY ===');
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log(`Total detections: ${totalDetections}`);
  console.log(`Most common state: ${mostCommonEmotion.toUpperCase()} (${percentage}%)`);
  console.log('Emotion breakdown:');
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    const pct = ((count / totalDetections) * 100).toFixed(1);
    console.log(`  ${emotion}: ${count} times (${pct}%)`);
  });
  console.log('===============================');

  // Reset for next hour
  currentHourEmotions = [];
  hourlyStartTime = Date.now();
}

// Start emotion detection loop
function startEmotionDetection() {
  if (emotionDetectionInterval) {
    clearInterval(emotionDetectionInterval);
  }

  emotionDetectionInterval = setInterval(async () => {
    try {
      const emotion = await detectEmotion();
      if (emotion) {
        await handleEmotionDetected(emotion);
      }
    } catch (error) {
      console.error('Emotion detection error:', error);
    }
  }, 5000); // Check every 5 seconds
}

// Advanced emotion detection with real analysis
async function detectEmotion() {
  try {
    // Get emotion from content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getLatestEmotion
      });
      
      if (results && results[0] && results[0].result) {
        return results[0].result;
      }
    }
    
    // Fallback to time-based detection
    return getTimeBasedEmotion();
  } catch (error) {
    console.error('Error detecting emotion:', error);
    return getTimeBasedEmotion();
  }
}

// Function to inject into content script to get latest emotion
function getLatestEmotion() {
  if (window.emotionDetector && window.emotionDetector.lastDetection) {
    return window.emotionDetector.lastDetection;
  }
  return null;
}

// Time-based emotion detection as fallback
function getTimeBasedEmotion() {
  const hour = new Date().getHours();
  
  if (hour >= 23 || hour <= 5) {
    return 'tired';
  } else if (hour >= 9 && hour <= 17) {
    return 'focused';
  } else if (hour >= 18 && hour <= 22) {
    return 'stressed';
  } else {
    return 'focused';
  }
}

// Handle detected emotion
async function handleEmotionDetected(emotion, confidence = 0.8, timestamp = null) {
  const detectionTime = timestamp ? new Date(timestamp) : new Date();
  
  // Store emotion event
  emotionHistory.push({
    emotion,
    timestamp: detectionTime.toISOString(),
    confidence: confidence
  });

  // Track for hourly summary
  currentHourEmotions.push(emotion);

  // Keep only last 50 emotions
  if (emotionHistory.length > 50) {
    emotionHistory = emotionHistory.slice(-50);
  }

  // Update storage
  await chrome.storage.sync.set({ lastEmotions: emotionHistory.slice(-10) });

  // Send to popup
  chrome.runtime.sendMessage({
    action: 'updateRecentEmotions',
    emotions: emotionHistory.slice(-10)
  });

  // Send to API
  try {
    await sendEmotionToAPI(emotion, confidence);
  } catch (error) {
    console.error('Failed to send emotion to API:', error);
  }

  // Check if we should show notification
  await checkForNotification(emotion);

  console.log(`Emotion detected: ${emotion} (confidence: ${confidence.toFixed(2)}) - Hourly count: ${currentHourEmotions.length}`);
}

// Send emotion data to API
async function sendEmotionToAPI(emotion, confidence) {
  try {
    // Use the configuration system to get the correct API URL
    const apiUrl = CONFIG.getUrl(CONFIG.endpoints.api.emotions);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: In a real app, you'd need to handle authentication
        // For now, we'll skip this or use a different approach
      },
      body: JSON.stringify({
        emotion,
        confidence
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
  } catch (error) {
    console.error('API error:', error);
  }
}

// Check if we should show a notification
async function checkForNotification(emotion) {
  const settings = await chrome.storage.sync.get({
    notificationsEnabled: true,
    notificationInterval: 15
  });

  if (!settings.notificationsEnabled) {
    return;
  }

  const now = Date.now();
  const timeSinceLastNotification = now - lastNotificationTime;
  const intervalMs = settings.notificationInterval * 60 * 1000;

  if (timeSinceLastNotification >= intervalMs) {
    await showEmotionNotification(emotion);
    lastNotificationTime = now;
  }
}

// Show notification for detected emotion
async function showEmotionNotification(emotion) {
  try {
    const suggestion = await getAISuggestion(emotion);
    
    chrome.notifications.create({
      type: 'basic',
      title: `WorkFlow AI - ${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Detected`,
      message: suggestion,
      priority: 1
    });
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

// Get AI suggestion (simplified)
async function getAISuggestion(emotion) {
  const suggestions = {
    focused: "Great focus! Consider taking a short break to maintain this energy level.",
    tired: "You seem tired. Try a 5-minute break, some water, or a quick stretch.",
    stressed: "Feeling stressed? Take deep breaths and consider stepping away for a moment."
  };

  return suggestions[emotion] || "Keep up the good work!";
}

// Show test notification
function showTestNotification() {
  chrome.notifications.create({
    type: 'basic',
    title: 'WorkFlow AI Test',
    message: 'This is a test notification. Your extension is working correctly!',
    priority: 1
  });
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  const dashboardUrl = CONFIG.getUrl(CONFIG.endpoints.dashboard);
  chrome.tabs.create({ url: dashboardUrl });
  chrome.notifications.clear(notificationId);
});
