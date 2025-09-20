# WorkFlow AI Chrome Extension

## Installation Instructions

### Method 1: Load Unpacked Extension (Recommended for Development)

1. **Open Chrome Extensions Page**
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to the `chrome-extension` folder in this project
   - Select the folder and click "Select Folder"

4. **Verify Installation**
   - The extension should appear in your extensions list
   - You should see "WorkFlow AI" in your browser toolbar

### Method 2: Using the Extension

1. **Click the Extension Icon**
   - Look for the WorkFlow AI extension in your browser toolbar
   - Click on it to open the popup

2. **Grant Permissions**
   - The extension will request webcam permissions
   - Click "Allow" when prompted

3. **Enable Monitoring**
   - Toggle "Webcam Monitoring" to ON
   - Adjust notification settings as desired
   - Click "Test Notification" to verify it works

### Troubleshooting

#### Extension Not Loading
- Make sure Developer mode is enabled
- Check that all files are in the chrome-extension folder
- Try refreshing the extensions page

#### Webcam Not Working
- Check that Chrome has webcam permissions
- Go to Chrome Settings → Privacy and Security → Site Settings → Camera
- Make sure localhost is allowed

#### Notifications Not Working
- Check Chrome notification settings
- Go to Chrome Settings → Privacy and Security → Site Settings → Notifications
- Make sure notifications are allowed

#### Face Detection Issues
- The extension uses face-api.js for emotion detection
- Make sure you have good lighting
- Position your face clearly in the webcam view

### Features

- **Real-time Emotion Detection**: Detects focused, tired, and stressed states
- **Smart Notifications**: AI-powered productivity suggestions
- **Customizable Settings**: Adjust notification intervals
- **Dashboard Integration**: Links to the web dashboard
- **Privacy Focused**: All processing happens locally

### Development Notes

- This extension is in development mode
- Some features may require the full backend setup
- The face detection is simplified for demonstration purposes
- For production use, you'll need to set up the full API infrastructure

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all permissions are granted
3. Make sure the website is running on localhost:3000
4. Check that the extension files are properly loaded
