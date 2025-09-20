# WorkFlow AI Chrome Extension Setup Guide

## 🚀 Complete Browser Extension for Background Emotion Detection

This Chrome extension provides continuous emotion monitoring while you work, with hourly summaries and real-time status updates.

## ✨ Features

- **Background Monitoring**: Continuously analyzes your emotional state while working
- **Real-time Status**: Live updates in the extension popup
- **Hourly Summaries**: Every 60 minutes, logs your most common emotional state to console
- **Smart Notifications**: AI-powered productivity suggestions
- **Privacy-First**: All processing happens locally in your browser

## 🔧 Installation

### 1. Load the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. The WorkFlow AI extension will appear in your browser toolbar

### 2. Grant Permissions

When you first click the extension icon, Chrome will ask for:
- **Camera access**: Required for emotion detection
- **Tab access**: Needed for background monitoring
- **Storage**: To save your preferences

Click "Allow" for all permissions.

## 🎯 How to Use

### Emotion Detection

1. **Click the WorkFlow AI icon** in your browser toolbar
2. **Toggle "Webcam Monitoring"** to ON (the toggle will turn blue)
3. **Allow camera access** when prompted
4. The extension will start analyzing your emotional state every 5 seconds

### Understanding the Status

The popup shows:
- **System Status**: Active (blue) or Inactive (red)
- **Webcam**: "Monitoring" when active
- **Last Detection**: Time of most recent emotion detection
- **Recent Emotions**: Last 5 detected emotions with timestamps

### Hourly Summaries

Every 60 minutes, the extension automatically:
- Analyzes all emotions detected in the past hour
- Determines your most common emotional state
- Logs a detailed summary to the browser console

**To view hourly summaries:**
1. Press `F12` to open Developer Tools
2. Go to the "Console" tab
3. Look for messages starting with "=== HOURLY EMOTION SUMMARY ==="

### Example Hourly Summary

```
=== HOURLY EMOTION SUMMARY ===
Time: 12/19/2024, 2:30:00 PM
Total detections: 720
Most common state: FOCUSED (65.3%)
Emotion breakdown:
  focused: 470 times (65.3%)
  tired: 180 times (25.0%)
  stressed: 70 times (9.7%)
===============================
```

## ⚙️ Settings

### Notification Controls

- **Smart Notifications**: Toggle AI-powered suggestions
- **Notification Interval**: How often to receive suggestions (5-60 minutes)

### Privacy & Performance

- All emotion detection happens locally in your browser
- No data is sent to external servers
- Camera feed is processed in real-time and not stored
- Only emotion classifications and timestamps are saved locally

## 🔍 Troubleshooting

### Extension Not Working

1. **Check permissions**: Go to `chrome://extensions/` → WorkFlow AI → Details → Site access
2. **Reload extension**: Click the refresh icon on the extension card
3. **Check console**: Press F12 → Console tab for error messages

### Camera Issues

1. **Grant camera access**: Click the camera icon in the address bar
2. **Check other apps**: Make sure no other app is using your camera
3. **Restart browser**: Close and reopen Chrome

### No Emotion Detection

1. **Ensure good lighting**: Face should be well-lit
2. **Position camera**: Look directly at the camera
3. **Check console**: Look for face detection errors

## 📊 Understanding Your Data

### Emotion States

- **🎯 Focused**: Optimal work state - good posture, normal blinking, alert
- **😴 Tired**: Low energy - head tilting, eyes closing, reduced blinking
- **😰 Stressed**: High tension - rapid blinking, tense facial muscles

### Behavioral Features

The system analyzes:
- **Blink Rate**: Normal is 12-20 blinks per minute
- **Eye Strain**: How strained your eyes appear
- **Posture Score**: How upright you're sitting
- **Head Tilt**: How much your head is tilted
- **Eye Closure**: Duration of closed eyes

## 🛠️ Development

### Console Commands

Open browser console (F12) and try:

```javascript
// Check extension status
chrome.runtime.sendMessage({action: 'getStatus'}, console.log);

// Test notification
chrome.runtime.sendMessage({action: 'testNotification'});

// Get recent emotions
chrome.storage.sync.get(['lastEmotions'], console.log);
```

### Debug Mode

To see detailed detection logs:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for messages starting with "Emotion detected:"

## 🔒 Privacy & Security

- **Local Processing**: All face detection happens in your browser
- **No Data Collection**: No personal data is sent to external servers
- **Secure Storage**: Settings stored locally using Chrome's secure storage
- **Camera Privacy**: Video feed is processed in real-time and discarded

## 📈 Performance Tips

- **Close unused tabs**: Reduces CPU usage
- **Good lighting**: Improves detection accuracy
- **Stable internet**: For face-api.js model loading
- **Regular breaks**: The system works best with natural work patterns

## 🆘 Support

If you encounter issues:

1. Check the browser console for error messages
2. Ensure all permissions are granted
3. Try reloading the extension
4. Restart your browser

The extension is designed to work seamlessly in the background while you work, providing insights into your productivity patterns without interrupting your workflow.

---

**Built with ❤️ for PennApps 2025**
