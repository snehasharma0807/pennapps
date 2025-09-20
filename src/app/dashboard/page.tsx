'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Brain, Clock, Calendar, TrendingUp, Settings } from 'lucide-react';
import Link from 'next/link';
// import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import ProductivityDashboard from '@/components/ProductivityDashboard';

export default function Dashboard() {
  // const { user, isLoading } = useUser();
  const user = { name: 'Demo User', email: 'demo@example.com' };
  const isLoading = false;
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode styles
  const darkModeStyles = {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#2c423f',
    textSecondary: isDarkMode ? '#a0a0a0' : '#93a57b',
    cardBackground: isDarkMode ? '#2d2d2d' : '#f8f9fa',
    border: isDarkMode ? '#404040' : '#93a57b',
    navBackground: isDarkMode ? '#2d2d2d' : '#ffffff'
  };

  // Sample data for demonstration
  const timeRangeData = [
    { name: '9:00 AM', period: 'Morning', hours: 1, emotions: { focused: 0.8, tired: 0.1, stressed: 0.1 } },
    { name: '10:00 AM', period: 'Morning', hours: 1, emotions: { focused: 0.9, tired: 0.05, stressed: 0.05 } },
    { name: '11:00 AM', period: 'Morning', hours: 1, emotions: { focused: 0.7, tired: 0.2, stressed: 0.1 } },
    { name: '12:00 PM', period: 'Lunch', hours: 1, emotions: { focused: 0.6, tired: 0.3, stressed: 0.1 } },
    { name: '1:00 PM', period: 'Afternoon', hours: 1, emotions: { focused: 0.4, tired: 0.4, stressed: 0.2 } },
    { name: '2:00 PM', period: 'Afternoon', hours: 1, emotions: { focused: 0.8, tired: 0.1, stressed: 0.1 } },
    { name: '3:00 PM', period: 'Afternoon', hours: 1, emotions: { focused: 0.9, tired: 0.05, stressed: 0.05 } },
    { name: '4:00 PM', period: 'Afternoon', hours: 1, emotions: { focused: 0.7, tired: 0.2, stressed: 0.1 } },
    { name: '5:00 PM', period: 'Evening', hours: 1, emotions: { focused: 0.5, tired: 0.3, stressed: 0.2 } }
  ];

  const emotionTotals = {
    focused: 6.2,
    tired: 1.7,
    stressed: 1.1
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
      return;
    }
  }, [user, isLoading, router]);

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
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen transition-all duration-1000 ease-out" style={{backgroundColor: darkModeStyles.background}}>
      {/* Navigation Bar */}
      <nav className="shadow-sm border-b transition-all duration-500" style={{backgroundColor: darkModeStyles.navBackground, borderColor: darkModeStyles.border}}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold" style={{color: darkModeStyles.text}}>Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/settings">
                <Button variant="ghost" size="sm" style={{color: darkModeStyles.text}}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <div className="text-sm" style={{color: darkModeStyles.textSecondary}}>
                Welcome, {user.name || user.email}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 animate-in fade-in-50 duration-700">
        {/* Header with View Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{color: darkModeStyles.text}}>
              {viewMode === 'daily' ? 'Daily Overview' : 'Weekly Overview'}
            </h1>
            <p className="text-lg" style={{color: darkModeStyles.textSecondary}}>
              {viewMode === 'daily' 
                ? 'Your emotional patterns throughout the day' 
                : 'Your emotional patterns throughout the week'
              }
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex rounded-lg p-1" style={{backgroundColor: darkModeStyles.cardBackground}}>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'daily'
                  ? 'shadow-sm'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: viewMode === 'daily' ? darkModeStyles.background : 'transparent',
                color: viewMode === 'daily' ? darkModeStyles.text : darkModeStyles.textSecondary
              }}
            >
              <Calendar className="h-4 w-4 mr-2 inline" />
              Daily
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'weekly'
                  ? 'shadow-sm'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: viewMode === 'weekly' ? darkModeStyles.background : 'transparent',
                color: viewMode === 'weekly' ? darkModeStyles.text : darkModeStyles.textSecondary
              }}
            >
              <TrendingUp className="h-4 w-4 mr-2 inline" />
              Weekly
            </button>
          </div>
        </div>

        {/* Productivity Dashboard */}
        <div className="mb-12">
          <div className="rounded-lg p-8" style={{backgroundColor: darkModeStyles.cardBackground}}>
            <ProductivityDashboard 
              timeRangeData={timeRangeData} 
              isDarkMode={isDarkMode}
            />
            
            <p className="text-sm mt-6 text-center" style={{color: darkModeStyles.textSecondary}}>
              Sample data shown - Install the Chrome extension for real-time monitoring
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center group cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl font-bold mb-2 transition-all duration-500 group-hover:text-5xl" style={{color: '#677d61'}}>
              {emotionTotals.focused}
            </div>
            <div className="text-lg transition-all duration-300 group-hover:text-xl" style={{color: darkModeStyles.text}}>
              Focused
            </div>
            <div className="text-sm transition-all duration-300 group-hover:opacity-80" style={{color: darkModeStyles.textSecondary}}>
              {viewMode === 'daily' ? 'hours today' : 'hours this week'}
            </div>
          </div>
          
          <div className="text-center group cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl font-bold mb-2 transition-all duration-500 group-hover:text-5xl" style={{color: '#93a57b'}}>
              {emotionTotals.tired}
            </div>
            <div className="text-lg transition-all duration-300 group-hover:text-xl" style={{color: darkModeStyles.text}}>
              Tired
            </div>
            <div className="text-sm transition-all duration-300 group-hover:opacity-80" style={{color: darkModeStyles.textSecondary}}>
              {viewMode === 'daily' ? 'hours today' : 'hours this week'}
            </div>
          </div>
          
          <div className="text-center group cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl font-bold mb-2 transition-all duration-500 group-hover:text-5xl" style={{color: '#fffd7a'}}>
              {emotionTotals.stressed}
            </div>
            <div className="text-lg transition-all duration-300 group-hover:text-xl" style={{color: darkModeStyles.text}}>
              Stressed
            </div>
            <div className="text-sm transition-all duration-300 group-hover:opacity-80" style={{color: darkModeStyles.textSecondary}}>
              {viewMode === 'daily' ? 'hours today' : 'hours this week'}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Insights */}
          <div 
            className="transition-all duration-500 ease-out cursor-pointer group"
            style={{
              transform: hoveredSection === 'insights' ? 'scale(1.02)' : 'scale(1)',
              opacity: hoveredSection && hoveredSection !== 'insights' ? '0.6' : '1'
            }}
            onMouseEnter={() => setHoveredSection('insights')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full transition-all duration-300 group-hover:scale-110" style={{backgroundColor: '#677d61'}}>
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold ml-4 transition-all duration-300" style={{color: darkModeStyles.text}}>
                Insights
              </h2>
            </div>
            <div className="text-center py-16 transition-all duration-500 group-hover:py-20" style={{backgroundColor: darkModeStyles.cardBackground, borderRadius: '1rem'}}>
              <div className="transition-all duration-500 group-hover:scale-110">
                <Brain className="h-16 w-16 mx-auto mb-6 opacity-60" style={{color: '#677d61'}} />
                <p className="text-xl font-semibold mb-3" style={{color: darkModeStyles.text}}>Data Analysis</p>
                <p className="text-base" style={{color: darkModeStyles.textSecondary}}>
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
            className="transition-all duration-500 ease-out cursor-pointer group"
            style={{
              transform: hoveredSection === 'suggestions' ? 'scale(1.02)' : 'scale(1)',
              opacity: hoveredSection && hoveredSection !== 'suggestions' ? '0.6' : '1'
            }}
            onMouseEnter={() => setHoveredSection('suggestions')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full transition-all duration-300 group-hover:scale-110" style={{backgroundColor: '#93a57b'}}>
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold ml-4 transition-all duration-300" style={{color: darkModeStyles.text}}>
                Suggestions
              </h2>
            </div>
            <div className="text-center py-16 transition-all duration-500 group-hover:py-20" style={{backgroundColor: darkModeStyles.cardBackground, borderRadius: '1rem'}}>
              <div className="transition-all duration-500 group-hover:scale-110">
                <Clock className="h-16 w-16 mx-auto mb-6 opacity-60" style={{color: '#93a57b'}} />
                <p className="text-xl font-semibold mb-3" style={{color: darkModeStyles.text}}>Personalized Recommendations</p>
                <p className="text-base" style={{color: darkModeStyles.textSecondary}}>
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