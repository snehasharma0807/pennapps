'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Brain, BarChart3, Bell, ArrowRight, Sparkles, Zap, Shield, Eye, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import LogoButton from '@/components/LogoButton';
import Features from '@/components/Features';

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
        {[...Array(30)].map((_, i) => {
          // Use deterministic positions based on index to avoid hydration mismatch
          const left = (i * 17.3) % 100;
          const top = (i * 29.7) % 100;
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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <motion.nav
          className="flex justify-between items-center p-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <LogoButton size="lg" />
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-sm" style={{ color: '#93a57b' }}>Welcome, {user.name || user.email}</span>
                <Link href="/dashboard">
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
                      Dashboard
                    </Button>
                  </motion.div>
                </Link>
              </>
            ) : (
              <Link href="/auth">
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
                      Log in
                    </Button>
                </motion.div>
              </Link>
            )}
          </div>
        </motion.nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                <motion.span
                  className="block"
                  style={{ color: '#2c423f' }}
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(44, 66, 63, 0.3)',
                      '0 0 40px rgba(44, 66, 63, 0.5)',
                      '0 0 20px rgba(44, 66, 63, 0.3)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <motion.span
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #677d61 0%, #93a57b 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent'
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    intention.ai
                  </motion.span>
                </motion.span>
                
                <motion.div
                  className="text-4xl md:text-6xl mt-6 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    style={{ color: '#2c423f' }}
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 1, type: "spring", stiffness: 100 }}
                  >
                    3 signals.
                  </motion.div>
                  <motion.div
                    style={{ color: '#677d61' }}
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
                  >
                    1 glance.
                  </motion.div>
                  <motion.div
                    style={{ color: '#93a57b' }}
                    className="font-light italic"
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 1.4, type: "spring", stiffness: 100 }}
                  >
                    Intentional productivity
                  </motion.div>
                </motion.div>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
              style={{ color: '#93a57b' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              Monitor your focus, stress, and energy levels through webcam analysis and receive personalized suggestions to optimize your workflow.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              {user ? (
                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      className="px-12 py-6 text-lg font-semibold rounded-2xl shadow-2xl"
                      style={{ backgroundColor: '#677d61', color: '#ffffff' }}
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <>
                  <Link href="/extension">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        size="lg" 
                        className="px-12 py-6 text-lg font-semibold rounded-2xl shadow-2xl"
                        style={{ backgroundColor: '#677d61', color: '#ffffff' }}
                      >
                        Download Chrome Extension
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </Button>
                    </motion.div>
                  </Link>
                  
                  <Link href="/auth">
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
                        Get Started
                        <Sparkles className="ml-3 h-6 w-6" />
                      </Button>
                    </motion.div>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              {[
                {
                  icon: Eye,
                  title: "Real-time Detection",
                  description: "Advanced AI analyzes your emotional state through webcam"
                },
                {
                  icon: Brain,
                  title: "AI Insights",
                  description: "Personalized productivity recommendations based on patterns"
                },
                {
                  icon: Shield,
                  title: "Privacy First",
                  description: "All processing happens locally on your device"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group relative p-6 rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ 
                    y: -5,
                    scale: 1.02,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + index * 0.1 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors duration-300"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#2c423f' }}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm" style={{ color: '#93a57b' }}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>

      {/* Features Section */}
      <Features />
    </div>
  );
}