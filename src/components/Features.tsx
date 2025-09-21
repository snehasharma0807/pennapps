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
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Everything you need to optimize your productivity with intelligent emotion detection.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative p-8 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Gradient background on hover */}
              <div 
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
              
              <div className="relative z-10">
                <motion.div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
