// Enhanced Popup UI logic with modern interactions
document.addEventListener('DOMContentLoaded', async () => {
  // Get UI elements
  const webcamToggle = document.getElementById('webcam-toggle');
  const notificationsToggle = document.getElementById('notifications-toggle');
  const openDashboardBtn = document.getElementById('open-dashboard');
  
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

  // Update authentication UI with stored credentials
  console.log('🔐 Loading stored authentication settings:', {
    hasToken: !!settings.userToken,
    hasEmail: !!settings.userEmail,
    hasUserId: !!settings.userId
  });
  updateAuthUI(settings);

  

  // Add loading states and enhanced interactions
  openDashboardBtn.addEventListener('click', async () => {
    openDashboardBtn.innerHTML = '⏳ Opening...';
    openDashboardBtn.disabled = true;
    
    try {
      await chrome.tabs.create({ url: 'http://localhost:3002/dashboard' });
    } catch (error) {
      console.error('Failed to open dashboard:', error);
      openDashboardBtn.innerHTML = '❌ Failed to open';
      setTimeout(() => {
        openDashboardBtn.innerHTML = '🚀 Open Dashboard';
        openDashboardBtn.disabled = false;
      }, 2000);
    }
  });







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
  }, 2000);

  // Clean up interval when popup closes
  window.addEventListener('beforeunload', () => {
    clearInterval(statusRefreshInterval);
  });

  // Listen for updates from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Popup received message:', message);
    
    
    
    if (message.action === 'emotionDetected') {
      console.log('🎭 Real-time emotion update received:', message);
      
      // Update current emotion display immediately
      updateCurrentEmotion({
        emotion: message.emotion,
        confidence: message.confidence,
        timestamp: message.timestamp
      });
      
      
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
  };

  Object.entries(tooltips).forEach(([id, text]) => {
    const element = document.getElementById(id);
    if (element) {
      element.title = text;
    }
  });

  // Authentication functions
  function updateAuthUI(settings) {
    console.log('🔐 updateAuthUI called with settings:', {
      hasToken: !!settings.userToken,
      hasEmail: !!settings.userEmail,
      tokenLength: settings.userToken?.length || 0
    });
    
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
      const response = await fetch('http://localhost:3002/api/extension-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔐 Storing authentication data:', {
          tokenLength: token.length,
          userId: data.user.id,
          userEmail: data.user.email
        });
        
        await chrome.storage.sync.set({
          userToken: token,
          userId: data.user.id,
          userEmail: data.user.email
        });
        
        console.log('🔐 Authentication data stored successfully');
        
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

  // Debug function to test storage (can be called from console)
  window.testStorage = async () => {
    console.log('🧪 Testing Chrome storage...');
    const testData = await chrome.storage.sync.get(['userToken', 'userId', 'userEmail']);
    console.log('🧪 Stored data:', testData);
    return testData;
  };
});
