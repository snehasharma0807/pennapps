// Background service worker for Chrome extension
let webcamStream = null;
let emotionDetectionInterval = null;
let lastNotificationTime = 0;
let emotionHistory = [];

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
  }
});

// Start webcam monitoring
async function startWebcamMonitoring() {
  try {
    // Request webcam permission
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    });

    // Start emotion detection
    startEmotionDetection();
    
    console.log('Webcam monitoring started');
  } catch (error) {
    console.error('Failed to start webcam:', error);
    showNotification('Permission Required', 'Please allow webcam access to monitor emotions.');
  }
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

  console.log('Webcam monitoring stopped');
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

// Detect emotion using face-api.js (simplified for demo)
async function detectEmotion() {
  // This is a simplified emotion detection
  // In a real implementation, you would use face-api.js or similar
  const emotions = ['focused', 'tired', 'stressed'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  // Simulate some logic based on time of day, etc.
  const hour = new Date().getHours();
  if (hour >= 23 || hour <= 5) {
    return 'tired';
  } else if (hour >= 9 && hour <= 17) {
    return 'focused';
  } else {
    return randomEmotion;
  }
}

// Handle detected emotion
async function handleEmotionDetected(emotion) {
  const timestamp = new Date();
  
  // Store emotion event
  emotionHistory.push({
    emotion,
    timestamp: timestamp.toISOString(),
    confidence: 0.8 // Simulated confidence
  });

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
    await sendEmotionToAPI(emotion, 0.8);
  } catch (error) {
    console.error('Failed to send emotion to API:', error);
  }

  // Check if we should show notification
  await checkForNotification(emotion);

  console.log(`Emotion detected: ${emotion}`);
}

// Send emotion data to API
async function sendEmotionToAPI(emotion, confidence) {
  try {
    const response = await fetch('http://localhost:3000/api/emotions', {
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
  chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
  chrome.notifications.clear(notificationId);
});
