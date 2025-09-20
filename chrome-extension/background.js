// Background service worker for Chrome extension
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
    case 'injectFaceApi':
      // Inject face-api.js into the current tab to bypass CSP
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0] && !tabs[0].url.startsWith('chrome://') && !tabs[0].url.startsWith('chrome-extension://')) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              function: () => {
                return new Promise((resolve) => {
                  if (typeof faceapi !== 'undefined') {
                    resolve({ success: true, message: 'Face-api.js already loaded' });
                    return;
                  }

                  const script = document.createElement('script');
                  script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
                  script.onload = () => {
                    console.log('✅ Face-api.js loaded via background script injection');
                    resolve({ success: true, message: 'Face-api.js loaded successfully' });
                  };
                  script.onerror = () => {
                    console.log('❌ Face-api.js failed to load');
                    resolve({ success: false, message: 'Face-api.js failed to load' });
                  };
                  document.head.appendChild(script);
                });
              }
            });
            sendResponse({ success: true });
          } catch (error) {
            console.error('Failed to inject face-api.js:', error);
            sendResponse({ success: false, error: error.message });
          }
        } else {
          sendResponse({ success: false, error: 'Cannot inject into this page' });
        }
      });
      return true; // Keep the message channel open for async response
    case 'testContentScript':
      // Test if content script is working
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0] && !tabs[0].url.startsWith('chrome://') && !tabs[0].url.startsWith('chrome-extension://')) {
          try {
            console.log('🧪 Testing content script from background script');
            console.log('📊 Tab details:', {
              id: tabs[0].id,
              url: tabs[0].url,
              status: tabs[0].status
            });
            
            // First, try to inject the content script manually
            console.log('🔄 Attempting to inject content script manually...');
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content.js']
              });
              console.log('✅ Content script injected manually');
              
              // Wait a moment for it to load
              await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (injectError) {
              console.log('⚠️ Manual injection failed:', injectError.message);
            }
            
            // Test using the minimal content script
            const results = await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              function: () => {
                console.log('🧪 Testing minimal content script from background script');
                console.log('🔍 Window object available:', typeof window !== 'undefined');
                console.log('🔍 Document available:', typeof document !== 'undefined');
                console.log('🔍 Chrome available:', typeof chrome !== 'undefined');
                
                // Try to call the content script functions
                if (typeof window.startEmotionDetection === 'function') {
                  console.log('✅ Found startEmotionDetection function!');
                  return {
                    success: true,
                    startEmotionDetection: typeof window.startEmotionDetection,
                    stopEmotionDetection: typeof window.stopEmotionDetection,
                    getEmotionDetector: typeof window.getEmotionDetector,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                  };
                } else {
                  console.log('❌ startEmotionDetection not found');
                  return {
                    success: false,
                    error: 'startEmotionDetection not found',
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                  };
                }
              }
            });
            
            if (results && results[0]) {
              console.log('📊 Content script test results:', results[0].result);
              sendResponse({ success: true, results: results[0].result });
            } else {
              console.log('❌ No results from content script test');
              sendResponse({ success: false, error: 'No results from content script test' });
            }
          } catch (error) {
            console.error('❌ Failed to test content script:', error);
            sendResponse({ success: false, error: error.message });
          }
        } else {
          console.log('❌ Cannot test on this page:', tabs[0] ? tabs[0].url : 'No tab');
          sendResponse({ success: false, error: 'Cannot test on this page' });
        }
      });
      return true; // Keep the message channel open for async response
    case 'emotionDetected':
      console.log('📨 Received emotion from content script:', message);
      console.log('📊 Current emotionHistory length:', emotionHistory.length);
      handleEmotionDetected(message.emotion, message.confidence, message.timestamp);
      console.log('📈 After handling, emotionHistory length:', emotionHistory.length);
      break;
    case 'getStatus':
      // Get status from content script if available
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && !tabs[0].url.startsWith('chrome://') && !tabs[0].url.startsWith('chrome-extension://')) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => {
              if (window.getEmotionDetector) {
                const detector = window.getEmotionDetector();
                return {
                  isDetecting: detector ? detector.isDetecting : false,
                  lastDetection: detector ? detector.lastDetection : null,
                  totalDetections: detector ? detector.emotionHistory.length : 0
                };
              }
              return null;
            }
          }, (results) => {
            const contentStatus = results && results[0] ? results[0].result : null;
            sendResponse({
              isDetecting: contentStatus ? contentStatus.isDetecting : isDetecting,
              lastDetection: contentStatus ? contentStatus.lastDetection : (emotionHistory.length > 0 ? emotionHistory[emotionHistory.length - 1] : null),
              totalDetections: contentStatus ? contentStatus.totalDetections : emotionHistory.length,
              hourlyCount: currentHourEmotions.length
            });
          });
        } else {
          sendResponse({
            isDetecting: isDetecting,
            lastDetection: emotionHistory.length > 0 ? emotionHistory[emotionHistory.length - 1] : null,
            totalDetections: emotionHistory.length,
            hourlyCount: currentHourEmotions.length
          });
        }
      });
      return true; // Keep the message channel open for async response
    case 'getRecentEmotions':
      // Send recent emotions to popup
      chrome.runtime.sendMessage({
        action: 'updateRecentEmotions',
        emotions: emotionHistory.slice(-10)
      });
      break;
  }
});

// Start webcam monitoring
async function startWebcamMonitoring() {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      console.error('No active tab found');
      return;
    }

    // Check if we're on a chrome:// URL
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      console.error('Cannot access webcam on chrome:// URLs');
      return;
    }

    // Request webcam permission through content script
    await requestWebcamPermission(tab.id);
    
    // Start hourly summary timer
    startHourlySummary();
    
    console.log('Webcam monitoring started');
  } catch (error) {
    console.error('Failed to start webcam:', error);
    showNotification('Permission Required', 'Please allow webcam access to monitor emotions.');
  }
}

// Request webcam permission through content script
async function requestWebcamPermission(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: async () => {
        try {
          // Request webcam permission
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            }
          });

          console.log('✅ Webcam access granted');
          
          // Store the stream globally so we can stop it later
          window.webcamStream = stream;
          console.log('📹 Stream stored globally:', {
            isStream: stream instanceof MediaStream,
            hasGetTracks: typeof stream.getTracks === 'function',
            trackCount: stream.getTracks ? stream.getTracks().length : 'N/A'
          });
          
          // Start emotion detection immediately
          if (window.startEmotionDetection) {
            window.startEmotionDetection(stream);
            console.log('✅ Emotion detection started');
          } else {
            console.error('❌ startEmotionDetection function not available in content script');
            console.log('🔄 Trying to send message to content script...');
            
            // Send a message to the content script to initialize
            // Note: We can't send MediaStream objects through messages, so we'll use the global reference
            chrome.tabs.sendMessage(tabId, { action: 'initializeAndStart' }, (response) => {
              if (chrome.runtime.lastError) {
                console.error('❌ Failed to send message to content script:', chrome.runtime.lastError);
                console.log('🔄 Content script may not be loaded yet, trying direct injection...');
                
                // Try to inject the content script directly
                chrome.scripting.executeScript({
                  target: { tabId: tabId },
                  files: ['content.js']
                }).then(() => {
                  console.log('✅ Content script injected, trying again...');
                  // Wait a moment and try again
                  setTimeout(() => {
                    chrome.tabs.sendMessage(tabId, { action: 'initializeAndStart', stream: stream }, (retryResponse) => {
                      if (retryResponse && retryResponse.success) {
                        console.log('✅ Content script initialized after injection');
                      } else {
                        console.error('❌ Still failed after injection');
                      }
                    });
                  }, 1000);
                }).catch((error) => {
                  console.error('❌ Failed to inject content script:', error);
                });
              } else if (response && response.success) {
                console.log('✅ Content script initialized and emotion detection started');
              } else {
                console.error('❌ Content script initialization failed:', response);
              }
            });
          }
          
          return stream;
        } catch (error) {
          console.error('Failed to get webcam access:', error);
          throw error;
        }
      }
    });
    
    // Store the stream reference in background script
    if (results && results[0] && results[0].result) {
      webcamStream = results[0].result;
    }
  } catch (error) {
    console.error('Failed to request webcam permission:', error);
    throw error;
  }
}

// Show notification function
function showNotification(title, message) {
  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.svg',
      title: title,
      message: message,
      priority: 1
    });
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

// Stop webcam monitoring
async function stopWebcamMonitoring() {
  try {
    // Stop emotion detection and webcam stream in content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      // Use the content script's stopEmotionDetection function
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          // Call the content script's stop function
          if (window.stopEmotionDetection) {
            window.stopEmotionDetection();
            console.log('Called stopEmotionDetection from content script');
          } else {
            console.log('stopEmotionDetection function not available, trying direct approach');
            
            // Fallback: direct approach
            if (window.emotionDetector) {
              window.emotionDetector.stopDetection();
            }
            
            // Stop webcam stream
            if (window.webcamStream) {
              window.webcamStream.getTracks().forEach(track => {
                track.stop();
                console.log('Webcam track stopped:', track.kind);
              });
              window.webcamStream = null;
            }
            
            // Remove video element
            const video = document.getElementById('workflow-ai-video');
            if (video) {
              video.remove();
              console.log('Video element removed');
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error stopping emotion detection:', error);
  }

  // Also stop any background stream reference
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

  // Send current emotion to popup immediately
  chrome.runtime.sendMessage({
    action: 'emotionDetected',
    emotion: emotion,
    confidence: confidence,
    timestamp: detectionTime.toISOString()
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
      iconUrl: 'icons/icon48.svg',
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
    iconUrl: 'icons/icon48.svg',
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
