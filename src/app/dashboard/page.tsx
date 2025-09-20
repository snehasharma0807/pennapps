'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Brain, Clock, Calendar, TrendingUp, Settings, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import LogoButton from '@/components/LogoButton';
import { motion } from 'framer-motion';
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

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Dark mode styles
  const darkModeStyles = {
    background: isDarkMode ? '#0f0f0f' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#2c423f',
    textSecondary: isDarkMode ? '#a0a0a0' : '#93a57b',
    cardBackground: isDarkMode ? '#1a1a1a' : '#f8f9fa',
    border: isDarkMode ? '#333333' : '#93a57b',
    navBackground: isDarkMode ? '#1a1a1a' : '#ffffff'
  };

  // Sample data for demonstration - changes based on view mode
  const dailyData = [
    { name: 'Morning', period: 'Morning', hours: 7, emotions: { focused: 5, tired: 1, stressed: 1 } },
    { name: 'Afternoon', period: 'Afternoon', hours: 5, emotions: { focused: 3, tired: 1, stressed: 1 } },
    { name: 'Evening', period: 'Evening', hours: 7, emotions: { focused: 3, tired: 3, stressed: 1 } },
    { name: 'Late Night', period: 'Late Night', hours: 5, emotions: { focused: 0, tired: 4, stressed: 1 } }
  ];

  const weeklyData = [
    { name: 'Morning', period: 'Morning', hours: 49, emotions: { focused: 35, tired: 10, stressed: 4 } },
    { name: 'Afternoon', period: 'Afternoon', hours: 35, emotions: { focused: 22, tired: 8, stressed: 5 } },
    { name: 'Evening', period: 'Evening', hours: 49, emotions: { focused: 20, tired: 22, stressed: 7 } },
    { name: 'Late Night', period: 'Late Night', hours: 35, emotions: { focused: 3, tired: 28, stressed: 4 } }
  ];

  // Select data based on view mode
  const timeRangeData = viewMode === 'daily' ? dailyData : weeklyData;
  
  // Calculate totals dynamically
  const emotionTotals = {
    focused: timeRangeData.reduce((sum, range) => sum + range.emotions.focused, 0),
    tired: timeRangeData.reduce((sum, range) => sum + range.emotions.tired, 0),
    stressed: timeRangeData.reduce((sum, range) => sum + range.emotions.stressed, 0)
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
    <div className="min-h-screen transition-all duration-1000 ease-out relative overflow-hidden" style={{backgroundColor: darkModeStyles.background}}>
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-50/20 pointer-events-none"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-yellow-400/30 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-green-400/50 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-32 left-1/2 w-2 h-2 bg-blue-400/20 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Navigation Bar */}
      <nav className="shadow-sm border-b transition-all duration-500 backdrop-blur-sm relative z-10" style={{backgroundColor: darkModeStyles.navBackground, borderColor: darkModeStyles.border}}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LogoButton size="md" isDarkMode={isDarkMode} />
              <h1 className="text-2xl font-bold" style={{color: darkModeStyles.text}}>Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="transition-all duration-300 hover:scale-110"
                style={{color: darkModeStyles.text}}
              >
                {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {isDarkMode ? 'Light' : 'Dark'}
              </Button>
              <Link href="/settings">
                <Button variant="ghost" size="sm" style={{color: darkModeStyles.text}}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 animate-in fade-in-50 duration-700 relative z-10">
        {/* Header with View Toggle */}
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h1 
              className="text-4xl font-bold transition-all duration-700 ease-out"
              style={{color: darkModeStyles.text}}
            >
              {viewMode === 'daily' ? 'Daily Overview' : 'Weekly Overview'}
            </h1>
            <p 
              className="text-lg transition-all duration-700 ease-out opacity-80" 
              style={{color: darkModeStyles.textSecondary}}
            >
              {viewMode === 'daily' 
                ? 'Your emotional patterns throughout the day' 
                : 'Your emotional patterns throughout the week'
              }
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex rounded-xl p-1 backdrop-blur-sm shadow-lg border transition-all duration-500" style={{backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}}>
            <motion.button
              onClick={() => setViewMode('daily')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-500 ease-out transform ${
                viewMode === 'daily' 
                  ? 'text-white shadow-xl scale-105' 
                  : 'hover:scale-102'
              }`}
              style={{
                backgroundColor: viewMode === 'daily' ? '#677d61' : 'transparent',
                color: viewMode === 'daily' ? '#ffffff' : (isDarkMode ? '#e5e5e5' : '#374151'),
                boxShadow: viewMode === 'daily' ? '0 10px 25px rgba(103, 125, 97, 0.3)' : 'none'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="h-4 w-4 mr-2 inline" style={{color: viewMode === 'daily' ? '#ffffff' : (isDarkMode ? '#e5e5e5' : '#374151')}} />
              Daily
            </motion.button>
            <motion.button
              onClick={() => setViewMode('weekly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-500 ease-out transform ${
                viewMode === 'weekly' 
                  ? 'text-white shadow-xl scale-105' 
                  : 'hover:scale-102'
              }`}
              style={{
                backgroundColor: viewMode === 'weekly' ? '#677d61' : 'transparent',
                color: viewMode === 'weekly' ? '#ffffff' : (isDarkMode ? '#e5e5e5' : '#374151'),
                boxShadow: viewMode === 'weekly' ? '0 10px 25px rgba(103, 125, 97, 0.3)' : 'none'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <TrendingUp className="h-4 w-4 mr-2 inline" style={{color: viewMode === 'weekly' ? '#ffffff' : (isDarkMode ? '#e5e5e5' : '#374151')}} />
              Weekly
            </motion.button>
          </div>
        </div>

        {/* Productivity Dashboard */}
        <div className="mb-16">
          <div className="rounded-2xl p-8 backdrop-blur-sm shadow-2xl border relative overflow-hidden" style={{backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}}>
            <div>
              <ProductivityDashboard 
                timeRangeData={timeRangeData} 
                isDarkMode={isDarkMode}
                viewMode={viewMode}
              />
              
              <p className="text-sm mt-8 text-center opacity-70" style={{color: darkModeStyles.textSecondary}}>
                Sample data shown - Install the Chrome extension for real-time monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center group cursor-pointer transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-3 backdrop-blur-sm rounded-2xl p-8 shadow-lg border hover:shadow-2xl" style={{backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}}>
            <div 
              className="text-5xl font-bold mb-3 transition-all duration-700 ease-out group-hover:text-6xl" 
              style={{color: '#677d61'}}
              key={`focused-${viewMode}`}
            >
              {Math.round(emotionTotals.focused)}
            </div>
            <div className="text-xl font-semibold transition-all duration-500 group-hover:text-2xl" style={{color: darkModeStyles.text}}>
              Focused
            </div>
            <div className="text-sm transition-all duration-500 group-hover:opacity-80 opacity-70" style={{color: darkModeStyles.textSecondary}}>
              {viewMode === 'daily' ? 'hours today' : 'hours this week'}
            </div>
          </div>
          
          <div className="text-center group cursor-pointer transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-3 backdrop-blur-sm rounded-2xl p-8 shadow-lg border hover:shadow-2xl" style={{backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}}>
            <div 
              className="text-5xl font-bold mb-3 transition-all duration-700 ease-out group-hover:text-6xl" 
              style={{color: '#93a57b'}}
              key={`tired-${viewMode}`}
            >
              {Math.round(emotionTotals.tired)}
            </div>
            <div className="text-xl font-semibold transition-all duration-500 group-hover:text-2xl" style={{color: darkModeStyles.text}}>
              Tired
            </div>
            <div className="text-sm transition-all duration-500 group-hover:opacity-80 opacity-70" style={{color: darkModeStyles.textSecondary}}>
              {viewMode === 'daily' ? 'hours today' : 'hours this week'}
            </div>
          </div>
          
          <div className="text-center group cursor-pointer transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-3 backdrop-blur-sm rounded-2xl p-8 shadow-lg border hover:shadow-2xl" style={{backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}}>
            <div 
              className="text-5xl font-bold mb-3 transition-all duration-700 ease-out group-hover:text-6xl" 
              style={{color: '#fffd7a'}}
              key={`stressed-${viewMode}`}
            >
              {Math.round(emotionTotals.stressed)}
            </div>
            <div className="text-xl font-semibold transition-all duration-500 group-hover:text-2xl" style={{color: darkModeStyles.text}}>
              Stressed
            </div>
            <div className="text-sm transition-all duration-500 group-hover:opacity-80 opacity-70" style={{color: darkModeStyles.textSecondary}}>
              {viewMode === 'daily' ? 'hours today' : 'hours this week'}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Insights */}
          <div 
            className="transition-all duration-700 ease-out cursor-pointer group"
            style={{
              transform: hoveredSection === 'insights' ? 'scale(1.02) translateY(-4px)' : 'scale(1)',
              opacity: hoveredSection && hoveredSection !== 'insights' ? '0.6' : '1'
            }}
            onMouseEnter={() => setHoveredSection('insights')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="flex items-center mb-8">
              <div className="p-4 rounded-2xl transition-all duration-500 group-hover:shadow-xl group-hover:scale-110" style={{backgroundColor: '#677d61'}}>
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold ml-6 transition-all duration-500" style={{color: darkModeStyles.text}}>
                Insights
              </h2>
            </div>
            <div className="text-center py-20 transition-all duration-500 group-hover:shadow-2xl backdrop-blur-sm rounded-2xl border relative overflow-hidden" style={{backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}}>
              <div className="transition-all duration-500 group-hover:opacity-90">
                <Brain className="h-20 w-20 mx-auto mb-8 opacity-60 transition-all duration-500 group-hover:scale-110" style={{color: '#677d61'}} />
                <p className="text-2xl font-bold mb-4" style={{color: darkModeStyles.text}}>Data Analysis</p>
                <p className="text-lg opacity-80" style={{color: darkModeStyles.textSecondary}}>
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
            className="transition-all duration-700 ease-out cursor-pointer group"
            style={{
              transform: hoveredSection === 'suggestions' ? 'scale(1.02) translateY(-4px)' : 'scale(1)',
              opacity: hoveredSection && hoveredSection !== 'suggestions' ? '0.6' : '1'
            }}
            onMouseEnter={() => setHoveredSection('suggestions')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="flex items-center mb-8">
              <div className="p-4 rounded-2xl transition-all duration-500 group-hover:shadow-xl group-hover:scale-110" style={{backgroundColor: '#93a57b'}}>
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold ml-6 transition-all duration-500" style={{color: darkModeStyles.text}}>
                Suggestions
              </h2>
            </div>
            <div className="text-center py-20 transition-all duration-500 group-hover:shadow-2xl backdrop-blur-sm rounded-2xl border relative overflow-hidden" style={{backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}}>
              <div className="transition-all duration-500 group-hover:opacity-90">
                <Clock className="h-20 w-20 mx-auto mb-8 opacity-60 transition-all duration-500 group-hover:scale-110" style={{color: '#93a57b'}} />
                <p className="text-2xl font-bold mb-4" style={{color: darkModeStyles.text}}>Personalized Recommendations</p>
                <p className="text-lg opacity-80" style={{color: darkModeStyles.textSecondary}}>
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