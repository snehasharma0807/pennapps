'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Settings, User, Bell, Shield, Sun, Moon, Mail, Lock, Trash2, Save } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [cameraAccess, setCameraAccess] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState(45);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Dark mode styles
  const darkModeStyles = {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#2c423f',
    textSecondary: isDarkMode ? '#a0a0a0' : '#93a57b',
    cardBackground: isDarkMode ? '#2d2d2d' : '#f8f9fa',
    border: isDarkMode ? '#404040' : '#93a57b',
    navBackground: isDarkMode ? '#2d2d2d' : '#ffffff'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveSettings = () => {
    // Handle save logic
    console.log('Saving settings:', { formData, cameraAccess, notificationFrequency });
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
    }
  };

  const handleResetEmail = () => {
    console.log('Resetting email...');
  };

  const handleResetPassword = () => {
    console.log('Resetting password...');
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
          <h1 className="text-4xl font-bold mb-12 transition-all duration-500" style={{color: darkModeStyles.text}}>
            Settings
          </h1>
          
          <div className="space-y-16">
            {/* Account Management Section */}
            <div 
              className={`transition-all duration-500 ease-out ${
                hoveredSection === 'account' ? 'transform scale-102' : ''
              }`}
              style={{
                opacity: hoveredSection && hoveredSection !== 'account' ? 0.6 : 1,
                filter: hoveredSection && hoveredSection !== 'account' ? 'blur(1px)' : 'none'
              }}
              onMouseEnter={() => setHoveredSection('account')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center mb-8">
                <div className="p-4 rounded-full transition-all duration-300" style={{backgroundColor: '#677d61'}}>
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-3xl font-bold" style={{color: darkModeStyles.text}}>Account Management</h2>
                  <p className="text-lg" style={{color: darkModeStyles.textSecondary}}>Manage your account information and security</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-medium mb-4" style={{color: darkModeStyles.text}}>
                    Display Name
                  </label>
                  <input 
                    type="text" 
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: '#e5e7eb',
                      backgroundColor: darkModeStyles.cardBackground,
                      '--tw-ring-color': '#bfcc94'
                    }}
                    placeholder="Enter your display name"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-medium mb-4" style={{color: darkModeStyles.text}}>
                    Email Address
                  </label>
                  <div className="flex space-x-3">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-4 text-lg border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                      style={{
                        borderColor: '#e5e7eb',
                        backgroundColor: darkModeStyles.cardBackground,
                        '--tw-ring-color': '#bfcc94'
                      }}
                      placeholder="Enter your email"
                    />
                    <Button 
                      onClick={handleResetEmail}
                      className="px-6 py-4 transition-all duration-300 hover:scale-105"
                      style={{backgroundColor: '#93a57b', color: '#ffffff'}}
                    >
                      <Mail className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-6" style={{color: darkModeStyles.text}}>Password Management</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-lg font-medium mb-4" style={{color: darkModeStyles.text}}>
                      Current Password
                    </label>
                    <input 
                      type="password" 
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                      style={{
                        borderColor: '#e5e7eb',
                        backgroundColor: darkModeStyles.cardBackground,
                        '--tw-ring-color': '#bfcc94'
                      }}
                      placeholder="Current password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-medium mb-4" style={{color: darkModeStyles.text}}>
                      New Password
                    </label>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                      style={{
                        borderColor: '#e5e7eb',
                        backgroundColor: darkModeStyles.cardBackground,
                        '--tw-ring-color': '#bfcc94'
                      }}
                      placeholder="New password"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={handleResetPassword}
                      className="w-full px-6 py-4 transition-all duration-300 hover:scale-105"
                      style={{backgroundColor: '#93a57b', color: '#ffffff'}}
                    >
                      <Lock className="h-5 w-5 mr-2" />
                      Reset Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full" style={{backgroundColor: darkModeStyles.border}}></div>

            {/* Privacy Settings Section */}
            <div 
              className={`transition-all duration-500 ease-out ${
                hoveredSection === 'privacy' ? 'transform scale-102' : ''
              }`}
              style={{
                opacity: hoveredSection && hoveredSection !== 'privacy' ? 0.6 : 1,
                filter: hoveredSection && hoveredSection !== 'privacy' ? 'blur(1px)' : 'none'
              }}
              onMouseEnter={() => setHoveredSection('privacy')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center mb-8">
                <div className="p-4 rounded-full transition-all duration-300" style={{backgroundColor: '#93a57b'}}>
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-3xl font-bold" style={{color: darkModeStyles.text}}>Privacy & Security</h2>
                  <p className="text-lg" style={{color: darkModeStyles.textSecondary}}>Control your data and privacy settings</p>
                </div>
              </div>
              
              <div className="max-w-2xl">
                <div className="flex items-center justify-between p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{backgroundColor: darkModeStyles.cardBackground}}>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{color: darkModeStyles.text}}>Camera Access</h3>
                    <p className="text-base" style={{color: darkModeStyles.textSecondary}}>
                      Allow emotion detection and productivity monitoring
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cameraAccess}
                      onChange={(e) => setCameraAccess(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full" style={{backgroundColor: darkModeStyles.border}}></div>

            {/* Notifications Section */}
            <div 
              className={`transition-all duration-500 ease-out ${
                hoveredSection === 'notifications' ? 'transform scale-102' : ''
              }`}
              style={{
                opacity: hoveredSection && hoveredSection !== 'notifications' ? 0.6 : 1,
                filter: hoveredSection && hoveredSection !== 'notifications' ? 'blur(1px)' : 'none'
              }}
              onMouseEnter={() => setHoveredSection('notifications')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center mb-8">
                <div className="p-4 rounded-full transition-all duration-300" style={{backgroundColor: '#fffd7a'}}>
                  <Bell className="h-8 w-8 text-black" />
                </div>
                <div className="ml-6">
                  <h2 className="text-3xl font-bold" style={{color: darkModeStyles.text}}>Notifications</h2>
                  <p className="text-lg" style={{color: darkModeStyles.textSecondary}}>Configure your notification preferences</p>
                </div>
              </div>
              
              <div className="max-w-2xl">
                <div className="p-6 rounded-xl" style={{backgroundColor: darkModeStyles.cardBackground}}>
                  <h3 className="text-xl font-semibold mb-6" style={{color: darkModeStyles.text}}>
                    Notification Frequency
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg" style={{color: darkModeStyles.text}}>Every {notificationFrequency} minutes</span>
                      <span className="text-sm px-3 py-1 rounded-full" style={{backgroundColor: '#677d61', color: '#ffffff'}}>
                        {notificationFrequency === 30 ? 'Frequent' : notificationFrequency === 45 ? 'Balanced' : 'Minimal'}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="30" 
                      max="60" 
                      step="15"
                      value={notificationFrequency}
                      onChange={(e) => setNotificationFrequency(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{accentColor: '#677d61'}}
                    />
                    <div className="flex justify-between text-sm" style={{color: darkModeStyles.textSecondary}}>
                      <span>30 min</span>
                      <span>45 min</span>
                      <span>60 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full" style={{backgroundColor: darkModeStyles.border}}></div>

            {/* Danger Zone Section */}
            <div 
              className={`transition-all duration-500 ease-out ${
                hoveredSection === 'danger' ? 'transform scale-102' : ''
              }`}
              style={{
                opacity: hoveredSection && hoveredSection !== 'danger' ? 0.6 : 1,
                filter: hoveredSection && hoveredSection !== 'danger' ? 'blur(1px)' : 'none'
              }}
              onMouseEnter={() => setHoveredSection('danger')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center mb-8">
                <div className="p-4 rounded-full transition-all duration-300" style={{backgroundColor: '#ef4444'}}>
                  <Trash2 className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-3xl font-bold" style={{color: darkModeStyles.text}}>Delete Account</h2>
                  <p className="text-lg" style={{color: darkModeStyles.textSecondary}}>Irreversible and destructive actions</p>
                </div>
              </div>
              
              <div className="max-w-2xl">
                <div className="p-6 rounded-xl border-2 border-red-200" style={{backgroundColor: darkModeStyles.cardBackground}}>
                  <h3 className="text-xl font-semibold mb-4" style={{color: '#ef4444'}}>
                    Delete Account
                  </h3>
                  <p className="text-base mb-6" style={{color: darkModeStyles.textSecondary}}>
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button 
                    onClick={handleDeleteAccount}
                    className="px-6 py-3 transition-all duration-300 hover:scale-105"
                    style={{backgroundColor: '#ef4444', color: '#ffffff'}}
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete My Account
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-16 flex justify-center">
            <Button 
              onClick={handleSaveSettings}
              size="lg" 
              className="px-12 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{backgroundColor: '#677d61', color: '#ffffff'}}
            >
              <Save className="h-6 w-6 mr-3" />
              Save All Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
