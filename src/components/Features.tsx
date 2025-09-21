'use client';

import { motion } from 'framer-motion';
import { Brain, Zap, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'Real-time Emotion Detection',
      description: 'Advanced AI analyzes your facial expressions and emotional state in real-time through your webcam.',
      gradient: 'from-green-600 to-green-700',
    },
    {
      icon: Zap,
      title: 'AI-Powered Suggestions',
      description: 'Get personalized productivity recommendations based on your emotional patterns and work habits.',
      gradient: 'from-green-700 to-green-800',
    },
    {
      icon: Shield,
      title: 'Privacy-First Analysis',
      description: 'All processing happens locally on your device. Your data never leaves your computer.',
      gradient: 'from-green-800 to-green-900',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
          }}
          animate={{
            background: [
              'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
              'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #f8fafc 100%)',
              'linear-gradient(135deg, #cbd5e1 0%, #f8fafc 50%, #e2e8f0 100%)',
              'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating geometric shapes */}
        {[...Array(20)].map((_, i) => {
          // Use deterministic positions based on index to avoid hydration mismatch
          const left = (i * 21.4) % 100;
          const top = (i * 33.8) % 100;
          const duration = 4 + (i % 3) * 0.5;
          const delay = (i % 4) * 0.75;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-slate-400/20 rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #64748b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            whileHover={{ scale: 1.02 }}
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed"
            whileHover={{ scale: 1.01 }}
          >
            Everything you need to optimize your productivity with intelligent emotion detection and AI-powered insights.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -12,
                rotateY: 5
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
                animate={{
                  background: [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Glassmorphism card */}
              <div className="relative backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500" 
                   style={{
                     backgroundColor: 'rgba(255, 255, 255, 0.8)',
                     borderColor: 'rgba(255, 255, 255, 0.3)',
                     boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)'
                   }}>
                
                {/* Floating particles inside card */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full opacity-20"
                    style={{
                      background: '#677d61',
                      left: `${20 + i * 10}%`,
                      top: `${20 + (i % 3) * 30}%`
                    }}
                    animate={{
                      y: [-5, 5, -5],
                      opacity: [0.2, 0.6, 0.2],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                ))}
                
                <div className="relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #677d61 0%, #93a57b 50%, #677d61 100%)'
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5
                    }}
                    animate={{
                      background: [
                        'linear-gradient(135deg, #677d61 0%, #93a57b 50%, #677d61 100%)',
                        'linear-gradient(135deg, #93a57b 0%, #677d61 50%, #93a57b 100%)',
                        'linear-gradient(135deg, #677d61 0%, #93a57b 50%, #677d61 100%)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <feature.icon className="w-8 h-8 text-white relative z-10" />
                    
                    {/* Sparkle effect */}
                    <motion.div
                      className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white/60"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </motion.div>

                  <motion.h3 
                    className="text-2xl font-bold mb-4 group-hover:text-slate-800 transition-colors duration-300"
                    style={{ color: '#1e293b' }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {feature.title}
                  </motion.h3>

                  <motion.p 
                    className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300"
                    whileHover={{ scale: 1.01 }}
                  >
                    {feature.description}
                  </motion.p>
                  
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20"
                    style={{
                      background: 'radial-gradient(circle at center, #677d61 0%, transparent 70%)'
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0, 0.2, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;