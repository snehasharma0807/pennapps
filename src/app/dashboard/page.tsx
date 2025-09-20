'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Brain, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Emotion Distribution</span>
                </CardTitle>
                <CardDescription>
                  Your emotional patterns throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Charts will appear here when you connect your Chrome extension</p>
                    <p className="text-sm mt-2">Install the extension and start monitoring to see your data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Focused</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">0</div>
                    <div className="text-sm text-gray-600">Tired</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">0</div>
                    <div className="text-sm text-gray-600">Stressed</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Analytics & Suggestions */}
          <div className="space-y-6">
            {/* Analytics Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Analytics Summary</span>
                </CardTitle>
                <CardDescription>
                  AI-generated insights about your patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No data available for analysis</p>
                  <p className="text-sm mt-2">Start using the Chrome extension to see insights</p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Suggestions</CardTitle>
                <CardDescription>
                  Personalized recommendations to improve your workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No suggestions available</p>
                  <p className="text-sm mt-2">Connect your extension to get AI-powered recommendations</p>
                </div>
              </CardContent>
            </Card>

            {/* Extension Status */}
            <Card>
              <CardHeader>
                <CardTitle>Extension Status</CardTitle>
                <CardDescription>
                  Chrome extension monitoring status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Webcam Monitoring</span>
                    <span className="text-sm font-medium text-red-600">Inactive</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications</span>
                    <span className="text-sm font-medium text-red-600">Disabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Extension Status</span>
                    <span className="text-sm font-medium text-gray-600">Not Connected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Set up your WorkFlow AI experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Download Extension</h3>
                  <p className="text-sm text-gray-600">Install the Chrome extension to start monitoring</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Enable Webcam</h3>
                  <p className="text-sm text-gray-600">Grant permissions and start emotion detection</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">View Analytics</h3>
                  <p className="text-sm text-gray-600">Check back here to see your productivity insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}