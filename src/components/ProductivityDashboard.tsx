import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';

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
}

interface Insight {
  type: 'positive' | 'warning' | 'tip';
  icon: React.ReactNode;
  text: string;
}

const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({ 
  timeRangeData, 
  isDarkMode = false 
}) => {
  const [hoveredPeriod, setHoveredPeriod] = useState<string | null>(null);
  // Generate insights from the data
  const generateInsights = (data: TimeRangeData[]): Insight[] => {
    const insights: Insight[] = [];
    
    // Calculate totals and percentages
    const totals = data.reduce((acc, range) => {
      acc.focused += range.emotions.focused;
      acc.tired += range.emotions.tired;
      acc.stressed += range.emotions.stressed;
      return acc;
    }, { focused: 0, tired: 0, stressed: 0 });
    
    const totalHours = totals.focused + totals.tired + totals.stressed;
    const focusedPercentage = Math.round((totals.focused / totalHours) * 100);
    const stressedPercentage = Math.round((totals.stressed / totalHours) * 100);
    
    // Find most and least focused periods
    const focusedByPeriod = data.map(range => ({
      name: range.name,
      percentage: Math.round((range.emotions.focused / range.hours) * 100)
    }));
    
    const mostFocused = focusedByPeriod.reduce((max, current) => 
      current.percentage > max.percentage ? current : max
    );
    
    const leastFocused = focusedByPeriod.reduce((min, current) => 
      current.percentage < min.percentage ? current : min
    );
    
    // Find stress patterns
    const stressedByPeriod = data.map(range => ({
      name: range.name,
      percentage: Math.round((range.emotions.stressed / range.hours) * 100)
    }));
    
    const highestStress = stressedByPeriod.reduce((max, current) => 
      current.percentage > max.percentage ? current : max
    );
    
    // Generate insights based on data
    if (mostFocused.percentage > leastFocused.percentage + 20) {
      const difference = mostFocused.percentage - leastFocused.percentage;
      insights.push({
        type: 'positive',
        icon: <CheckCircle className="h-5 w-5" />,
        text: `You are ${difference}% more focused in the ${mostFocused.name.toLowerCase()} compared to the ${leastFocused.name.toLowerCase()}.`
      });
    }
    
    if (highestStress.percentage > 30) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-5 w-5" />,
        text: `Stress spikes in the ${highestStress.name.toLowerCase()}.`
      });
    }
    
    if (leastFocused.percentage < 20) {
      insights.push({
        type: 'tip',
        icon: <Lightbulb className="h-5 w-5" />,
        text: `Avoid ${leastFocused.name.toLowerCase()} sessions: lowest productivity window.`
      });
    }
    
    if (focusedPercentage > 50) {
      insights.push({
        type: 'positive',
        icon: <TrendingUp className="h-5 w-5" />,
        text: `Great focus overall! You're focused ${focusedPercentage}% of the time.`
      });
    }
    
    if (stressedPercentage > 40) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-5 w-5" />,
        text: `High stress levels detected (${stressedPercentage}%). Consider taking breaks.`
      });
    }
    
    // Default insights if no specific patterns
    if (insights.length === 0) {
      insights.push({
        type: 'tip',
        icon: <Lightbulb className="h-5 w-5" />,
        text: "Keep tracking your patterns to discover productivity insights!"
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
    <div className="grid lg:grid-cols-2 gap-8">
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
                key={range.name} 
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
                  <span className="text-sm transition-all duration-300" style={{color: isDarkMode ? '#a0a0a0' : '#93a57b'}}>
                    {range.period}
                  </span>
                </div>
                
                {/* Heatmap Bar */}
                <div className={`relative rounded-lg overflow-hidden shadow-lg transition-all duration-500 ${
                  isHovered ? 'h-16 shadow-2xl' : 'h-12'
                }`} style={{backgroundColor: isDarkMode ? '#374151' : '#f3f4f6'}}>
                  {/* Focused Segment */}
                  <div 
                    className="absolute left-0 top-0 h-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500 hover:opacity-90"
                    style={{
                      width: `${(focused / totalHours) * 100}%`,
                      backgroundColor: '#677d61' // Our green
                    }}
                    title={`Focused: ${focused}h`}
                  >
                    {focused > 0 && focused >= 1.5 && `${focused}h`}
                  </div>
                  
                  {/* Tired Segment */}
                  <div 
                    className="absolute top-0 h-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500 hover:opacity-90"
                    style={{
                      left: `${(focused / totalHours) * 100}%`,
                      width: `${(tired / totalHours) * 100}%`,
                      backgroundColor: '#93a57b' // Our medium green
                    }}
                    title={`Tired: ${tired}h`}
                  >
                    {tired > 0 && tired >= 1.5 && `${tired}h`}
                  </div>
                  
                  {/* Stressed Segment */}
                  <div 
                    className="absolute top-0 h-full flex items-center justify-center text-black text-xs font-medium transition-all duration-500 hover:opacity-90"
                    style={{
                      left: `${((focused + tired) / totalHours) * 100}%`,
                      width: `${(stressed / totalHours) * 100}%`,
                      backgroundColor: '#fffd7a' // Our yellow
                    }}
                    title={`Stressed: ${stressed}h`}
                  >
                    {stressed > 0 && stressed >= 1.5 && `${stressed}h`}
                  </div>
                </div>
                
                {/* Mini Legend */}
                <div className={`flex justify-between text-xs transition-all duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-70'
                }`} style={{color: isDarkMode ? '#a0a0a0' : '#93a57b'}}>
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded transition-all duration-300" style={{backgroundColor: '#677d61'}}></div>
                    <span>Focused: {focused}h</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded transition-all duration-300" style={{backgroundColor: '#93a57b'}}></div>
                    <span>Tired: {tired}h</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded transition-all duration-300" style={{backgroundColor: '#fffd7a'}}></div>
                    <span>Stressed: {stressed}h</span>
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
        
        {/* Summary Stats */}
        <div className="mt-8 p-8 rounded-lg" style={{backgroundColor: isDarkMode ? '#2d2d2d' : '#f8f9fa'}}>
          <h4 className="text-xl font-semibold mb-8 text-center" style={{color: isDarkMode ? '#ffffff' : '#2c423f'}}>
            Quick Summary
          </h4>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="transition-all duration-300 hover:scale-110">
              <div className="text-4xl font-bold mb-2" style={{color: '#677d61'}}>
                {timeRangeData.reduce((sum, range) => sum + range.emotions.focused, 0)}
              </div>
              <div className="text-sm font-medium" style={{color: isDarkMode ? '#a0a0a0' : '#93a57b'}}>
                Focused Hours
              </div>
            </div>
            <div className="transition-all duration-300 hover:scale-110">
              <div className="text-4xl font-bold mb-2" style={{color: '#93a57b'}}>
                {timeRangeData.reduce((sum, range) => sum + range.emotions.tired, 0)}
              </div>
              <div className="text-sm font-medium" style={{color: isDarkMode ? '#a0a0a0' : '#93a57b'}}>
                Tired Hours
              </div>
            </div>
            <div className="transition-all duration-300 hover:scale-110">
              <div className="text-4xl font-bold mb-2" style={{color: '#fffd7a'}}>
                {timeRangeData.reduce((sum, range) => sum + range.emotions.stressed, 0)}
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
