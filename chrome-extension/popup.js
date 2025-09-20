// Enhanced Popup UI logic with modern interactions
document.addEventListener('DOMContentLoaded', async () => {
  // Get UI elements
  const webcamToggle = document.getElementById('webcam-toggle');
  const notificationsToggle = document.getElementById('notifications-toggle');
  const notificationInterval = document.getElementById('notification-interval');
  const openDashboardBtn = document.getElementById('open-dashboard');
  const testNotificationBtn = document.getElementById('test-notification');
  const statusIndicator = document.getElementById('status-indicator');
  const webcamStatus = document.getElementById('webcam-status');
  const lastDetection = document.getElementById('last-detection');
  const recentEmotions = document.getElementById('recent-emotions');
  const emotionsCount = document.getElementById('emotions-count');
  
  // Authentication elements
  const authCard = document.getElementById('auth-card');
  const authStatus = document.getElementById('auth-status');
  const authMessage = document.getElementById('auth-message');
  const authToken = document.getElementById('auth-token');
  const authLogin = document.getElementById('auth-login');
  
  // Current emotion display elements
  const currentEmotionCard = document.getElementById('current-emotion-card');
  const currentEmotionEmoji = document.getElementById('current-emotion-emoji');
  const currentEmotionName = document.getElementById('current-emotion-name');
  const currentEmotionTime = document.getElementById('current-emotion-time');
  const emotionConfidence = document.getElementById('emotion-confidence');

  // Load saved settings
  const settings = await chrome.storage.sync.get({
    webcamEnabled: false,
    notificationsEnabled: true,
    notificationInterval: 15,
    lastEmotions: [],
    userToken: null,
    userId: null,
    userEmail: null
  });

  // Update UI with saved settings
  if (settings.webcamEnabled) {
    webcamToggle.classList.add('active');
  }
  if (settings.notificationsEnabled) {
    notificationsToggle.classList.add('active');
  }
  notificationInterval.value = settings.notificationInterval;
  
  // Initialize authentication UI
  updateAuthUI(settings);

  // Get current detection status
  await updateDetectionStatus();
  updateStatus();
  
  // Force update recent emotions on popup open
  console.log('🚀 Popup opened, forcing emotion update...');
  await forceUpdateRecentEmotions();

  // Add loading states and enhanced interactions
  openDashboardBtn.addEventListener('click', async () => {
    openDashboardBtn.innerHTML = '⏳ Opening...';
    openDashboardBtn.disabled = true;
    
    try {
      await chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
    } catch (error) {
      console.error('Failed to open dashboard:', error);
      openDashboardBtn.innerHTML = '❌ Failed to open';
      setTimeout(() => {
        openDashboardBtn.innerHTML = '🚀 Open Dashboard';
        openDashboardBtn.disabled = false;
      }, 2000);
    }
  });

  testNotificationBtn.addEventListener('click', async () => {
    testNotificationBtn.innerHTML = '⏳ Testing...';
    testNotificationBtn.disabled = true;
    
    try {
      await chrome.runtime.sendMessage({ action: 'testNotification' });
      testNotificationBtn.innerHTML = '✅ Sent!';
      setTimeout(() => {
        testNotificationBtn.innerHTML = '🔔 Test Notification';
        testNotificationBtn.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to send test notification:', error);
      testNotificationBtn.innerHTML = '❌ Failed';
      setTimeout(() => {
        testNotificationBtn.innerHTML = '🔔 Test Notification';
        testNotificationBtn.disabled = false;
      }, 2000);
    }
  });

  // Add test content script button
  const testContentScriptBtn = document.createElement('button');
  testContentScriptBtn.id = 'test-content-script';
  testContentScriptBtn.className = 'btn btn-secondary';
  testContentScriptBtn.innerHTML = '🧪 Test Content Script';
  testContentScriptBtn.style.marginTop = '8px';
  
  testContentScriptBtn.addEventListener('click', async () => {
    testContentScriptBtn.innerHTML = '⏳ Testing...';
    testContentScriptBtn.disabled = true;
    
    try {
      const response = await chrome.runtime.sendMessage({ action: 'testContentScript' });
      if (response && response.success) {
        console.log('📊 Content script test results:', response.results);
        testContentScriptBtn.innerHTML = '✅ Working!';
        setTimeout(() => {
          testContentScriptBtn.innerHTML = '🧪 Test Content Script';
          testContentScriptBtn.disabled = false;
        }, 2000);
      } else {
        console.error('Content script test failed:', response);
        testContentScriptBtn.innerHTML = '❌ Failed';
        setTimeout(() => {
          testContentScriptBtn.innerHTML = '🧪 Test Content Script';
          testContentScriptBtn.disabled = false;
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to test content script:', error);
      testContentScriptBtn.innerHTML = '❌ Error';
      setTimeout(() => {
        testContentScriptBtn.innerHTML = '🧪 Test Content Script';
        testContentScriptBtn.disabled = false;
      }, 2000);
    }
  });
  
  // Add the test button to the actions section
  const actionsSection = document.querySelector('.actions');
  actionsSection.appendChild(testContentScriptBtn);

  notificationInterval.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ notificationInterval: parseInt(e.target.value) });
  });

  // Force update recent emotions by requesting them from background
  async function forceUpdateRecentEmotions() {
    try {
      console.log('🔄 Force updating recent emotions...');
      const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
      if (response && response.totalDetections > 0) {
        console.log('📊 Found detections, requesting recent emotions...');
        // Request recent emotions from background
        chrome.runtime.sendMessage({ action: 'getRecentEmotions' });
      } else {
        console.log('❌ No detections found, checking if webcam is enabled...');
        const webcamEnabled = webcamToggle.classList.contains('active');
        if (webcamEnabled) {
          console.log('📹 Webcam enabled but no detections yet, showing loading state...');
          recentEmotions.innerHTML = '<div class="no-data">🔄 Analyzing video feed...</div>';
        } else {
          console.log('❌ Webcam not enabled, showing no-data message');
          updateRecentEmotions([]);
        }
      }
    } catch (error) {
      console.error('💥 Failed to force update recent emotions:', error);
      updateRecentEmotions([]);
    }
  }

  // Get current detection status from background
  async function updateDetectionStatus() {
    try {
      console.log('🔄 Updating detection status...');
      const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
      console.log('📊 Status response:', response);
      
      if (response) {
        // Update last detection time
        if (response.lastDetection) {
          const time = new Date(response.lastDetection.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          lastDetection.textContent = time;
          console.log('✅ Updated last detection time:', time);
          
          // Update current emotion display
          updateCurrentEmotion(response.lastDetection);
        } else {
          // Check if webcam is enabled but no detection yet
          const webcamEnabled = webcamToggle.classList.contains('active');
          if (webcamEnabled) {
            lastDetection.textContent = 'Starting...';
            console.log('⏳ Webcam enabled but no detection yet');
          } else {
            lastDetection.textContent = 'Never';
            currentEmotionCard.style.display = 'none';
            console.log('❌ No last detection found');
          }
        }
        
        // Update recent emotions if available
        if (response.totalDetections > 0) {
          console.log('📈 Total detections:', response.totalDetections);
        }
      } else {
        console.log('❌ No response from background script');
        lastDetection.textContent = 'Never';
        currentEmotionCard.style.display = 'none';
      }
    } catch (error) {
      console.error('💥 Failed to get detection status:', error);
      lastDetection.textContent = 'Error';
    }
  }

  // Enhanced status indicator with animations
  function updateStatus() {
    const webcamEnabled = webcamToggle.classList.contains('active');
    
    if (webcamEnabled) {
      statusIndicator.className = 'status-indicator status-active';
      statusIndicator.innerHTML = `
        <div class="status-dot"></div>
        <span>Active</span>
      `;
      webcamStatus.textContent = 'Monitoring';
      webcamStatus.style.color = '#059669';
    } else {
      statusIndicator.className = 'status-indicator status-inactive';
      statusIndicator.innerHTML = `
        <div class="status-dot"></div>
        <span>Inactive</span>
      `;
      webcamStatus.textContent = 'Not active';
      webcamStatus.style.color = '#dc2626';
    }
  }

  // Enhanced toggle functions with haptic feedback simulation
  async function toggleWebcam() {
    const enabled = !webcamToggle.classList.contains('active');
    
    // Add visual feedback
    webcamToggle.style.transform = 'scale(0.95)';
    setTimeout(() => {
      webcamToggle.style.transform = 'scale(1)';
    }, 150);
    
    if (enabled) {
      webcamToggle.classList.add('active');
      await chrome.storage.sync.set({ webcamEnabled: true });
      chrome.runtime.sendMessage({ action: 'startWebcam' });
    } else {
      webcamToggle.classList.remove('active');
      await chrome.storage.sync.set({ webcamEnabled: false });
      chrome.runtime.sendMessage({ action: 'stopWebcam' });
    }
    
    updateStatus();
  }

  async function toggleNotifications() {
    const enabled = !notificationsToggle.classList.contains('active');
    
    // Add visual feedback
    notificationsToggle.style.transform = 'scale(0.95)';
    setTimeout(() => {
      notificationsToggle.style.transform = 'scale(1)';
    }, 150);
    
    if (enabled) {
      notificationsToggle.classList.add('active');
      await chrome.storage.sync.set({ notificationsEnabled: true });
    } else {
      notificationsToggle.classList.remove('active');
      await chrome.storage.sync.set({ notificationsEnabled: false });
    }
  }

  // Add event listeners for the toggles
  webcamToggle.addEventListener('click', toggleWebcam);
  notificationsToggle.addEventListener('click', toggleNotifications);

  // Update current emotion display
  function updateCurrentEmotion(emotion) {
    if (!emotion) {
      currentEmotionCard.style.display = 'none';
      return;
    }

    const emojiMap = {
      focused: '🎯',
      tired: '😴',
      stressed: '😰',
      happy: '😊',
      sad: '😢',
      angry: '😠',
      surprised: '😲',
      neutral: '😐'
    };

    const emoji = emojiMap[emotion.emotion] || '🤔';
    const time = new Date(emotion.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const confidence = Math.round((emotion.confidence || 0.7) * 100);

    currentEmotionEmoji.textContent = emoji;
    currentEmotionName.textContent = emotion.emotion;
    currentEmotionName.className = `emotion-name-large emotion-${emotion.emotion}`;
    currentEmotionTime.textContent = time;
    emotionConfidence.textContent = `${confidence}%`;

    currentEmotionCard.style.display = 'block';
  }

  // Enhanced recent emotions display with better formatting (shows last 5)
  function updateRecentEmotions(emotions) {
    console.log('🔄 Updating recent emotions with:', emotions);
    emotionsCount.textContent = emotions.length;
    
    if (emotions.length === 0) {
      recentEmotions.innerHTML = '<div class="no-data">No recent data available</div>';
      console.log('❌ No emotions to display, showing no-data message');
      return;
    }

    // Show last 5 emotions (most recent first)
    const lastFiveEmotions = emotions.slice(-5).reverse();

    const emotionsHtml = lastFiveEmotions.map(emotion => {
      const time = new Date(emotion.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const emojiMap = {
        focused: '🎯',
        tired: '😴',
        stressed: '😰',
        happy: '😊',
        sad: '😢',
        angry: '😠',
        surprised: '😲',
        neutral: '😐'
      };
      
      const emoji = emojiMap[emotion.emotion] || '🤔';
      const colorClass = `emotion-${emotion.emotion}`;

      return `
        <div class="emotion-item">
          <div class="emotion-info">
            <span class="emotion-emoji">${emoji}</span>
            <span class="emotion-name ${colorClass}">${emotion.emotion}</span>
          </div>
          <span class="emotion-time">${time}</span>
        </div>
      `;
    }).join('');

    recentEmotions.innerHTML = emotionsHtml;
  }

  // Add smooth animations for card interactions
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // Auto-refresh status every 2 seconds when popup is open for more responsive updates
  const statusRefreshInterval = setInterval(async () => {
    await updateDetectionStatus();
    updateStatus();
  }, 2000);

  // Clean up interval when popup closes
  window.addEventListener('beforeunload', () => {
    clearInterval(statusRefreshInterval);
  });

  // Listen for updates from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Popup received message:', message);
    
    if (message.action === 'updateRecentEmotions') {
      console.log('📊 Updating recent emotions from message:', message.emotions);
      updateRecentEmotions(message.emotions);
    }
    
    if (message.action === 'updateStatus') {
      updateStatus();
    }
    
    if (message.action === 'emotionDetected') {
      console.log('🎭 Real-time emotion update received:', message);
      
      // Update current emotion display immediately
      updateCurrentEmotion({
        emotion: message.emotion,
        confidence: message.confidence,
        timestamp: message.timestamp
      });
      
      // Update last detection time
      const time = new Date(message.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      lastDetection.textContent = time;
      console.log('✅ Real-time update: Last detection set to', time);
      
      // Show a visual indicator that emotion was detected
      showEmotionDetectionIndicator(message.emotion);
    }
  });

  // Show visual indicator when emotion is detected
  function showEmotionDetectionIndicator(emotion) {
    // Create a temporary indicator
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    const emojiMap = {
      focused: '🎯',
      tired: '😴',
      stressed: '😰',
      happy: '😊',
      sad: '😢',
      angry: '😠',
      surprised: '😲',
      neutral: '😐'
    };
    
    indicator.textContent = `${emojiMap[emotion] || '🤔'} ${emotion.toUpperCase()}`;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(indicator);
    
    // Remove after 2 seconds
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 2000);
  }

  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'd':
          e.preventDefault();
          openDashboardBtn.click();
          break;
        case 't':
          e.preventDefault();
          testNotificationBtn.click();
          break;
        case 'w':
          e.preventDefault();
          webcamToggle.click();
          break;
        case 'n':
          e.preventDefault();
          notificationsToggle.click();
          break;
      }
    }
  });

  // Add tooltip functionality
  const tooltips = {
    'webcam-toggle': 'Toggle webcam monitoring (Ctrl+W)',
    'notifications-toggle': 'Toggle notifications (Ctrl+N)',
    'open-dashboard': 'Open dashboard (Ctrl+D)',
    'test-notification': 'Test notification (Ctrl+T)'
  };

  Object.entries(tooltips).forEach(([id, text]) => {
    const element = document.getElementById(id);
    if (element) {
      element.title = text;
    }
  });

  // Authentication functions
  function updateAuthUI(settings) {
    if (settings.userToken && settings.userEmail) {
      authStatus.textContent = 'Connected';
      authStatus.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      authMessage.textContent = `Connected as ${settings.userEmail}`;
      authToken.style.display = 'none';
      authLogin.innerHTML = '🔓 Disconnect';
      authLogin.onclick = disconnectAccount;
    } else {
      authStatus.textContent = 'Not connected';
      authStatus.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      authMessage.textContent = 'Please log in to sync your emotion data';
      authToken.style.display = 'block';
      authLogin.innerHTML = '🔐 Connect Account';
      authLogin.onclick = connectAccount;
    }
  }

  async function connectAccount() {
    const token = authToken.value.trim();
    if (!token) {
      authMessage.textContent = 'Please enter a valid JWT token';
      authMessage.style.color = '#dc2626';
      return;
    }

    authLogin.innerHTML = '⏳ Connecting...';
    authLogin.disabled = true;

    try {
      const response = await fetch('http://localhost:3000/api/extension-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        const data = await response.json();
        await chrome.storage.sync.set({
          userToken: token,
          userId: data.user.id,
          userEmail: data.user.email
        });
        
        authMessage.textContent = `Connected as ${data.user.email}`;
        authMessage.style.color = '#059669';
        authToken.value = '';
        updateAuthUI({ userToken: token, userEmail: data.user.email });
        
        // Show success indicator
        showSuccessIndicator('Account connected successfully!');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      authMessage.textContent = 'Failed to connect. Please check your token.';
      authMessage.style.color = '#dc2626';
    } finally {
      authLogin.innerHTML = '🔐 Connect Account';
      authLogin.disabled = false;
    }
  }

  async function disconnectAccount() {
    await chrome.storage.sync.remove(['userToken', 'userId', 'userEmail']);
    updateAuthUI({});
    authMessage.textContent = 'Please log in to sync your emotion data';
    authMessage.style.color = '#6b7280';
    showSuccessIndicator('Account disconnected');
  }

  function showSuccessIndicator(message) {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    indicator.textContent = message;
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 3000);
  }

  // Add event listener for auth login button
  authLogin.addEventListener('click', connectAccount);
});
