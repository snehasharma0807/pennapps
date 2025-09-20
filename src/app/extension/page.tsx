'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Settings, Bell, Camera, Sun, Moon, BarChart3, CheckCircle, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function ExtensionPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Dark mode styles
  const darkModeStyles = {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#2c423f',
    textSecondary: isDarkMode ? '#a0a0a0' : '#93a57b',
    cardBackground: isDarkMode ? '#2d2d2d' : '#f8f9fa',
    border: isDarkMode ? '#404040' : '#93a57b',
    navBackground: isDarkMode ? '#2d2d2d' : '#ffffff'
  };

  return (
    <div className="min-h-screen transition-all duration-1000 ease-out" style={{backgroundColor: darkModeStyles.background}}>
      {/* Navigation Bar */}
      <nav className="shadow-sm border-b transition-all duration-500" style={{backgroundColor: darkModeStyles.navBackground, borderColor: darkModeStyles.border}}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <Link href="/" className="static-logo transition-all duration-300 hover:scale-105">
              <Logo variant="intention-ai" />
            </Link>
            
            {/* Right side - Navigation items and Dark Mode Toggle */}
            <div className="flex items-center space-x-6">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-12"
                style={{backgroundColor: darkModeStyles.cardBackground}}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" style={{color: darkModeStyles.text}} />
                ) : (
                  <Moon className="h-5 w-5" style={{color: darkModeStyles.text}} />
                )}
              </button>
              
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105" style={{color: darkModeStyles.text}}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105" style={{color: darkModeStyles.text}}>
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
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-500 hover:scale-110" style={{backgroundColor: '#677d61'}}>
              <Download className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 transition-all duration-500" style={{color: darkModeStyles.text}}>
              Download intention.ai Extension
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto" style={{color: darkModeStyles.textSecondary}}>
              Install our Chrome extension to start monitoring your emotions and receiving AI-powered productivity suggestions in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{backgroundColor: '#677d61', color: '#ffffff'}}
                >
                  <BarChart3 className="h-6 w-6 mr-3" />
                  View Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{borderColor: darkModeStyles.border, color: darkModeStyles.text}}
                >
                  <ArrowLeft className="h-6 w-6 mr-3" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-16">
            {/* Installation Steps Section */}
            <div 
              className={`transition-all duration-500 ease-out ${
                hoveredSection === 'installation' ? 'transform scale-102' : ''
              }`}
              style={{
                opacity: hoveredSection && hoveredSection !== 'installation' ? 0.6 : 1,
                filter: hoveredSection && hoveredSection !== 'installation' ? 'blur(1px)' : 'none'
              }}
              onMouseEnter={() => setHoveredSection('installation')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center mb-8">
                <div className="p-4 rounded-full transition-all duration-300" style={{backgroundColor: '#677d61'}}>
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-3xl font-bold" style={{color: darkModeStyles.text}}>Installation Guide</h2>
                  <p className="text-lg" style={{color: darkModeStyles.textSecondary}}>Follow these simple steps to get started</p>
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
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105" style={{backgroundColor: darkModeStyles.cardBackground}}>
                      <div className="rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 transition-all duration-300" style={{backgroundColor: '#677d61'}}>
                        <span className="text-lg font-bold text-white">{item.step}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{color: darkModeStyles.text}}>{item.title}</h3>
                        <p className="text-base" style={{color: darkModeStyles.textSecondary}}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-8 rounded-xl" style={{backgroundColor: darkModeStyles.cardBackground}}>
                  <h3 className="text-xl font-semibold mb-6" style={{color: darkModeStyles.text}}>Quick Start</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6" style={{color: '#677d61'}} />
                      <span style={{color: darkModeStyles.text}}>Files located in <code className="px-2 py-1 rounded text-sm" style={{backgroundColor: '#bfcc94', color: '#2c423f'}}>chrome-extension/</code> folder</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6" style={{color: '#677d61'}} />
                      <span style={{color: darkModeStyles.text}}>No additional downloads required</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6" style={{color: '#677d61'}} />
                      <span style={{color: darkModeStyles.text}}>Works immediately after installation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full" style={{backgroundColor: darkModeStyles.border}}></div>

            {/* Features Section */}
            <div 
              className={`transition-all duration-500 ease-out ${
                hoveredSection === 'features' ? 'transform scale-102' : ''
              }`}
              style={{
                opacity: hoveredSection && hoveredSection !== 'features' ? 0.6 : 1,
                filter: hoveredSection && hoveredSection !== 'features' ? 'blur(1px)' : 'none'
              }}
              onMouseEnter={() => setHoveredSection('features')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center mb-8">
                <div className="p-4 rounded-full transition-all duration-300" style={{backgroundColor: '#93a57b'}}>
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-3xl font-bold" style={{color: darkModeStyles.text}}>Extension Features</h2>
                  <p className="text-lg" style={{color: darkModeStyles.textSecondary}}>Powerful tools for productivity enhancement</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{backgroundColor: darkModeStyles.cardBackground}}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#677d61'}}>
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{color: darkModeStyles.text}}>Webcam Monitoring</h3>
                  <p className="text-base" style={{color: darkModeStyles.textSecondary}}>Continuous emotion detection via webcam with privacy-first approach</p>
                </div>
                
                <div className="p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{backgroundColor: darkModeStyles.cardBackground}}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#fffd7a'}}>
                    <Bell className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{color: darkModeStyles.text}}>Smart Notifications</h3>
                  <p className="text-base" style={{color: darkModeStyles.textSecondary}}>AI-powered productivity suggestions delivered at optimal times</p>
                </div>
                
                <div className="p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{backgroundColor: darkModeStyles.cardBackground}}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#93a57b'}}>
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{color: darkModeStyles.text}}>Privacy Focused</h3>
                  <p className="text-base" style={{color: darkModeStyles.textSecondary}}>All data processed locally with customizable privacy settings</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full" style={{backgroundColor: darkModeStyles.border}}></div>

            {/* Technical Details Section */}
            <div 
              className={`transition-all duration-500 ease-out ${
                hoveredSection === 'technical' ? 'transform scale-102' : ''
              }`}
              style={{
                opacity: hoveredSection && hoveredSection !== 'technical' ? 0.6 : 1,
                filter: hoveredSection && hoveredSection !== 'technical' ? 'blur(1px)' : 'none'
              }}
              onMouseEnter={() => setHoveredSection('technical')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center mb-8">
                <div className="p-4 rounded-full transition-all duration-300" style={{backgroundColor: '#fffd7a'}}>
                  <Settings className="h-8 w-8 text-black" />
                </div>
                <div className="ml-6">
                  <h2 className="text-3xl font-bold" style={{color: darkModeStyles.text}}>Technical Details</h2>
                  <p className="text-lg" style={{color: darkModeStyles.textSecondary}}>Requirements and specifications</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl" style={{backgroundColor: darkModeStyles.cardBackground}}>
                  <h3 className="text-xl font-semibold mb-6" style={{color: darkModeStyles.text}}>Permissions Required</h3>
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
                          <span className="font-medium" style={{color: darkModeStyles.text}}>{item.perm}</span>
                          <span className="text-sm ml-2" style={{color: darkModeStyles.textSecondary}}>- {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 rounded-xl" style={{backgroundColor: darkModeStyles.cardBackground}}>
                  <h3 className="text-xl font-semibold mb-6" style={{color: darkModeStyles.text}}>System Requirements</h3>
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
                          <span className="font-medium" style={{color: darkModeStyles.text}}>{item.req}</span>
                          <span className="text-sm ml-2" style={{color: darkModeStyles.textSecondary}}>- {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
