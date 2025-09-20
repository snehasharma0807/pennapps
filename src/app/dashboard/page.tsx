'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Brain, Clock, Calendar, TrendingUp, Settings } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import ProductivityDashboard from '@/components/ProductivityDashboard';

export default function Dashboard() {
  const { user: auth0User, isLoading: auth0Loading, error: auth0Error } = useUser();
  const { user: customUser, isLoading: customLoading, logout: customLogout } = useAuth();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  
  // Determine which user is logged in and loading state
  // Prioritize custom auth over Auth0 to avoid conflicts
  const user = customUser || auth0User;
  const isLoading = customLoading || auth0Loading;
  const error = auth0Error;
  
  // Determine authentication method for logout
  const isCustomAuth = !!customUser;
  const isAuth0Auth = !!auth0User && !customUser;

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

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

  useEffect(() => {
    // Only redirect if both Auth0 and custom auth are done loading and no user is found
    if (!auth0Loading && !customLoading && !user) {
      // Redirect to custom auth page instead of Auth0 login
      router.push('/auth');
      return;
    }
  }, [user, auth0Loading, customLoading, router]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Link href="/auth">
            <Button>Try Again</Button>
          </Link>
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
              {isAuth0Auth ? (
                <Link href="/api/auth/logout">
                  <Button variant="outline" size="sm">
                    Logout
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={customLogout}
                >
                  Logout
                </Button>
              )}
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
              timeRangeData={timeRangeData} 
            />
            
            <p className="text-sm mt-6 text-center text-muted-foreground">
              Sample data shown - Install the Chrome extension for real-time monitoring
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center group cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl font-bold mb-2 transition-all duration-500 group-hover:text-5xl text-primary">
              {emotionTotals.focused}
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
              {emotionTotals.tired}
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
              {emotionTotals.stressed}
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
      </main>
    </div>
  );
}