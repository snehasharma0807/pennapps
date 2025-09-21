'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Settings, Bell, Camera, BarChart3, CheckCircle, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import LogoButton from '@/components/LogoButton';
import { motion } from 'framer-motion';

export default function ExtensionPage() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Consistent styling to match landing/login pages
  const styles = {
    background: '#ffffff',
    text: '#2c423f',
    textSecondary: '#93a57b',
    cardBackground: '#f8f9fa',
    border: '#93a57b',
    navBackground: '#ffffff'
  };

  return (
    <div className="min-h-screen transition-all duration-1000 ease-out" style={{backgroundColor: styles.background}}>
      {/* Navigation Bar */}
      <nav className="shadow-sm border-b transition-all duration-500" style={{backgroundColor: styles.navBackground, borderColor: styles.border}}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <LogoButton size="md" />
            
            {/* Right side - Navigation items */}
            <div className="flex items-center space-x-6">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105" style={{color: styles.text}}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105" style={{color: styles.text}}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 animate-in fade-in-50 duration-700">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section with Animated Background */}
          <div className="relative text-center mb-16 overflow-hidden rounded-3xl p-12" style={{backgroundColor: '#bfcc94'}}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-green-200"></div>
              
              {/* Floating Blobs */}
              <motion.div
                className="absolute top-10 left-10 w-24 h-24 rounded-full opacity-20"
                style={{background: 'linear-gradient(135deg, #677d61, #93a57b)'}}
                animate={{
                  y: [0, -15, 0],
                  x: [0, 8, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute top-20 right-16 w-16 h-16 rounded-full opacity-15"
                style={{background: 'linear-gradient(135deg, #fffd7a, #93a57b)'}}
                animate={{
                  y: [0, 12, 0],
                  x: [0, -12, 0],
                  scale: [1, 0.9, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div
                className="absolute bottom-16 left-16 w-12 h-12 rounded-full opacity-10"
                style={{background: 'linear-gradient(135deg, #93a57b, #677d61)'}}
                animate={{
                  y: [0, -20, 0],
                  x: [0, 15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <motion.div 
                className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-500 hover:scale-110" 
                style={{backgroundColor: '#677d61'}}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Download className="h-16 w-16 text-white" />
              </motion.div>
              
              <motion.h1 
                className="text-5xl font-bold mb-6 transition-all duration-500" 
                style={{color: styles.text}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span 
                  className="bg-gradient-to-r from-green-600 via-green-500 to-blue-600 bg-clip-text text-transparent hover:from-green-700 hover:to-blue-700 transition-all duration-500 cursor-default"
                  style={{
                    background: 'linear-gradient(135deg, #677d61, #93a57b, #fffd7a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  intention.ai Extension
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl mb-8 max-w-3xl mx-auto" 
                style={{color: styles.textSecondary}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Install our Chrome extension to start monitoring your emotions and receiving AI-powered productivity suggestions in real-time.
              </motion.p>
              
            </div>
          </div>

          <div className="space-y-16">
            {/* Installation Steps Section */}
            <motion.div 
              className={`transition-all duration-500 ease-out ${
                hoveredSection === 'installation' ? 'transform scale-102' : ''
              }`}
              style={{
                opacity: hoveredSection && hoveredSection !== 'installation' ? 0.6 : 1,
                filter: hoveredSection && hoveredSection !== 'installation' ? 'blur(1px)' : 'none'
              }}
              onMouseEnter={() => setHoveredSection('installation')}
              onMouseLeave={() => setHoveredSection(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center mb-8">
                <div className="p-4 rounded-full transition-all duration-300" style={{backgroundColor: '#677d61'}}>
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-3xl font-bold" style={{color: styles.text}}>Installation Guide</h2>
                  <p className="text-lg" style={{color: styles.textSecondary}}>Follow these simple steps to get started</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {[
                    { step: 1, title: "Download Extension", desc: "Download the extension files from the project repository" },
                    { step: 2, title: "Open Chrome Extensions", desc: "Go to chrome://extensions/ in your browser" },
                    { step: 3, title: "Enable Developer Mode", desc: "Toggle 'Developer mode' in the top right corner" },
                    { step: 4, title: "Load Unpacked", desc: "Click 'Load unpacked' and select the chrome-extension folder" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105" style={{backgroundColor: styles.cardBackground}}>
                      <div className="rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 transition-all duration-300" style={{backgroundColor: '#677d61'}}>
                        <span className="text-lg font-bold text-white">{item.step}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{color: styles.text}}>{item.title}</h3>
                        <p className="text-base" style={{color: styles.textSecondary}}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-8 rounded-xl" style={{backgroundColor: styles.cardBackground}}>
                  <h3 className="text-xl font-semibold mb-6" style={{color: styles.text}}>Quick Start</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6" style={{color: '#677d61'}} />
                      <span style={{color: styles.text}}>Files located in <code className="px-2 py-1 rounded text-sm" style={{backgroundColor: '#bfcc94', color: '#2c423f'}}>chrome-extension/</code> folder</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6" style={{color: '#677d61'}} />
                      <span style={{color: styles.text}}>No additional downloads required</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6" style={{color: '#677d61'}} />
                      <span style={{color: styles.text}}>Works immediately after installation</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="h-px w-full" style={{backgroundColor: styles.border}}></div>

            {/* Features Section */}
            <motion.div 
              className={`transition-all duration-500 ease-out ${
                hoveredSection === 'features' ? 'transform scale-102' : ''
              }`}
              style={{
                opacity: hoveredSection && hoveredSection !== 'features' ? 0.6 : 1,
                filter: hoveredSection && hoveredSection !== 'features' ? 'blur(1px)' : 'none'
              }}
              onMouseEnter={() => setHoveredSection('features')}
              onMouseLeave={() => setHoveredSection(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center mb-8">
                <div className="p-4 rounded-full transition-all duration-300" style={{backgroundColor: '#93a57b'}}>
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-3xl font-bold" style={{color: styles.text}}>Extension Features</h2>
                  <p className="text-lg" style={{color: styles.textSecondary}}>Powerful tools for productivity enhancement</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div 
                  className="p-6 rounded-xl transition-all duration-300 hover:scale-105" 
                  style={{backgroundColor: styles.cardBackground}}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4" 
                    style={{backgroundColor: '#677d61'}}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3" style={{color: styles.text}}>Webcam Monitoring</h3>
                  <p className="text-base" style={{color: styles.textSecondary}}>Continuous emotion detection via webcam with privacy-first approach</p>
                </motion.div>
                
                <motion.div 
                  className="p-6 rounded-xl transition-all duration-300 hover:scale-105" 
                  style={{backgroundColor: styles.cardBackground}}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4" 
                    style={{backgroundColor: '#fffd7a'}}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Bell className="h-6 w-6 text-black" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3" style={{color: styles.text}}>Smart Notifications</h3>
                  <p className="text-base" style={{color: styles.textSecondary}}>AI-powered productivity suggestions delivered at optimal times</p>
                </motion.div>
                
                <motion.div 
                  className="p-6 rounded-xl transition-all duration-300 hover:scale-105" 
                  style={{backgroundColor: styles.cardBackground}}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4" 
                    style={{backgroundColor: '#93a57b'}}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Shield className="h-6 w-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3" style={{color: styles.text}}>Privacy Focused</h3>
                  <p className="text-base" style={{color: styles.textSecondary}}>All data processed locally with customizable privacy settings</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="h-px w-full" style={{backgroundColor: styles.border}}></div>

            {/* Technical Details Section */}
            <motion.div 
              className={`transition-all duration-500 ease-out ${
                hoveredSection === 'technical' ? 'transform scale-102' : ''
              }`}
              style={{
                opacity: hoveredSection && hoveredSection !== 'technical' ? 0.6 : 1,
                filter: hoveredSection && hoveredSection !== 'technical' ? 'blur(1px)' : 'none'
              }}
              onMouseEnter={() => setHoveredSection('technical')}
              onMouseLeave={() => setHoveredSection(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center mb-8">
                <div className="p-4 rounded-full transition-all duration-300" style={{backgroundColor: '#fffd7a'}}>
                  <Settings className="h-8 w-8 text-black" />
                </div>
                <div className="ml-6">
                  <h2 className="text-3xl font-bold" style={{color: styles.text}}>Technical Details</h2>
                  <p className="text-lg" style={{color: styles.textSecondary}}>Requirements and specifications</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl" style={{backgroundColor: styles.cardBackground}}>
                  <h3 className="text-xl font-semibold mb-6" style={{color: styles.text}}>Permissions Required</h3>
                  <div className="space-y-4">
                    {[
                      { perm: "Storage", desc: "Save user settings and preferences" },
                      { perm: "Notifications", desc: "Show productivity suggestions" },
                      { perm: "Active Tab", desc: "Access current tab for context" },
                      { perm: "Scripting", desc: "Inject content scripts for monitoring" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#677d61'}}></div>
                        <div>
                          <span className="font-medium" style={{color: styles.text}}>{item.perm}</span>
                          <span className="text-sm ml-2" style={{color: styles.textSecondary}}>- {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 rounded-xl" style={{backgroundColor: styles.cardBackground}}>
                  <h3 className="text-xl font-semibold mb-6" style={{color: styles.text}}>System Requirements</h3>
                  <div className="space-y-4">
                    {[
                      { req: "Chrome Browser", desc: "Version 88 or higher" },
                      { req: "Webcam Access", desc: "Required for emotion detection" },
                      { req: "Internet Connection", desc: "For AI processing and updates" },
                      { req: "Developer Mode", desc: "Enabled for installation" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#93a57b'}}></div>
                        <div>
                          <span className="font-medium" style={{color: styles.text}}>{item.req}</span>
                          <span className="text-sm ml-2" style={{color: styles.textSecondary}}>- {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
