'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Brain, Clock, Calendar, TrendingUp, Settings } from 'lucide-react';
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
  const [emotionData, setEmotionData] = useState<any>(null);
  const [emotionLoading, setEmotionLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastDataFetch, setLastDataFetch] = useState<number>(0);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);


  // Initialize token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    console.log('🔐 Loading token from localStorage:', savedToken ? 'Token found' : 'No token');
    if (savedToken) {
      setToken(savedToken);
      console.log('🔐 Token set in state');
    }
  }, []);

  // Fetch emotion data from API
  const fetchEmotionData = async () => {
    console.log('🔄 fetchEmotionData called, token available:', !!token);
    if (!token) {
      console.log('❌ No token available for API call');
      return;
    }

    console.log('🔄 Starting emotion data fetch...');
    setIsRefreshing(true);
    setEmotionLoading(true);
    
    try {
      // Use incremental updates if we have existing data
      const url = emotionData && emotionData.events && emotionData.events.length > 0
        ? `/api/emotions?since=${emotionData.events[emotionData.events.length - 1].timestamp}`
        : '/api/emotions';
        
      console.log('🔄 Fetching from URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Fetched emotion data:', data);
        
        // Handle incremental updates - merge new events with existing data
        if (emotionData && data.events && data.events.length > 0) {
          // Merge new events with existing ones
          const existingEvents = emotionData.events || [];
          const newEvents = data.events.filter((newEvent: any) => 
            !existingEvents.some((existingEvent: any) => existingEvent._id === newEvent._id)
          );
          
          if (newEvents.length > 0) {
            console.log(`📊 Found ${newEvents.length} new emotion events!`);
            const updatedData = {
              ...data,
              events: [...existingEvents, ...newEvents].sort((a, b) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              )
            };
            
            // Recalculate analytics with all events grouped by time of day
            const allEvents = updatedData.events;
            const analytics = {
              morning: { focused: 0, tired: 0, stressed: 0 },
              afternoon: { focused: 0, tired: 0, stressed: 0 },
              evening: { focused: 0, tired: 0, stressed: 0 },
              late_night: { focused: 0, tired: 0, stressed: 0 }
            };

            allEvents.forEach((event: any) => {
              const timeOfDay = event.timeOfDay as keyof typeof analytics;
              const emotion = event.emotion as 'focused' | 'tired' | 'stressed';
              analytics[timeOfDay][emotion]++;
            });
            
            updatedData.analytics = analytics;
            setEmotionData(updatedData);
            setLastDataFetch(Date.now());
            console.log('✅ Emotion data updated with new events');
          } else {
            console.log('📊 No new events found');
          }
        } else if (!emotionData || (data.events && data.events.length > 0)) {
          // Initial load or full refresh
          console.log('📊 Setting initial/full emotion data...');
          setEmotionData(data);
          setLastDataFetch(Date.now());
          console.log('✅ Emotion data set in state');
        } else {
          console.log('📊 No emotion data available');
        }
      } else {
        console.error('❌ Failed to fetch emotion data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching emotion data:', error);
    } finally {
      setIsRefreshing(false);
      setEmotionLoading(false);
    }
  };

  // Generate AI insights from current data
  const generateAiInsights = async () => {
    if (!token) {
      alert('Please log in to generate insights');
      return;
    }

    if (!displayData.timeRangeData) {
      alert('No data available to generate insights');
      return;
    }

    setIsGeneratingInsights(true);
    try {
      console.log('🤖 Sending data to insights API:', displayData.timeRangeData);
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          timeRangeData: displayData.timeRangeData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(data.insights || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to generate insights: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      alert('Error generating insights. Please try again.');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const generateAiSuggestions = async () => {
    if (!token) {
      alert('Please log in to generate suggestions');
      return;
    }

    if (!displayData.timeRangeData) {
      alert('No data available to generate suggestions');
      return;
    }

    setIsGeneratingSuggestions(true);
    try {
      console.log('💡 Sending data to suggestions API:', displayData.timeRangeData);
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          timeRangeData: displayData.timeRangeData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to generate suggestions: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      alert('Error generating suggestions. Please try again.');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // Load emotion data on component mount
  useEffect(() => {
    if (token) {
      fetchEmotionData();
    }
  }, [token]);

  // Real-time data polling - fetch new emotion data every 5 seconds
  useEffect(() => {
    if (!token) return;

    console.log('🔄 Starting real-time emotion data polling...');
    
    const pollInterval = setInterval(() => {
      console.log('🔄 Polling for new emotion data...');
      fetchEmotionData();
    }, 5000); // Poll every 5 seconds

    // Cleanup interval on unmount or token change
    return () => {
      console.log('🔄 Stopping real-time emotion data polling...');
      clearInterval(pollInterval);
    };
  }, [token]);


  // Use real data if available, otherwise use sample data
  const displayData = useMemo(() => {
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

    console.log('🔄 Processing real emotion data:', emotionData);
    const { analytics, events } = emotionData;
    
    // Calculate total detections across all time periods
    const totalDetections = analytics.morning.focused + analytics.morning.tired + analytics.morning.stressed +
                           analytics.afternoon.focused + analytics.afternoon.tired + analytics.afternoon.stressed +
                           analytics.evening.focused + analytics.evening.tired + analytics.evening.stressed +
                           analytics.late_night.focused + analytics.late_night.tired + analytics.late_night.stressed;
    
    // Convert to percentages (assuming 100% = 8 hours of total activity time for visualization)
    const convertToPercentage = (detections: number) => {
      if (totalDetections === 0) return 0;
      return Math.round((detections / totalDetections) * 100);
    };
    
    // Calculate bar heights as percentages for each time period
    const timeRangeData = [
      { 
        name: 'Morning', 
        period: 'Morning', 
        hours: convertToPercentage(analytics.morning.focused + analytics.morning.tired + analytics.morning.stressed),
        emotions: {
          focused: convertToPercentage(analytics.morning.focused),
          tired: convertToPercentage(analytics.morning.tired),
          stressed: convertToPercentage(analytics.morning.stressed)
        }
      },
      { 
        name: 'Afternoon', 
        period: 'Afternoon', 
        hours: convertToPercentage(analytics.afternoon.focused + analytics.afternoon.tired + analytics.afternoon.stressed),
        emotions: {
          focused: convertToPercentage(analytics.afternoon.focused),
          tired: convertToPercentage(analytics.afternoon.tired),
          stressed: convertToPercentage(analytics.afternoon.stressed)
        }
      },
      { 
        name: 'Evening', 
        period: 'Evening', 
        hours: convertToPercentage(analytics.evening.focused + analytics.evening.tired + analytics.evening.stressed),
        emotions: {
          focused: convertToPercentage(analytics.evening.focused),
          tired: convertToPercentage(analytics.evening.tired),
          stressed: convertToPercentage(analytics.evening.stressed)
        }
      },
      { 
        name: 'Late Night', 
        period: 'Late Night', 
        hours: convertToPercentage(analytics.late_night.focused + analytics.late_night.tired + analytics.late_night.stressed),
        emotions: {
          focused: convertToPercentage(analytics.late_night.focused),
          tired: convertToPercentage(analytics.late_night.tired),
          stressed: convertToPercentage(analytics.late_night.stressed)
        }
      },
    ];

    // Calculate emotion totals as percentages of total detections
    const totalFocused = analytics.morning.focused + analytics.afternoon.focused + analytics.evening.focused + analytics.late_night.focused;
    const totalTired = analytics.morning.tired + analytics.afternoon.tired + analytics.evening.tired + analytics.late_night.tired;
    const totalStressed = analytics.morning.stressed + analytics.afternoon.stressed + analytics.evening.stressed + analytics.late_night.stressed;
    
    const emotionTotals = {
      focused: totalDetections > 0 ? Math.round((totalFocused / totalDetections) * 100) : 0,
      tired: totalDetections > 0 ? Math.round((totalTired / totalDetections) * 100) : 0,
      stressed: totalDetections > 0 ? Math.round((totalStressed / totalDetections) * 100) : 0,
    };

    console.log('🔄 Processed timeRangeData:', timeRangeData);
    console.log('🔄 Processed emotionTotals:', emotionTotals);

    return { timeRangeData, emotionTotals };
  }, [emotionData]);

  // Light mode styles with softer greys
  const styles = {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    text: '#2c423f',
    textSecondary: '#93a57b',
    cardBackground: 'rgba(255, 255, 255, 0.8)',
    border: '#93a57b',
    navBackground: 'rgba(255, 255, 255, 0.9)'
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
    <div className="min-h-screen transition-all duration-1000 ease-out relative overflow-hidden" style={{backgroundImage: styles.background}}>
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
      <nav className="shadow-sm border-b transition-all duration-500 backdrop-blur-sm relative z-10" style={{backgroundColor: styles.navBackground, borderColor: styles.border}}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LogoButton size="md" isDarkMode={false} />
              <h1 className="text-2xl font-bold" style={{color: styles.text}}>Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/settings">
                <Button variant="ghost" size="sm" style={{color: styles.text}}>
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
              style={{color: styles.text}}
            >
              {viewMode === 'daily' ? 'Daily Overview' : 'Weekly Overview'}
            </h1>
            <p 
              className="text-lg transition-all duration-700 ease-out opacity-80" 
              style={{color: styles.textSecondary}}
            >
              {viewMode === 'daily' 
                ? 'Your emotional patterns throughout the day' 
                : 'Your emotional patterns throughout the week'
              }
            </p>
          </div>
          
           {/* Enhanced View Toggle */}
           <div className="relative">
             {/* Animated background */}
             <motion.div
               className="absolute inset-0 rounded-2xl opacity-20"
               style={{
                 backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
               }}
               animate={{
                 backgroundImage: [
                   'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                   'linear-gradient(135deg, #f093fb 0%, #667eea 50%, #764ba2 100%)',
                   'linear-gradient(135deg, #764ba2 0%, #f093fb 50%, #667eea 100%)',
                   'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
                 ]
               }}
               transition={{
                 duration: 8,
                 repeat: Infinity,
                 ease: "linear"
               }}
             />
             
             <div className="relative flex rounded-2xl p-2 backdrop-blur-md shadow-2xl border transition-all duration-500" 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}>
               <motion.button
                 onClick={() => setViewMode('daily')}
                 className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-500 ease-out overflow-hidden ${
                   viewMode === 'daily' 
                     ? 'text-white' 
                     : 'hover:text-white'
                 }`}
                 style={{
                   backgroundColor: viewMode === 'daily' 
                     ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                     : 'transparent',
                   color: viewMode === 'daily' ? '#ffffff' : '#374151'
                 }}
                 whileHover={{ 
                   scale: 1.05,
                   y: -2
                 }}
                 whileTap={{ scale: 0.95 }}
                 transition={{ type: "spring", stiffness: 400, damping: 17 }}
               >
                 {/* Button background gradient */}
                 {viewMode === 'daily' && (
                   <motion.div
                     className="absolute inset-0 rounded-xl"
                     style={{
                       backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                     }}
                     layoutId="activeTab"
                     transition={{ type: "spring", stiffness: 400, damping: 30 }}
                   />
                 )}
                 
                 {/* Hover effect */}
                 <motion.div
                   className="absolute inset-0 rounded-xl opacity-0"
                   style={{
                     backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                   }}
                   whileHover={{ opacity: 0.8 }}
                   transition={{ duration: 0.3 }}
                 />
                 
                 <div className="relative z-10 flex items-center">
                   <motion.div
                     animate={viewMode === 'daily' ? { rotate: 360 } : { rotate: 0 }}
                     transition={{ duration: 0.5 }}
                   >
                     <Calendar className="h-5 w-5 mr-3" />
                   </motion.div>
                   <span className="text-lg">Daily</span>
                 </div>
                 
                 {/* Sparkle effect */}
                 {viewMode === 'daily' && (
                   <motion.div
                     className="absolute top-1 right-1 w-2 h-2 rounded-full"
                     style={{ background: '#ffffff' }}
                     animate={{
                       scale: [1, 1.5, 1],
                       opacity: [0.5, 1, 0.5]
                     }}
                     transition={{
                       duration: 1.5,
                       repeat: Infinity,
                       repeatType: "reverse"
                     }}
                   />
                 )}
               </motion.button>
               
               <motion.button
                 onClick={() => setViewMode('weekly')}
                 className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-500 ease-out overflow-hidden ${
                   viewMode === 'weekly' 
                     ? 'text-white' 
                     : 'hover:text-white'
                 }`}
                 style={{
                   backgroundColor: viewMode === 'weekly' 
                     ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                     : 'transparent',
                   color: viewMode === 'weekly' ? '#ffffff' : '#374151'
                 }}
                 whileHover={{ 
                   scale: 1.05,
                   y: -2
                 }}
                 whileTap={{ scale: 0.95 }}
                 transition={{ type: "spring", stiffness: 400, damping: 17 }}
               >
                 {/* Button background gradient */}
                 {viewMode === 'weekly' && (
                   <motion.div
                     className="absolute inset-0 rounded-xl"
                     style={{
                       backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                     }}
                     layoutId="activeTab"
                     transition={{ type: "spring", stiffness: 400, damping: 30 }}
                   />
                 )}
                 
                 {/* Hover effect */}
                 <motion.div
                   className="absolute inset-0 rounded-xl opacity-0"
                   style={{
                     backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                   }}
                   whileHover={{ opacity: 0.8 }}
                   transition={{ duration: 0.3 }}
                 />
                 
                 <div className="relative z-10 flex items-center">
                   <motion.div
                     animate={viewMode === 'weekly' ? { rotate: 360 } : { rotate: 0 }}
                     transition={{ duration: 0.5 }}
                   >
                     <TrendingUp className="h-5 w-5 mr-3" />
                   </motion.div>
                   <span className="text-lg">Weekly</span>
                 </div>
                 
                 {/* Sparkle effect */}
                 {viewMode === 'weekly' && (
                   <motion.div
                     className="absolute top-1 right-1 w-2 h-2 rounded-full"
                     style={{ background: '#ffffff' }}
                     animate={{
                       scale: [1, 1.5, 1],
                       opacity: [0.5, 1, 0.5]
                     }}
                     transition={{
                       duration: 1.5,
                       repeat: Infinity,
                       repeatType: "reverse"
                     }}
                   />
                 )}
               </motion.button>
             </div>
           </div>
        </div>

        {/* Productivity Dashboard */}
        <div className="mb-16">
          <div className="rounded-2xl p-8 backdrop-blur-sm shadow-2xl border relative overflow-hidden" style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(255, 255, 255, 0.3)'}}>
            <div>
               <ProductivityDashboard 
                 timeRangeData={displayData.timeRangeData} 
                 viewMode={viewMode}
               />
              
              <p className="text-sm mt-8 text-center opacity-70" style={{color: styles.textSecondary}}>
                Sample data shown - Install the Chrome extension for real-time monitoring
              </p>
            </div>
          </div>
        </div>

         {/* Enhanced Stats Grid - Removed */}

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
              <h2 className="text-3xl font-bold ml-6 transition-all duration-500" style={{color: styles.text}}>
                Insights
              </h2>
            </div>
             <div className="transition-all duration-500 group-hover:shadow-2xl backdrop-blur-sm rounded-2xl border relative overflow-hidden" style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(255, 255, 255, 0.3)'}}>
               {aiInsights.length > 0 ? (
                 <div className="p-8">
                   <div className="flex items-center justify-center mb-6">
                     <Brain className="h-8 w-8 mr-3" style={{color: '#677d61'}} />
                     <p className="text-xl font-bold" style={{color: styles.text}}>AI-Generated Insights</p>
                   </div>
                   <div className="space-y-4">
                     {aiInsights.map((insight, index) => (
                       <div key={index} className="p-4 rounded-lg border" style={{backgroundColor: 'rgba(103, 125, 97, 0.05)', borderColor: 'rgba(103, 125, 97, 0.2)'}}>
                         <p className="text-sm font-medium" style={{color: styles.text}}>
                           {insight}
                         </p>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-20 transition-all duration-500 group-hover:opacity-90">
                   <Brain className="h-20 w-20 mx-auto mb-8 opacity-60 transition-all duration-500 group-hover:scale-110" style={{color: '#677d61'}} />
                   <p className="text-2xl font-bold mb-4" style={{color: styles.text}}>Data Analysis</p>
                   <p className="text-lg opacity-80" style={{color: styles.textSecondary}}>
                     {viewMode === 'daily' 
                       ? 'Analyzing your daily emotional patterns and productivity trends' 
                       : 'Analyzing your weekly emotional patterns and productivity trends'
                     }
                   </p>
                 </div>
               )}
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
              <h2 className="text-3xl font-bold ml-6 transition-all duration-500" style={{color: styles.text}}>
                Suggestions
              </h2>
            </div>
             <div className="transition-all duration-500 group-hover:shadow-2xl backdrop-blur-sm rounded-2xl border relative overflow-hidden" style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(255, 255, 255, 0.3)'}}>
               {aiSuggestions.length > 0 ? (
                 <div className="p-8">
                   <div className="flex items-center justify-center mb-6">
                     <Clock className="h-8 w-8 mr-3" style={{color: '#93a57b'}} />
                     <p className="text-xl font-bold" style={{color: styles.text}}>AI-Generated Suggestions</p>
                   </div>
                   <div className="space-y-4">
                     {aiSuggestions.map((suggestion, index) => (
                       <div key={index} className="p-4 rounded-lg border" style={{backgroundColor: 'rgba(147, 165, 123, 0.05)', borderColor: 'rgba(147, 165, 123, 0.2)'}}>
                         <p className="text-sm font-medium" style={{color: styles.text}}>
                           {suggestion}
                         </p>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-20 transition-all duration-500 group-hover:opacity-90">
                   <Clock className="h-20 w-20 mx-auto mb-8 opacity-60 transition-all duration-500 group-hover:scale-110" style={{color: '#93a57b'}} />
                   <p className="text-2xl font-bold mb-4" style={{color: styles.text}}>Personalized Recommendations</p>
                   <p className="text-lg opacity-80" style={{color: styles.textSecondary}}>
                     {viewMode === 'daily' 
                       ? 'Get daily tips to optimize your productivity and well-being' 
                       : 'Get weekly recommendations to improve your work-life balance'
                     }
                   </p>
                 </div>
               )}
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

        {/* Enhanced AI Generation Buttons */}
        <div className="mb-8">
          <div className="flex justify-center gap-6">
            {/* AI Insights Button */}
            <motion.button
              onClick={generateAiInsights}
              disabled={isGeneratingInsights || !token || !emotionData}
              className={`relative overflow-hidden px-8 py-5 rounded-2xl font-semibold transition-all duration-500 ease-out transform ${
                isGeneratingInsights || !token || !emotionData
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              whileHover={!isGeneratingInsights && token && emotionData ? { 
                scale: 1.05,
                y: -3
              } : {}}
              whileTap={!isGeneratingInsights && token && emotionData ? { scale: 0.95 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              style={{
                backgroundImage: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)',
                color: '#ffffff',
                boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
              title={!token ? 'Please login to generate insights' : !emotionData ? 'No data available for insights' : 'Generate AI-powered insights from your productivity data'}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 opacity-0"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #c084fc 0%, #8b5cf6 50%, #a855f7 100%)'
                }}
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Sparkle effect */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <div className="relative z-10 flex items-center">
                <motion.div
                  animate={isGeneratingInsights ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isGeneratingInsights ? Infinity : 0 }}
                >
                  <Brain className="h-6 w-6 mr-4" />
                </motion.div>
                <span className="text-lg">
                  {isGeneratingInsights ? 'Generating Insights...' : 'Generate AI Insights'}
                </span>
              </div>
              
              {/* Loading animation */}
              {isGeneratingInsights && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </motion.button>
            
            {/* AI Suggestions Button */}
            <motion.button
              onClick={generateAiSuggestions}
              disabled={isGeneratingSuggestions || !token || !emotionData}
              className={`relative overflow-hidden px-8 py-5 rounded-2xl font-semibold transition-all duration-500 ease-out transform ${
                isGeneratingSuggestions || !token || !emotionData
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              whileHover={!isGeneratingSuggestions && token && emotionData ? { 
                scale: 1.05,
                y: -3
              } : {}}
              whileTap={!isGeneratingSuggestions && token && emotionData ? { scale: 0.95 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              style={{
                backgroundImage: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
                color: '#ffffff',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
              title={!token ? 'Please login to generate suggestions' : !emotionData ? 'No data available for suggestions' : 'Generate AI-powered suggestions to improve your workflow'}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 opacity-0"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #6ee7b7 0%, #10b981 50%, #34d399 100%)'
                }}
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Sparkle effect */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <div className="relative z-10 flex items-center">
                <motion.div
                  animate={isGeneratingSuggestions ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isGeneratingSuggestions ? Infinity : 0 }}
                >
                  <Clock className="h-6 w-6 mr-4" />
                </motion.div>
                <span className="text-lg">
                  {isGeneratingSuggestions ? 'Generating Suggestions...' : 'Generate AI Suggestions'}
                </span>
              </div>
              
              {/* Loading animation */}
              {isGeneratingSuggestions && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}