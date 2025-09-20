# Intension.ai - Emotion Detection & Productivity Tool

A comprehensive Chrome extension + hosted website that uses webcam + AI to detect user emotions while working and provide real-time suggestions with analytics.

## Features

- **Real-time Emotion Detection**: Uses webcam and face-api.js to detect focused, tired, and stressed states
- **AI-Powered Suggestions**: Google Gemini API provides personalized productivity recommendations
- **Analytics Dashboard**: Beautiful charts and insights using Recharts
- **Chrome Notifications**: Smart notifications with customizable intervals
- **User Authentication**: Auth0 integration with email and Google login
- **Data Persistence**: MongoDB storage for emotion events and user preferences

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS, shadcn/ui
- **Backend**: Next.js API routes + MongoDB (Mongoose)
- **Authentication**: Auth0
- **ML Model**: face-api.js for emotion recognition
- **Charts**: Recharts (stacked bar charts)
- **AI Suggestions**: Google Gemini API
- **Browser Extension**: Manifest v3, service worker, content scripts

## Quick Start

### 1. Environment Setup

Copy the environment template:
```bash
cp env.example .env.local
```

Fill in your API keys and configuration:
```env
MONGODB_URI=mongodb://localhost:27017/workflow-ai
AUTH0_SECRET=your-auth0-secret
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_BASE_URL=http://localhost:3000
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
GEMINI_API_KEY=your-gemini-api-key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Dependency Check

```bash
npm run check-deps
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the website.

### 5. Load Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `chrome-extension/` folder
4. The extension will appear in your browser toolbar

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard page
│   │   └── page.tsx           # Landing page
│   ├── components/ui/         # shadcn/ui components
│   ├── lib/                   # Utilities (auth, db, gemini)
│   └── models/                # MongoDB schemas
├── chrome-extension/          # Chrome extension files
│   ├── manifest.json         # Extension manifest
│   ├── popup.html            # Extension popup UI
│   ├── popup.js              # Popup logic
│   ├── background.js         # Service worker
│   ├── content.js            # Content script
│   └── face-detection.js     # Emotion detection
├── scripts/
│   └── check-deps.js         # Dependency validation
└── README.md
```

## API Endpoints

- `POST /api/emotions` - Record emotion event
- `GET /api/emotions?week=current` - Get emotion analytics
- `POST /api/suggestions` - Get AI suggestions
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user settings

## Chrome Extension

### Features
- **Webcam Monitoring**: Continuous emotion detection via webcam
- **Smart Notifications**: AI-powered suggestions with customizable intervals
- **Settings Management**: Toggle monitoring and notifications
- **Dashboard Access**: Quick link to web dashboard
- **Recent History**: View recent emotion detections

### Permissions
- `storage` - Save user settings
- `notifications` - Show AI suggestions
- `activeTab` - Access current tab
- `scripting` - Inject content scripts

## MongoDB Schema

### User
```javascript
{
  auth0Id: String (unique),
  email: String,
  name: String,
  settings: {
    notificationInterval: Number (default: 15),
    notificationsEnabled: Boolean (default: true),
    webcamEnabled: Boolean (default: true)
  }
}
```

### EmotionEvent
```javascript
{
  userId: ObjectId,
  timestamp: Date,
  emotion: String (enum: ["focused", "tired", "stressed"]),
  confidence: Number,
  timeOfDay: String (enum: ["morning", "afternoon", "evening", "late_night"])
}
```

## Deployment

### Website (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Chrome Extension
1. Package the `chrome-extension/` folder
2. Submit to Chrome Web Store
3. Or distribute as unpacked extension

## Development

### Dependency Management
The project includes a comprehensive dependency check script:
- Validates all required environment variables
- Checks for outdated packages
- Tests MongoDB connection
- Verifies API configurations

Run before deployment:
```bash
npm run check-deps
```

### Adding New Features
1. Update API routes in `src/app/api/`
2. Add UI components in `src/components/`
3. Update Chrome extension in `chrome-extension/`
4. Test with dependency check script

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check `MONGODB_URI` in `.env.local`
   - Ensure MongoDB is running locally or use cloud instance

2. **Auth0 Authentication Issues**
   - Verify Auth0 domain and client credentials
   - Check callback URLs in Auth0 dashboard

3. **Gemini API Errors**
   - Ensure `GEMINI_API_KEY` is set correctly
   - Check API quotas and billing

4. **Chrome Extension Not Working**
   - Check browser console for errors
   - Verify webcam permissions
   - Ensure all files are loaded correctly

### Debug Mode
Set `NODE_ENV=development` for detailed error logging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run dependency check: `npm run check-deps`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Built with LOVE for PennApps 2025**