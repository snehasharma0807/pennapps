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

  // Load saved settings
  const settings = await chrome.storage.sync.get({
    webcamEnabled: false,
    notificationsEnabled: true,
    notificationInterval: 15,
    lastEmotions: []
  });

  // Update UI with saved settings
  if (settings.webcamEnabled) {
    webcamToggle.classList.add('active');
  }
  if (settings.notificationsEnabled) {
    notificationsToggle.classList.add('active');
  }
  notificationInterval.value = settings.notificationInterval;

  updateStatus();
  updateRecentEmotions(settings.lastEmotions);

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

  notificationInterval.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ notificationInterval: parseInt(e.target.value) });
  });

  // Enhanced status indicator with animations
  function updateStatus() {
    const webcamEnabled = webcamToggle.classList.contains('active');
    
    if (webcamEnabled) {
      statusIndicator.className = 'status-indicator status-active';
      statusIndicator.innerHTML = `
        <div class="status-dot"></div>
        <span>Active</span>
      `;
      webcamStatus.textContent = 'Active';
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
  window.toggleWebcam = async function() {
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
  };

  window.toggleNotifications = async function() {
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
  };

  // Enhanced recent emotions display with better formatting
  function updateRecentEmotions(emotions) {
    emotionsCount.textContent = emotions.length;
    
    if (emotions.length === 0) {
      recentEmotions.innerHTML = '<div class="no-data">No recent data available</div>';
      return;
    }

    const emotionsHtml = emotions.slice(0, 5).map(emotion => {
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

  // Listen for updates from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateRecentEmotions') {
      updateRecentEmotions(message.emotions);
    }
    
    if (message.action === 'updateStatus') {
      updateStatus();
    }
  });

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
          toggleWebcam();
          break;
        case 'n':
          e.preventDefault();
          toggleNotifications();
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
});
