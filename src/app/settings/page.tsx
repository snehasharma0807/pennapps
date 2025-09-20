'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Bell, User, Trash2, Save, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserSettings {
  notificationInterval: number;
  notificationsEnabled: boolean;
  webcamEnabled: boolean;
}

export default function SettingsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings>({
    notificationInterval: 15,
    notificationsEnabled: true,
    webcamEnabled: true
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
      return;
    }
    
    // Fetch settings when user is available
    if (user) {
      fetchUserSettings();
    }
  }, [user, isLoading, router]);

  const fetchUserSettings = async () => {
    setIsLoadingSettings(true);
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('/api/user', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const userData = await response.json();
        setSettings({
          notificationInterval: userData.settings?.notificationInterval || 15,
          notificationsEnabled: userData.settings?.notificationsEnabled ?? true,
          webcamEnabled: userData.settings?.webcamEnabled ?? true
        });
      } else {
        console.error('Failed to fetch user settings:', response.status);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      } else {
        console.error('Error fetching user settings:', error);
      }
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const saveSettings = async () => {
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
      if (error.name === 'AbortError') {
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
    setIsDeleting(true);
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for deletion
      
      const response = await fetch('/api/user', {
        method: 'DELETE',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        alert('Account deleted successfully. You will be logged out.');
        window.location.href = '/api/auth/logout';
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to delete account: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                {user.name || user.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Configure how often you receive productivity suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingSettings ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-3"></div>
                    <span className="text-sm text-gray-600">Loading settings...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Enable Notifications
                      </label>
                      <p className="text-sm text-gray-500">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
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
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      disabled={!settings.notificationsEnabled}
                    />
                    <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                      {settings.notificationInterval} min
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    How often to receive productivity suggestions
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Enable Webcam Monitoring
                    </label>
                    <p className="text-sm text-gray-500">
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
              <CardDescription>
                Manage your account details and login information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                    {user.name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                    {user.email}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> To change your login information (password, email, etc.), 
                  please visit your Auth0 dashboard or use the "Change Password" option in your 
                  Auth0 user profile.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription>
                Irreversible actions that will permanently affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
                  <p className="text-sm text-red-700 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Account</span>
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-red-700 font-medium">
                        Are you sure you want to delete your account? This action cannot be undone.
                      </p>
                      <div className="flex space-x-3">
                        <Button
                          variant="destructive"
                          onClick={deleteAccount}
                          disabled={isDeleting}
                          className="flex items-center space-x-2"
                        >
                          {isDeleting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span>{isDeleting ? 'Deleting Account...' : 'Yes, Delete Account'}</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveSettings}
              disabled={isSaving || isLoadingSettings}
              className="flex items-center space-x-2"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
