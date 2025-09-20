'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Bell, User, Trash2, Save, AlertTriangle, Moon, Sun, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserSettings {
  notificationInterval: number;
  notificationsEnabled: boolean;
  webcamEnabled: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings>({
    notificationInterval: 15,
    notificationsEnabled: true,
    webcamEnabled: true
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Get JWT token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Dark mode styles
  const darkModeStyles = {
    background: isDarkMode ? '#0f0f0f' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#2c423f',
    textSecondary: isDarkMode ? '#a0a0a0' : '#93a57b',
    cardBackground: isDarkMode ? '#1a1a1a' : '#f8f9fa',
    border: isDarkMode ? '#333333' : '#93a57b',
    navBackground: isDarkMode ? '#1a1a1a' : '#ffffff'
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/auth');
      return;
    }
    
    // Fetch user data and settings
    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    setIsLoadingSettings(true);
    try {
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser({
          name: userData.user.name || 'User',
          email: userData.user.email,
          id: userData.user._id
        });
        
        setSettings({
          notificationInterval: userData.user.settings?.notificationInterval || 15,
          notificationsEnabled: userData.user.settings?.notificationsEnabled ?? true,
          webcamEnabled: userData.user.settings?.webcamEnabled ?? true
        });
      } else {
        console.error('Failed to fetch user data');
        router.push('/auth');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/auth');
    } finally {
      setIsLoading(false);
      setIsLoadingSettings(false);
    }
  };

  const saveSettings = async () => {
    const token = getToken();
    if (!token) {
      alert('Please log in again');
      router.push('/auth');
      return;
    }

    setIsSaving(true);
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout for saving
      
      const response = await fetch('/api/user', {
        method: 'PUT',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          settings: {
            notificationInterval: settings.notificationInterval,
            notificationsEnabled: settings.notificationsEnabled,
            webcamEnabled: settings.webcamEnabled
          }
        }),
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to save settings: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        alert('Request timed out. Please try again.');
      } else {
        console.error('Error saving settings:', error);
        alert('Error saving settings. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAccount = async () => {
    const token = getToken();
    if (!token) {
      alert('Please log in again');
      router.push('/auth');
      return;
    }

    setIsDeleting(true);
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for deletion
      
      const response = await fetch('/api/user', {
        method: 'DELETE',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        alert('Account deleted successfully. You will be logged out.');
        // Clear token and redirect to auth page
        localStorage.removeItem('token');
        router.push('/auth');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to delete account: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        alert('Request timed out. Please try again.');
      } else {
        console.error('Error deleting account:', error);
        alert('Error deleting account. Please try again.');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  const changePassword = async () => {
    // Clear previous errors
    setPasswordErrors([]);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordErrors(['New passwords do not match']);
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setPasswordErrors(['Password must be at least 8 characters long']);
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setPasswordErrors(['Password must contain at least one uppercase letter']);
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setPasswordErrors(['Password must contain at least one lowercase letter']);
      return;
    }

    if (!/\d/.test(newPassword)) {
      setPasswordErrors(['Password must contain at least one number']);
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setPasswordErrors(['Password must contain at least one special character']);
      return;
    }

    const token = getToken();
    if (!token) {
      alert('Please log in again');
      router.push('/auth');
      return;
    }

    setIsChangingPassword(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/user', {
        method: 'PUT',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          settings: {
            notificationInterval: settings.notificationInterval,
            notificationsEnabled: settings.notificationsEnabled,
            webcamEnabled: settings.webcamEnabled
          }
        }),
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordErrors([]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.details && Array.isArray(errorData.details)) {
          setPasswordErrors(errorData.details);
        } else {
          setPasswordErrors([errorData.error || 'Failed to change password']);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setPasswordErrors(['Request timed out. Please try again.']);
      } else {
        console.error('Error changing password:', error);
        setPasswordErrors(['Error changing password. Please try again.']);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen transition-all duration-500" style={{backgroundColor: darkModeStyles.background}}>
      {/* Header */}
      <header className="shadow-sm border-b transition-all duration-500" style={{backgroundColor: darkModeStyles.navBackground, borderColor: darkModeStyles.border}}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold" style={{color: darkModeStyles.text}}>Settings</h1>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="transition-all duration-300 hover:scale-110"
                style={{color: darkModeStyles.text}}
              >
                {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {isDarkMode ? 'Light' : 'Dark'}
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" style={{color: darkModeStyles.text}}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Notification Settings */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6" style={{color: '#677d61'}} />
              <h2 className="text-2xl font-bold" style={{color: darkModeStyles.text}}>Notification Settings</h2>
            </div>
            
            {isLoadingSettings ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 mr-3" style={{borderColor: '#677d61'}}></div>
                <span className="text-sm" style={{color: darkModeStyles.textSecondary}}>Loading settings...</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium" style={{color: darkModeStyles.text}}>
                      Enable Notifications
                    </label>
                    <p className="text-sm" style={{color: darkModeStyles.textSecondary}}>
                      Receive AI-powered productivity suggestions
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificationsEnabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        notificationsEnabled: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" style={{backgroundColor: isDarkMode ? '#374151' : '#d1d5db'}}></div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{color: darkModeStyles.text}}>
                    Notification Interval (minutes)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={settings.notificationInterval}
                      onChange={(e) => setSettings({
                        ...settings,
                        notificationInterval: parseInt(e.target.value)
                      })}
                      className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                      style={{backgroundColor: isDarkMode ? '#374151' : '#d1d5db'}}
                      disabled={!settings.notificationsEnabled}
                    />
                    <span className="text-sm font-medium min-w-[3rem]" style={{color: darkModeStyles.text}}>
                      {settings.notificationInterval} min
                    </span>
                  </div>
                  <p className="text-sm" style={{color: darkModeStyles.textSecondary}}>
                    How often to receive productivity suggestions
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium" style={{color: darkModeStyles.text}}>
                      Enable Webcam Monitoring
                    </label>
                    <p className="text-sm" style={{color: darkModeStyles.textSecondary}}>
                      Allow the extension to monitor your emotions
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.webcamEnabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        webcamEnabled: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" style={{backgroundColor: isDarkMode ? '#374151' : '#d1d5db'}}></div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t" style={{borderColor: darkModeStyles.border}}></div>

          {/* Account Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6" style={{color: '#677d61'}} />
              <h2 className="text-2xl font-bold" style={{color: darkModeStyles.text}}>Account Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: darkModeStyles.text}}>Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: darkModeStyles.border,
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f9fafb',
                    color: darkModeStyles.text,
                  }}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: darkModeStyles.text}}>Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: darkModeStyles.border,
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f9fafb',
                    color: darkModeStyles.text,
                  }}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: darkModeStyles.text}}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: darkModeStyles.border,
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f9fafb',
                    color: darkModeStyles.text,
                  }}
                />
                <p className="text-xs mt-1" style={{color: darkModeStyles.textSecondary}}>
                  Required to verify your identity
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: darkModeStyles.text}}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: darkModeStyles.border,
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f9fafb',
                    color: darkModeStyles.text,
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: darkModeStyles.text}}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: darkModeStyles.border,
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f9fafb',
                    color: darkModeStyles.text,
                  }}
                />
              </div>

              {/* Password Errors */}
              {passwordErrors.length > 0 && (
                <div className="p-4 rounded-lg border-2" style={{backgroundColor: '#fef2f2', borderColor: '#fca5a5'}}>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" style={{color: '#dc2626'}} />
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{color: '#dc2626'}}>Password Requirements</h4>
                      <ul className="text-sm space-y-1" style={{color: '#dc2626'}}>
                        {passwordErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Change Password Button */}
              {(currentPassword || newPassword || confirmPassword) && (
                <Button
                  onClick={changePassword}
                  disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                  style={{backgroundColor: '#677d61', color: '#ffffff'}}
                >
                  {isChangingPassword ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                </Button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{borderColor: darkModeStyles.border}}></div>

          {/* Account Actions */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6" style={{color: '#677d61'}} />
              <h2 className="text-2xl font-bold" style={{color: darkModeStyles.text}}>Account Actions</h2>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={handleLogout}
                className="w-full py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                style={{backgroundColor: '#93a57b', color: '#ffffff'}}
              >
                Log Out
              </Button>
              
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                style={{backgroundColor: '#dc2626', color: '#ffffff'}}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md mx-4" style={{backgroundColor: darkModeStyles.cardBackground}}>
                <h3 className="text-xl font-bold mb-4" style={{color: darkModeStyles.text}}>Delete Account</h3>
                <p className="text-sm mb-6" style={{color: darkModeStyles.textSecondary}}>
                  Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={deleteAccount}
                    disabled={isDeleting}
                    className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                    style={{backgroundColor: '#dc2626', color: '#ffffff'}}
                  >
                    {isDeleting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    variant="outline"
                    className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                    style={{borderColor: darkModeStyles.border, color: darkModeStyles.text}}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveSettings}
              disabled={isSaving || isLoadingSettings}
              className="px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
              style={{backgroundColor: '#677d61', color: '#ffffff'}}
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              {isSaving ? 'Saving Settings...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}