'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Brain, Clock, Settings, Calendar, TrendingUp, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ProductivityDashboard from '@/components/ProductivityDashboard';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Generate time range data with emotion segments
  const generateTimeRangeData = () => {
    const timeRanges = [
      { name: 'Morning', period: '5 AM - 12 PM', hours: 7 },
      { name: 'Afternoon', period: '12 PM - 5 PM', hours: 5 },
      { name: 'Evening', period: '5 PM - 12 AM', hours: 7 },
      { name: 'Late Night', period: '12 AM - 5 AM', hours: 5 }
    ];
    
    return timeRanges.map(range => {
      const totalHours = range.hours;
      const focused = Math.floor(Math.random() * totalHours * 0.6) + 1;
      const remaining = totalHours - focused;
      const tired = Math.floor(Math.random() * remaining * 0.7) + 1;
      const stressed = remaining - tired;
      
      return {
        ...range,
        emotions: {
          focused: Math.max(0, focused),
          tired: Math.max(0, tired),
          stressed: Math.max(0, stressed)
        }
      };
    });
  };
  
  // Generate simple emotion totals for stats
  const generateEmotionTotals = () => {
    const timeData = generateTimeRangeData();
    const totals = { focused: 0, tired: 0, stressed: 0 };
    
    timeData.forEach(range => {
      totals.focused += range.emotions.focused;
      totals.tired += range.emotions.tired;
      totals.stressed += range.emotions.stressed;
    });
    
    return totals;
  };
  
  const [timeRangeData, setTimeRangeData] = useState(generateTimeRangeData());
  const [emotionTotals, setEmotionTotals] = useState(generateEmotionTotals());
  
  // Regenerate data when view mode changes
  useEffect(() => {
    const newTimeData = generateTimeRangeData();
    setTimeRangeData(newTimeData);
    
    const totals = { focused: 0, tired: 0, stressed: 0 };
    newTimeData.forEach(range => {
      totals.focused += range.emotions.focused;
      totals.tired += range.emotions.tired;
      totals.stressed += range.emotions.stressed;
    });
    setEmotionTotals(totals);
  }, [viewMode]);
  
  // Dark mode styles
  const darkModeStyles = {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#2c423f',
    textSecondary: isDarkMode ? '#a0a0a0' : '#93a57b',
    cardBackground: isDarkMode ? '#2d2d2d' : '#f8f9fa',
    border: isDarkMode ? '#404040' : '#93a57b',
    navBackground: isDarkMode ? '#2d2d2d' : '#ffffff'
  };
  return (
    <div className="min-h-screen transition-all duration-1000 ease-out" style={{backgroundColor: darkModeStyles.background}}>
      {/* Navigation Bar */}
      <nav className="shadow-sm border-b transition-all duration-500" style={{backgroundColor: darkModeStyles.navBackground, borderColor: darkModeStyles.border}}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <Link href="/" className="static-logo transition-all duration-300 hover:scale-105">
              <Logo variant="intention-ai" />
            </Link>
            
            {/* Right side - Navigation items and Dark Mode Toggle */}
            <div className="flex items-center space-x-6">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-12"
                style={{backgroundColor: darkModeStyles.cardBackground}}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 transition-all duration-300" style={{color: darkModeStyles.text}} />
                ) : (
                  <Moon className="h-5 w-5 transition-all duration-300" style={{color: darkModeStyles.text}} />
                )}
              </button>
              
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105" style={{color: darkModeStyles.text}}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105" style={{color: darkModeStyles.text}}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
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