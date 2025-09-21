import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Lightbulb, CheckCircle, Brain } from 'lucide-react';

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
  isDarkMode?: boolean;
  viewMode?: 'daily' | 'weekly';
}

interface Insight {
  type: 'positive' | 'warning' | 'tip';
  icon: React.ReactNode;
  text: string;
}

const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({ 
  timeRangeData, 
  isDarkMode = false,
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
        return `${baseStyles} ${isDarkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`;
      case 'warning':
        return `${baseStyles} ${isDarkMode ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`;
      case 'tip':
        return `${baseStyles} ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`;
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
    <div key={`dashboard-${viewMode}`} className="grid lg:grid-cols-2 gap-8">
      {/* Heatmap Chart */}
      <div>
        <h3 className="text-2xl font-bold mb-6" style={{color: isDarkMode ? '#ffffff' : '#2c423f'}}>
          Productivity Heatmap
        </h3>
        
        <div className="space-y-6">
          {timeRangeData.map((range, index) => {
            const totalHours = range.hours;
            const { focused, tired, stressed } = range.emotions;
            const isHovered = hoveredPeriod === range.name;
            const isOtherHovered = hoveredPeriod && hoveredPeriod !== range.name;
            
            return (
              <div 
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
              >
                <div className="flex justify-between items-center">
                  <h4 className={`font-semibold transition-all duration-300 ${
                    isHovered ? 'text-lg' : 'text-base'
                  }`} style={{color: isDarkMode ? '#ffffff' : '#2c423f'}}>
                    {range.name}
                  </h4>
                </div>
                
                {/* Heatmap Bar */}
                <div className={`relative rounded-lg overflow-hidden shadow-lg transition-all duration-500 ease-out ${
                  isHovered ? 'h-16 shadow-2xl' : 'h-12'
                }`} style={{backgroundColor: isDarkMode ? '#374151' : '#f3f4f6'}}>
                  {/* Focused Segment */}
                  <div 
                    key={`focused-${range.name}-${viewMode}`}
                    className="absolute left-0 top-0 h-full flex items-center justify-center text-white text-xs font-medium hover:opacity-90"
                    style={{
                      width: `${totalHours > 0 ? (focused / totalHours) * 100 : 0}%`,
                      backgroundColor: '#677d61', // Our green
                      transition: 'width 1000ms ease-out, left 1000ms ease-out'
                    }}
                    title={`Focused: ${Math.round(focused)}%`}
                  >
                    {focused > 0 && `${Math.round(focused)}%`}
                  </div>
                  
                  {/* Tired Segment */}
                  <div 
                    key={`tired-${range.name}-${viewMode}`}
                    className="absolute top-0 h-full flex items-center justify-center text-white text-xs font-medium hover:opacity-90"
                    style={{
                      left: `${totalHours > 0 ? (focused / totalHours) * 100 : 0}%`,
                      width: `${totalHours > 0 ? (tired / totalHours) * 100 : 0}%`,
                      backgroundColor: '#93a57b', // Our medium green
                      transition: 'width 1000ms ease-out, left 1000ms ease-out'
                    }}
                    title={`Tired: ${Math.round(tired)}%`}
                  >
                    {tired > 0 && `${Math.round(tired)}%`}
                  </div>
                  
                  {/* Stressed Segment */}
                  <div 
                    key={`stressed-${range.name}-${viewMode}`}
                    className="absolute top-0 h-full flex items-center justify-center text-black text-xs font-medium hover:opacity-90"
                    style={{
                      left: `${totalHours > 0 ? ((focused + tired) / totalHours) * 100 : 0}%`,
                      width: `${totalHours > 0 ? (stressed / totalHours) * 100 : 0}%`,
                      backgroundColor: '#fffd7a', // Our yellow
                      transition: 'width 1000ms ease-out, left 1000ms ease-out'
                    }}
                    title={`Stressed: ${Math.round(stressed)}%`}
                  >
                    {stressed > 0 && `${Math.round(stressed)}%`}
                  </div>
                </div>
                
                {/* Mini Legend */}
                <div className={`flex justify-between text-xs transition-all duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-70'
                }`} style={{color: isDarkMode ? '#a0a0a0' : '#93a57b'}}>
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded transition-all duration-300" style={{backgroundColor: '#677d61'}}></div>
                    <span>Focused: {Math.round(focused)}%</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded transition-all duration-300" style={{backgroundColor: '#93a57b'}}></div>
                    <span>Tired: {Math.round(tired)}%</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded transition-all duration-300" style={{backgroundColor: '#fffd7a'}}></div>
                    <span>Stressed: {Math.round(stressed)}%</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Insights Panel */}
      <div>
        <h3 className="text-2xl font-bold mb-6" style={{color: isDarkMode ? '#ffffff' : '#2c423f'}}>
          Your Productivity Highlights
        </h3>
        
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={getInsightStyles(insight.type)}>
              <div className={`flex-shrink-0 ${getInsightIconColor(insight.type)}`}>
                {insight.icon}
              </div>
              <p className="text-sm font-medium" style={{color: isDarkMode ? '#ffffff' : '#2c423f'}}>
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductivityDashboard;
