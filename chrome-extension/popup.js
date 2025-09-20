// Popup UI logic
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

  // Event listeners
  openDashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
  });

  testNotificationBtn.addEventListener('click', async () => {
    chrome.runtime.sendMessage({ action: 'testNotification' });
  });

  notificationInterval.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ notificationInterval: parseInt(e.target.value) });
  });

  // Update status indicator
  function updateStatus() {
    const webcamEnabled = webcamToggle.classList.contains('active');
    if (webcamEnabled) {
      statusIndicator.innerHTML = `
        <div class="status-indicator">
          <div class="status-dot status-active"></div>
          <span class="text-xs text-gray-500">Active</span>
        </div>
      `;
      webcamStatus.textContent = 'Active';
    } else {
      statusIndicator.innerHTML = `
        <div class="status-indicator">
          <div class="status-dot status-inactive"></div>
          <span class="text-xs text-gray-500">Inactive</span>
        </div>
      `;
      webcamStatus.textContent = 'Not active';
    }
  }

  // Toggle functions
  window.toggleWebcam = async function() {
    const enabled = !webcamToggle.classList.contains('active');
    
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
    
    if (enabled) {
      notificationsToggle.classList.add('active');
      await chrome.storage.sync.set({ notificationsEnabled: true });
    } else {
      notificationsToggle.classList.remove('active');
      await chrome.storage.sync.set({ notificationsEnabled: false });
    }
  };

  // Update recent emotions display
  function updateRecentEmotions(emotions) {
    if (emotions.length === 0) {
      recentEmotions.innerHTML = '<div class="text-xs text-gray-500">No recent data</div>';
      return;
    }

    const emotionsHtml = emotions.slice(0, 5).map(emotion => {
      const time = new Date(emotion.timestamp).toLocaleTimeString();
      const color = {
        focused: 'text-green-600',
        tired: 'text-yellow-600',
        stressed: 'text-red-600'
      }[emotion.emotion] || 'text-gray-600';

      return `
        <div class="flex justify-between items-center text-xs">
          <span class="${color} capitalize">${emotion.emotion}</span>
          <span class="text-gray-500">${time}</span>
        </div>
      `;
    }).join('');

    recentEmotions.innerHTML = emotionsHtml;
  }

  // Listen for updates from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateRecentEmotions') {
      updateRecentEmotions(message.emotions);
    }
  });
});
