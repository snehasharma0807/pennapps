// Configuration for WorkFlow AI Chrome Extension
// This file manages different environments (development vs production)

const CONFIG = {
  // Environment detection
  isDevelopment: () => {
    // Check if we're running in development mode
    return window.location.protocol === 'chrome-extension:' && 
           window.location.hostname === '';
  },

  // Base URLs for different environments
  urls: {
    // Development URL (localhost)
    development: 'http://localhost:3000',
    
    // Production URL - Replace with your actual Vercel deployment URL
    // Example: 'https://your-app-name.vercel.app'
    production: 'https://workflow-ai-pennapps.vercel.app', // Update this with your actual URL
    
    // Fallback URL (can be used for testing)
    fallback: 'https://workflow-ai-pennapps.vercel.app'
  },

  // Get the appropriate base URL based on environment
  getBaseUrl: () => {
    // For now, we'll use production URL by default
    // You can change this logic based on your needs
    
    // Option 1: Always use production (recommended for cross-device usage)
    return CONFIG.urls.production;
    
    // Option 2: Auto-detect environment (uncomment if you want this behavior)
    // return CONFIG.isDevelopment() ? CONFIG.urls.development : CONFIG.urls.production;
    
    // Option 3: Use a specific environment (uncomment and modify as needed)
    // return CONFIG.urls.development; // For development
    // return CONFIG.urls.production;  // For production
  },

  // API endpoints
  endpoints: {
    dashboard: '/dashboard',
    auth: '/auth',
    api: {
      emotions: '/api/emotions',
      suggestions: '/api/suggestions',
      user: '/api/user'
    }
  },

  // Get full URL for a specific endpoint
  getUrl: (endpoint) => {
    const baseUrl = CONFIG.getBaseUrl();
    return `${baseUrl}${endpoint}`;
  },

  // Debug mode (set to true for development)
  debug: false,

  // Log configuration info
  logConfig: () => {
    if (CONFIG.debug) {
      console.log('WorkFlow AI Extension Config:', {
        baseUrl: CONFIG.getBaseUrl(),
        environment: CONFIG.isDevelopment() ? 'development' : 'production',
        dashboardUrl: CONFIG.getUrl(CONFIG.endpoints.dashboard)
      });
    }
  }
};

// Log config on load (only in debug mode)
CONFIG.logConfig();

// Make CONFIG available globally
if (typeof window !== 'undefined') {
  window.WORKFLOW_CONFIG = CONFIG;
}
