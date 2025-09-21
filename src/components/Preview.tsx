'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BarChart3, TrendingUp, Brain, Zap } from 'lucide-react';

const Preview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            How it works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Our AI analyzes your emotional patterns and provides personalized insights to optimize your productivity.
          </p>
        </motion.div>

        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Mock Dashboard */}
          <motion.div
            className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
            whileHover={{ 
              y: -8,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg" style={{background: 'linear-gradient(135deg, #677d61, #93a57b)'}} />
                  <span className="font-semibold text-slate-900">Productivity Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#677d61'}} />
                  <span className="text-sm text-slate-600">Active</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Activity Visualization */}
                <div>
                  <h3 className="text-xl font-bold mb-6 text-slate-900">Activity Analysis</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Focused Work', percentage: 68, color: '#677d61' },
                      { label: 'Break Time', percentage: 22, color: '#93a57b' },
                      { label: 'Distracted', percentage: 10, color: '#fffd7a' }
                    ].map((item, index) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-700">{item.label}</span>
                          <span className="text-slate-600">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: item.color }}
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${item.percentage}%` } : { width: 0 }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Insights */}
                <div>
                  <h3 className="text-xl font-bold mb-6 text-slate-900">AI Insights</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#677d61'}}>
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Peak Performance</h4>
                          <p className="text-sm text-slate-600">
                            You're most productive between 10-11 AM. Schedule important tasks during this time.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#93a57b'}}>
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Wellness Tip</h4>
                          <p className="text-sm text-slate-600">
                            Take a 5-minute break every hour to maintain focus and reduce stress.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-8 h-8 rounded-full opacity-40"
            style={{background: 'linear-gradient(135deg, #677d61, #93a57b)'}}
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full opacity-40"
            style={{background: 'linear-gradient(135deg, #93a57b, #fffd7a)'}}
            animate={{
              y: [0, 10, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Preview;
