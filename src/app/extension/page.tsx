'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Settings, Bell, Camera } from 'lucide-react';
import Link from 'next/link';

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Chrome Extension</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Download WorkFlow AI Extension
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Install our Chrome extension to start monitoring your emotions and receiving AI-powered productivity suggestions.
            </p>
          </div>

          {/* Installation Steps */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Installation Steps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-indigo-600">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Download Extension</h3>
                      <p className="text-sm text-gray-600">Download the extension files from the project repository</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-indigo-600">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Open Chrome Extensions</h3>
                      <p className="text-sm text-gray-600">Go to chrome://extensions/ in your browser</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-indigo-600">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Enable Developer Mode</h3>
                      <p className="text-sm text-gray-600">Toggle "Developer mode" in the top right corner</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-indigo-600">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Load Unpacked</h3>
                      <p className="text-sm text-gray-600">Click "Load unpacked" and select the chrome-extension folder</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extension Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Camera className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h3 className="font-semibold">Webcam Monitoring</h3>
                      <p className="text-sm text-gray-600">Continuous emotion detection via webcam</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h3 className="font-semibold">Smart Notifications</h3>
                      <p className="text-sm text-gray-600">AI-powered productivity suggestions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h3 className="font-semibold">Customizable Settings</h3>
                      <p className="text-sm text-gray-600">Adjust notification intervals and preferences</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Download Section */}
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Ready to boost your productivity with AI-powered emotion detection?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    The extension files are located in the <code className="bg-gray-100 px-2 py-1 rounded">chrome-extension/</code> folder of this project.
                  </p>
                  <p className="text-sm text-gray-500">
                    Follow the installation steps above to load the extension in developer mode.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button size="lg" className="text-lg px-8 py-4">
                      View Dashboard
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Permissions Required</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Storage (save settings)</li>
                      <li>• Notifications (show suggestions)</li>
                      <li>• Active Tab (access current tab)</li>
                      <li>• Scripting (inject content scripts)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Chrome browser (version 88+)</li>
                      <li>• Webcam access</li>
                      <li>• Internet connection</li>
                      <li>• Developer mode enabled</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
