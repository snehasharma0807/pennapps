import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertTriangle, Lightbulb, CheckCircle, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeRangeData {
  name: string;
  period: string;
  hours: number;
  emotions: {
    focused: number;
    tired: number;
    stressed: number;
  };
}

interface ProductivityDashboardProps {
  timeRangeData: TimeRangeData[];
  viewMode?: 'daily' | 'weekly';
}

interface Insight {
  type: 'positive' | 'warning' | 'tip';
  icon: React.ReactNode;
  text: string;
}

const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({ 
  timeRangeData, 
  viewMode = 'daily'
}) => {
  const [hoveredPeriod, setHoveredPeriod] = useState<string | null>(null);
  // Generate insights from the data
  const generateInsights = (data: TimeRangeData[]): Insight[] => {
    const insights: Insight[] = [];
    
    // Calculate totals and check if we have enough data
    const totals = data.reduce((acc, range) => {
      acc.focused += range.emotions.focused;
      acc.tired += range.emotions.tired;
      acc.stressed += range.emotions.stressed;
      return acc;
    }, { focused: 0, tired: 0, stressed: 0 });
    
    const totalDetections = totals.focused + totals.tired + totals.stressed;
    
    // Only generate insights if we have meaningful data (at least 10 total detections)
    if (totalDetections < 10) {
      return [{
        type: 'tip',
        icon: <Lightbulb className="h-5 w-5" />,
        text: "Keep using the extension to collect more data for meaningful insights!"
      }];
    }
    
    // Calculate overall percentages
    const focusedPercentage = Math.round((totals.focused / totalDetections) * 100);
    const stressedPercentage = Math.round((totals.stressed / totalDetections) * 100);
    const tiredPercentage = Math.round((totals.tired / totalDetections) * 100);
    
    // Find most and least focused periods (using actual percentages from data)
    const focusedByPeriod = data.map(range => ({
      name: range.name,
      focused: range.emotions.focused,
      total: range.emotions.focused + range.emotions.tired + range.emotions.stressed,
      percentage: range.emotions.focused + range.emotions.tired + range.emotions.stressed > 0 
        ? Math.round((range.emotions.focused / (range.emotions.focused + range.emotions.tired + range.emotions.stressed)) * 100)
        : 0
    }));
    
    // Only consider periods with actual data
    const periodsWithData = focusedByPeriod.filter(p => p.total > 0);
    
    if (periodsWithData.length >= 2) {
      const mostFocused = periodsWithData.reduce((max, current) => 
        current.percentage > max.percentage ? current : max
      );
      
      const leastFocused = periodsWithData.reduce((min, current) => 
        current.percentage < min.percentage ? current : min
      );
      
      // Only show focus comparison if there's a meaningful difference (at least 15%)
      if (mostFocused.percentage - leastFocused.percentage >= 15) {
        const difference = mostFocused.percentage - leastFocused.percentage;
        insights.push({
          type: 'positive',
          icon: <CheckCircle className="h-5 w-5" />,
          text: `You're ${difference}% more focused in the ${mostFocused.name.toLowerCase()} (${mostFocused.percentage}%) compared to ${leastFocused.name.toLowerCase()} (${leastFocused.percentage}%).`
        });
      }
    }
    
    // Stress insights - only if stress is significantly high
    if (stressedPercentage >= 35) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-5 w-5" />,
        text: `High stress levels detected (${stressedPercentage}%). Consider taking more breaks or adjusting your workload.`
      });
    }
    
    // Focus insights - only if focus is significantly high or low
    if (focusedPercentage >= 60) {
      insights.push({
        type: 'positive',
        icon: <TrendingUp className="h-5 w-5" />,
        text: `Excellent focus! You're focused ${focusedPercentage}% of the time.`
      });
    } else if (focusedPercentage <= 25) {
      insights.push({
        type: 'tip',
        icon: <Lightbulb className="h-5 w-5" />,
        text: `Focus could be improved (${focusedPercentage}%). Try minimizing distractions during work sessions.`
      });
    }
    
    // Tiredness insights - only if tiredness is significantly high
    if (tiredPercentage >= 40) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-5 w-5" />,
        text: `High fatigue detected (${tiredPercentage}%). Consider taking more frequent breaks or adjusting your schedule.`
      });
    }
    
    // Only show default message if no meaningful insights were generated
    if (insights.length === 0) {
      insights.push({
        type: 'tip',
        icon: <Lightbulb className="h-5 w-5" />,
        text: "Your productivity patterns look balanced. Keep tracking to identify trends over time!"
      });
    }
    
    return insights;
  };
  
  const insights = generateInsights(timeRangeData);
  
  const getInsightStyles = (type: 'positive' | 'warning' | 'tip') => {
    const baseStyles = "flex items-start space-x-3 p-4 rounded-lg";
    
    switch (type) {
      case 'positive':
        return `${baseStyles} bg-green-50 border border-green-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border border-yellow-200`;
      case 'tip':
        return `${baseStyles} bg-blue-50 border border-blue-200`;
      default:
        return baseStyles;
    }
  };
  
  const getInsightIconColor = (type: 'positive' | 'warning' | 'tip') => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'tip':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Heatmap Chart */}
      <div>
        <h3 className="text-2xl font-bold mb-6" style={{color: '#2c423f'}}>
          Productivity Heatmap
        </h3>
        
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-6"
            >
              {timeRangeData.map((range, index) => {
            const totalHours = range.hours;
            const { focused, tired, stressed } = range.emotions;
            const isHovered = hoveredPeriod === range.name;
            const isOtherHovered = hoveredPeriod && hoveredPeriod !== range.name;
            
            return (
              <motion.div 
                key={`${range.name}-${viewMode}`}
                className={`space-y-3 transition-all duration-500 ease-out cursor-pointer ${
                  isHovered ? 'transform scale-105' : ''
                }`}
                style={{
                  opacity: isOtherHovered ? 0.3 : 1,
                  filter: isOtherHovered ? 'blur(1px)' : 'none'
                }}
                onMouseEnter={() => setHoveredPeriod(range.name)}
                onMouseLeave={() => setHoveredPeriod(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center">
                  <h4 className={`font-semibold transition-all duration-300 ${
                    isHovered ? 'text-lg' : 'text-base'
                  }`} style={{color: '#2c423f'}}>
                    {range.name}
                  </h4>
                </div>
                
                {/* Heatmap Bar */}
                <div className={`relative rounded-lg overflow-hidden shadow-lg transition-all duration-500 ease-out ${
                  isHovered ? 'h-16 shadow-2xl' : 'h-12'
                }`} style={{backgroundColor: '#f3f4f6'}}>
                  {/* Focused Segment */}
                  <motion.div 
                    key={`focused-${range.name}-${viewMode}`}
                    className="absolute left-0 top-0 h-full flex items-center justify-center text-white text-xs font-medium hover:opacity-90"
                    style={{
                      width: `${(focused / totalHours) * 100}%`,
                      backgroundColor: '#677d61', // Our green
                    }}
                    title={`Focused: ${Math.round(focused)}h`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(focused / totalHours) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: "easeOut" }}
                  >
                    {focused > 0 && focused >= 1.5 && `${Math.round(focused)}h`}
                  </motion.div>
                  
                  {/* Tired Segment */}
                  <motion.div 
                    key={`tired-${range.name}-${viewMode}`}
                    className="absolute top-0 h-full flex items-center justify-center text-white text-xs font-medium hover:opacity-90"
                    style={{
                      left: `${(focused / totalHours) * 100}%`,
                      width: `${(tired / totalHours) * 100}%`,
                      backgroundColor: '#93a57b', // Our medium green
                    }}
                    title={`Tired: ${Math.round(tired)}h`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(tired / totalHours) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                  >
                    {tired > 0 && tired >= 1.5 && `${Math.round(tired)}h`}
                  </motion.div>
                  
                  {/* Stressed Segment */}
                  <motion.div 
                    key={`stressed-${range.name}-${viewMode}`}
                    className="absolute top-0 h-full flex items-center justify-center text-black text-xs font-medium hover:opacity-90"
                    style={{
                      left: `${((focused + tired) / totalHours) * 100}%`,
                      width: `${(stressed / totalHours) * 100}%`,
                      backgroundColor: '#fffd7a', // Our yellow
                    }}
                    title={`Stressed: ${Math.round(stressed)}h`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stressed / totalHours) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.4, ease: "easeOut" }}
                  >
                    {stressed > 0 && stressed >= 1.5 && `${Math.round(stressed)}h`}
                  </motion.div>
                </div>
                
                {/* Mini Legend */}
                <div className={`flex justify-between text-xs transition-all duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-70'
                }`} style={{color: '#93a57b'}}>
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded transition-all duration-300" style={{backgroundColor: '#677d61'}}></div>
                    <span>Focused: {Math.round(focused)}h</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded transition-all duration-300" style={{backgroundColor: '#93a57b'}}></div>
                    <span>Tired: {Math.round(tired)}h</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded transition-all duration-300" style={{backgroundColor: '#fffd7a'}}></div>
                    <span>Stressed: {Math.round(stressed)}h</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Insights Panel */}
      <div>
        <h3 className="text-2xl font-bold mb-6" style={{color: '#2c423f'}}>
          Your Productivity Highlights
        </h3>
        
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={getInsightStyles(insight.type)}>
              <div className={`flex-shrink-0 ${getInsightIconColor(insight.type)}`}>
                {insight.icon}
              </div>
              <p className="text-sm font-medium" style={{color: '#2c423f'}}>
                {insight.text}
              </p>
            </div>
          ))}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-8 p-8 rounded-lg" style={{backgroundColor: isDarkMode ? '#2d2d2d' : '#f8f9fa'}}>
          <h4 className="text-xl font-semibold mb-8 text-center" style={{color: isDarkMode ? '#ffffff' : '#2c423f'}}>
            Quick Summary
          </h4>
        <div className="grid grid-cols-3 gap-8 text-center">
          <div className="transition-all duration-1000 ease-out hover:scale-110">
            <div 
              className="text-4xl font-bold mb-2 transition-all duration-1000 ease-out" 
              style={{color: '#677d61'}}
              key={`focused-summary-${viewMode}`}
            >
              {Math.round(timeRangeData.reduce((sum, range) => sum + range.emotions.focused, 0))}
            </div>
            <div className="text-sm font-medium" style={{color: isDarkMode ? '#a0a0a0' : '#93a57b'}}>
              Focused Hours
            </div>
          </div>
          <div className="transition-all duration-1000 ease-out hover:scale-110">
            <div 
              className="text-4xl font-bold mb-2 transition-all duration-1000 ease-out" 
              style={{color: '#93a57b'}}
              key={`tired-summary-${viewMode}`}
            >
              {Math.round(timeRangeData.reduce((sum, range) => sum + range.emotions.tired, 0))}
            </div>
            <div className="text-sm font-medium" style={{color: isDarkMode ? '#a0a0a0' : '#93a57b'}}>
              Tired Hours
            </div>
          </div>
          <div className="transition-all duration-1000 ease-out hover:scale-110">
            <div 
              className="text-4xl font-bold mb-2 transition-all duration-1000 ease-out" 
              style={{color: '#fffd7a'}}
              key={`stressed-summary-${viewMode}`}
            >
              {Math.round(timeRangeData.reduce((sum, range) => sum + range.emotions.stressed, 0))}
            </div>
            <div className="text-sm font-medium" style={{color: isDarkMode ? '#a0a0a0' : '#93a57b'}}>
              Stressed Hours
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityDashboard;
