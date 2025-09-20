'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Brain, Clock, Calendar, TrendingUp, Settings, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import ProductivityDashboard from '@/components/ProductivityDashboard';

export default function Dashboard() {
  const { user, token, isLoading, logout } = useAuth();
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [emotionData, setEmotionData] = useState<any>(null);
  const [emotionLoading, setEmotionLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<string | null>(null);

  // Sample data for demonstration with new time periods
  const timeRangeData = [
    { name: 'Morning', period: 'Morning', hours: 7, emotions: { focused: 0.8, tired: 0.1, stressed: 0.1 } },
    { name: 'Afternoon', period: 'Afternoon', hours: 5, emotions: { focused: 0.6, tired: 0.3, stressed: 0.1 } },
    { name: 'Evening', period: 'Evening', hours: 6, emotions: { focused: 0.3, tired: 0.6, stressed: 0.1 } },
    { name: 'Late Night', period: 'Late Night', hours: 6, emotions: { focused: 0.1, tired: 0.8, stressed: 0.1 } },
  ];

  const emotionTotals = {
    focused: 8.4, // (7*0.8 + 5*0.6 + 6*0.3 + 6*0.1)
    tired: 8.2,   // (7*0.1 + 5*0.3 + 6*0.6 + 6*0.8)
    stressed: 1.4 // (7*0.1 + 5*0.1 + 6*0.1 + 6*0.1)
  };

  // Fetch real emotion data from API
  const fetchEmotionData = async () => {
    if (!user || !token) return;
    
    try {
      setEmotionLoading(true);
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      console.log('🔐 Using JWT authentication for emotion data fetch');
      
      const response = await fetch('/api/emotions', {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setEmotionData(data);
        setLastRefreshTime(new Date().toLocaleTimeString());
        console.log('📊 Fetched emotion data:', data);
        console.log('📊 Analytics data:', data.analytics);
        console.log('📊 Events count:', data.events?.length || 0);
        console.log('📊 Raw detection counts:', {
          morning: data.analytics?.morning,
          afternoon: data.analytics?.afternoon,
          evening: data.analytics?.evening,
          late_night: data.analytics?.late_night
        });
      } else {
        console.error('Failed to fetch emotion data:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching emotion data:', error);
    } finally {
      setEmotionLoading(false);
    }
  };

  // Process emotion data for display (only when real data is available)
  const processEmotionData = () => {
    if (!emotionData) {
      console.log('🔄 No emotion data available, using sample data');
      // Return original sample data if no real data
      return {
        timeRangeData: [
          { name: 'Morning', period: 'Morning', hours: 7, emotions: { focused: 0.8, tired: 0.1, stressed: 0.1 } },
          { name: 'Afternoon', period: 'Afternoon', hours: 5, emotions: { focused: 0.6, tired: 0.3, stressed: 0.1 } },
          { name: 'Evening', period: 'Evening', hours: 6, emotions: { focused: 0.3, tired: 0.6, stressed: 0.1 } },
          { name: 'Late Night', period: 'Late Night', hours: 6, emotions: { focused: 0.1, tired: 0.8, stressed: 0.1 } },
        ],
        emotionTotals: { focused: 8.4, tired: 8.2, stressed: 1.4 }
      };
    }

    const { analytics, events } = emotionData;
    
    console.log('🔄 Processing emotion data:', { analytics, events });
    console.log('🔄 Raw analytics before processing:', analytics);
    
    // Convert detection counts to hours (assuming 1 detection = 3 minutes = 0.05 hours)
    const convertDetectionsToHours = (detections: number) => Math.round((detections * 0.05) * 100) / 100;
    
    // Calculate total hours for each time period
    const timeRangeData = [
      { 
        name: 'Morning', 
        period: 'Morning', 
        hours: convertDetectionsToHours(analytics.morning.focused + analytics.morning.tired + analytics.morning.stressed),
        emotions: {
          focused: convertDetectionsToHours(analytics.morning.focused),
          tired: convertDetectionsToHours(analytics.morning.tired),
          stressed: convertDetectionsToHours(analytics.morning.stressed)
        }
      },
      { 
        name: 'Afternoon', 
        period: 'Afternoon', 
        hours: convertDetectionsToHours(analytics.afternoon.focused + analytics.afternoon.tired + analytics.afternoon.stressed),
        emotions: {
          focused: convertDetectionsToHours(analytics.afternoon.focused),
          tired: convertDetectionsToHours(analytics.afternoon.tired),
          stressed: convertDetectionsToHours(analytics.afternoon.stressed)
        }
      },
      { 
        name: 'Evening', 
        period: 'Evening', 
        hours: convertDetectionsToHours(analytics.evening.focused + analytics.evening.tired + analytics.evening.stressed),
        emotions: {
          focused: convertDetectionsToHours(analytics.evening.focused),
          tired: convertDetectionsToHours(analytics.evening.tired),
          stressed: convertDetectionsToHours(analytics.evening.stressed)
        }
      },
      { 
        name: 'Late Night', 
        period: 'Late Night', 
        hours: convertDetectionsToHours(analytics.late_night.focused + analytics.late_night.tired + analytics.late_night.stressed),
        emotions: {
          focused: convertDetectionsToHours(analytics.late_night.focused),
          tired: convertDetectionsToHours(analytics.late_night.tired),
          stressed: convertDetectionsToHours(analytics.late_night.stressed)
        }
      },
    ];

    // Calculate emotion totals in hours (rounded to 2 decimal places)
    const emotionTotals = {
      focused: Math.round((convertDetectionsToHours(analytics.morning.focused + analytics.afternoon.focused + analytics.evening.focused + analytics.late_night.focused)) * 100) / 100,
      tired: Math.round((convertDetectionsToHours(analytics.morning.tired + analytics.afternoon.tired + analytics.evening.tired + analytics.late_night.tired)) * 100) / 100,
      stressed: Math.round((convertDetectionsToHours(analytics.morning.stressed + analytics.afternoon.stressed + analytics.evening.stressed + analytics.late_night.stressed)) * 100) / 100,
    };

    console.log('🔄 Processed timeRangeData:', timeRangeData);
    console.log('🔄 Processed emotionTotals:', emotionTotals);

    return { timeRangeData, emotionTotals };
  };

  // Use real data if available, otherwise use sample data
  const displayData = useMemo(() => {
    if (emotionData) {
      console.log('🔄 Recalculating displayData with new emotionData');
      const processed = processEmotionData();
      console.log('🔄 Final displayData:', processed);
      return processed;
    } else {
      console.log('🔄 Using sample data');
      return { timeRangeData, emotionTotals };
    }
  }, [emotionData]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !user) {
      router.push('/auth');
      return;
    }
  }, [user, isLoading, router]);

  // Auto-fetch emotion data when user is available and authentication is determined
  useEffect(() => {
    if (user && !isLoading && !emotionData) {
      console.log('🔄 Auto-fetching emotion data for user:', user.email);
      fetchEmotionData();
    }
  }, [user, isLoading, emotionData]);


  // Refresh emotion data (only when user clicks refresh button)
  const refreshEmotionData = () => {
    console.log('🔄 Refresh button clicked at:', new Date().toLocaleTimeString());
    fetchEmotionData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }


  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="shadow-sm border-b border-border bg-card transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    console.log('🔄 Refresh button clicked!');
                    refreshEmotionData();
                  }}
                  disabled={emotionLoading}
                  className="bg-blue-100 hover:bg-blue-200"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${emotionLoading ? 'animate-spin' : ''}`} />
                  {emotionLoading ? 'Loading...' : 'Refresh Data'}
                </Button>
                {lastRefreshTime && (
                  <span className="text-xs text-gray-500">
                    Last: {lastRefreshTime}
                  </span>
                )}
              </div>
              <ThemeToggle />
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <div className="text-sm text-muted-foreground">
                Welcome, {user.name || user.email || 'User'}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 animate-in fade-in-50 duration-700">
        {/* Header with View Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {viewMode === 'daily' ? 'Daily Overview' : 'Weekly Overview'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {viewMode === 'daily' 
                ? 'Your emotional patterns throughout the day' 
                : 'Your emotional patterns throughout the week'
              }
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex rounded-lg p-1 bg-muted">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'daily'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="h-4 w-4 mr-2 inline" />
              Daily
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'weekly'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-2 inline" />
              Weekly
            </button>
          </div>
        </div>

        {/* Productivity Dashboard */}
        <div className="mb-12">
          <div className="rounded-lg p-8 bg-card border border-border">
            <ProductivityDashboard 
              key={lastRefreshTime || 'initial'}
              timeRangeData={displayData.timeRangeData} 
            />
            
            {emotionLoading ? (
              <p className="text-sm mt-6 text-center text-muted-foreground">
                Loading emotion data...
              </p>
            ) : emotionData ? (
              <p className="text-sm mt-6 text-center text-muted-foreground">
                Real-time emotion data from your Chrome extension
              </p>
            ) : (
              <p className="text-sm mt-6 text-center text-muted-foreground">
                Sample data shown - Install the Chrome extension for real-time monitoring
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div key={lastRefreshTime || 'initial'} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center group cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl font-bold mb-2 transition-all duration-500 group-hover:text-5xl text-primary">
              {emotionLoading ? '...' : displayData.emotionTotals.focused}
            </div>
            <div className="text-lg transition-all duration-300 group-hover:text-xl text-foreground">
              Focused
            </div>
            <div className="text-sm transition-all duration-300 group-hover:opacity-80 text-muted-foreground">
              {viewMode === 'daily' ? 'hours today' : 'hours this week'}
            </div>
          </div>
          
          <div className="text-center group cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl font-bold mb-2 transition-all duration-500 group-hover:text-5xl text-muted">
              {emotionLoading ? '...' : displayData.emotionTotals.tired}
            </div>
            <div className="text-lg transition-all duration-300 group-hover:text-xl text-foreground">
              Tired
            </div>
            <div className="text-sm transition-all duration-300 group-hover:opacity-80 text-muted-foreground">
              {viewMode === 'daily' ? 'hours today' : 'hours this week'}
            </div>
          </div>
          
          <div className="text-center group cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl font-bold mb-2 transition-all duration-500 group-hover:text-5xl text-yellow-500">
              {emotionLoading ? '...' : displayData.emotionTotals.stressed}
            </div>
            <div className="text-lg transition-all duration-300 group-hover:text-xl text-foreground">
              Stressed
            </div>
            <div className="text-sm transition-all duration-300 group-hover:opacity-80 text-muted-foreground">
              {viewMode === 'daily' ? 'hours today' : 'hours this week'}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Insights */}
          <div 
            className={`transition-all duration-500 ease-out cursor-pointer group ${
              hoveredSection === 'insights' ? 'scale-105' : 'scale-100'
            } ${hoveredSection && hoveredSection !== 'insights' ? 'opacity-60' : 'opacity-100'}`}
            onMouseEnter={() => setHoveredSection('insights')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full transition-all duration-300 group-hover:scale-110 bg-primary">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold ml-4 transition-all duration-300 text-foreground">
                Insights
              </h2>
            </div>
            <div className="text-center py-16 transition-all duration-500 group-hover:py-20 bg-card border border-border rounded-2xl">
              <div className="transition-all duration-500 group-hover:scale-110">
                <Brain className="h-16 w-16 mx-auto mb-6 opacity-60 text-primary" />
                <p className="text-xl font-semibold mb-3 text-foreground">Data Analysis</p>
                <p className="text-base text-muted-foreground">
                  {viewMode === 'daily' 
                    ? 'Analyzing your daily emotional patterns and productivity trends' 
                    : 'Analyzing your weekly emotional patterns and productivity trends'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div 
            className={`transition-all duration-500 ease-out cursor-pointer group ${
              hoveredSection === 'suggestions' ? 'scale-105' : 'scale-100'
            } ${hoveredSection && hoveredSection !== 'suggestions' ? 'opacity-60' : 'opacity-100'}`}
            onMouseEnter={() => setHoveredSection('suggestions')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full transition-all duration-300 group-hover:scale-110 bg-muted">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold ml-4 transition-all duration-300 text-foreground">
                Suggestions
              </h2>
            </div>
            <div className="text-center py-16 transition-all duration-500 group-hover:py-20 bg-card border border-border rounded-2xl">
              <div className="transition-all duration-500 group-hover:scale-110">
                <Clock className="h-16 w-16 mx-auto mb-6 opacity-60 text-muted" />
                <p className="text-xl font-semibold mb-3 text-foreground">Personalized Recommendations</p>
                <p className="text-base text-muted-foreground">
                  {viewMode === 'daily' 
                    ? 'Get daily tips to optimize your productivity and well-being' 
                    : 'Get weekly recommendations to improve your work-life balance'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chrome Extension Section */}
        {user && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-500">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold ml-4 text-foreground">
                Chrome Extension
              </h2>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Connect Your Chrome Extension
                </h3>
                <p className="text-muted-foreground mb-4">
                  Use this token to authenticate your Chrome extension and sync emotion data.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Your Authentication Token
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={token || ''}
                      readOnly
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(token || '');
                        // You could add a toast notification here
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    How to use:
                  </h4>
                  <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                    <li>Install the WorkFlow AI Chrome extension</li>
                    <li>Click the extension icon in your browser</li>
                    <li>Paste this token in the authentication field</li>
                    <li>Click "Connect Account" to start syncing data</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}