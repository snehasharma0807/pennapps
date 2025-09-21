'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Settings, Bell, Camera, Sun, Moon, CheckCircle, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import LogoButton from '@/components/LogoButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExtensionPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
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
        
        {/* Floating Particles */}
        {[...Array(25)].map((_, i) => {
          // Use deterministic positions based on index to avoid hydration mismatch
          const left = (i * 11.5) % 100;
          const top = (i * 19.2) % 100;
          const duration = 4 + (i % 3) * 0.5;
          const delay = (i % 4) * 0.75;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-30"
              style={{
                background: '#677d61',
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
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
        
        {/* Interactive Mouse Follower */}
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(103, 125, 97, 0.2) 0%, transparent 70%)',
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Navigation Bar */}
      <motion.nav
        className="relative z-10 flex justify-between items-center p-8 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <LogoButton size="lg" />
        
        <div className="flex items-center space-x-6">
          <Link href="/settings">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                className="backdrop-blur-sm"
                style={{ 
                  color: '#677d61', 
                  borderColor: '#93a57b',
                  backgroundColor: 'rgba(147, 165, 123, 0.1)'
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-16">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div
              className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 relative overflow-hidden"
              style={{backgroundColor: '#677d61'}}
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(103, 125, 97, 0.3)',
                  '0 0 40px rgba(103, 125, 97, 0.6)',
                  '0 0 20px rgba(103, 125, 97, 0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Download className="h-16 w-16 text-white relative z-10" />
              
              {/* Sparkle effect */}
              <motion.div
                className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white/60"
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
            
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: '#2c423f' }}
              whileHover={{ scale: 1.02 }}
            >
              Download{' '}
              <span
                style={{
                  backgroundImage: 'linear-gradient(135deg, #677d61 0%, #93a57b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                intention.ai
              </span>{' '}
              Extension
            </motion.h1>
            
            <motion.p
              className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
              style={{ color: '#93a57b' }}
              whileHover={{ scale: 1.01 }}
            >
              Install our Chrome extension to start monitoring your emotions and receiving AI-powered productivity suggestions in real-time.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-12 py-6 text-lg font-semibold rounded-2xl backdrop-blur-sm"
                    style={{
                      color: '#677d61', 
                      borderColor: '#93a57b',
                      backgroundColor: 'rgba(147, 165, 123, 0.1)'
                    }}
                  >
                    <ArrowLeft className="h-6 w-6 mr-3" />
                    Back to Home
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Installation Steps Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center mb-12"
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="p-4 rounded-full mr-6"
                style={{backgroundColor: '#677d61'}}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Settings className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <motion.h2
                  className="text-4xl font-bold mb-2"
                  style={{color: '#2c423f'}}
                  whileHover={{ scale: 1.02 }}
                >
                  Installation Guide
                </motion.h2>
                <motion.p
                  className="text-xl"
                  style={{color: '#93a57b'}}
                  whileHover={{ scale: 1.01 }}
                >
                  Follow these simple steps to get started
                </motion.p>
              </div>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                {[
                  { step: 1, title: "Download Extension", desc: "Download the extension files from the project repository" },
                  { step: 2, title: "Open Chrome Extensions", desc: "Go to chrome://extensions/ in your browser" },
                  { step: 3, title: "Enable Developer Mode", desc: "Toggle 'Developer mode' in the top right corner" },
                  { step: 4, title: "Load Unpacked", desc: "Click 'Load unpacked' and select the chrome-extension folder" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-6 rounded-2xl backdrop-blur-sm transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(147, 165, 123, 0.2)'
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -5,
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                    }}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0"
                      style={{backgroundColor: '#677d61'}}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <span className="text-lg font-bold text-white">{item.step}</span>
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2" style={{color: '#2c423f'}}>{item.title}</h3>
                      <p className="text-base" style={{color: '#93a57b'}}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                className="p-8 rounded-2xl backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(147, 165, 123, 0.2)'
                }}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold mb-8" style={{color: '#2c423f'}}>Quick Start</h3>
                <div className="space-y-6">
                  {[
                    { text: "Files located in chrome-extension/ folder", code: "chrome-extension/" },
                    { text: "No additional downloads required", code: null },
                    { text: "Works immediately after installation", code: null }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CheckCircle className="h-6 w-6" style={{color: '#677d61'}} />
                      </motion.div>
                      <span style={{color: '#2c423f'}}>
                        {item.text}
                        {item.code && (
                          <code className="px-3 py-1 rounded-lg text-sm ml-2" style={{backgroundColor: '#f8fafc', color: '#677d61'}}>
                            {item.code}
                          </code>
                        )}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center mb-12"
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="p-4 rounded-full mr-6"
                style={{backgroundColor: '#93a57b'}}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Zap className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <motion.h2
                  className="text-4xl font-bold mb-2"
                  style={{color: '#2c423f'}}
                  whileHover={{ scale: 1.02 }}
                >
                  Extension Features
                </motion.h2>
                <motion.p
                  className="text-xl"
                  style={{color: '#93a57b'}}
                  whileHover={{ scale: 1.01 }}
                >
                  Powerful tools for productivity enhancement
                </motion.p>
              </div>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Camera, title: "Webcam Monitoring", desc: "Continuous emotion detection via webcam with privacy-first approach", color: '#677d61' },
                { icon: Bell, title: "Smart Notifications", desc: "AI-powered productivity suggestions delivered at optimal times", color: '#93a57b' },
                { icon: Shield, title: "Privacy Focused", desc: "All data processed locally with customizable privacy settings", color: '#677d61' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-8 rounded-2xl backdrop-blur-sm transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(147, 165, 123, 0.2)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -10,
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{backgroundColor: feature.color}}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4" style={{color: '#2c423f'}}>{feature.title}</h3>
                  <p className="text-base leading-relaxed" style={{color: '#93a57b'}}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
