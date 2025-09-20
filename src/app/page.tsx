'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Brain, BarChart3, Bell } from 'lucide-react';

export default function LandingPage() {
  // Temporarily disabled Auth0 for demo
  const user = null;
  const isLoading = false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">WorkFlow AI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : user ? (
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Boost Your Productivity with
            <span className="text-indigo-600"> AI-Powered</span> Emotion Detection
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Monitor your focus, stress, and energy levels through webcam analysis and receive personalized suggestions to optimize your workflow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/extension">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Download Chrome Extension
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Card className="text-center">
              <CardHeader>
                <Camera className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Real-time Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Continuous webcam monitoring to detect focused, tired, and stressed states
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Personalized productivity recommendations powered by Google Gemini AI
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Detailed insights into your emotional patterns and productivity trends
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Bell className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Smart Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Timely alerts and interventions to help maintain optimal focus
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* How it Works */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Install Extension</h3>
                <p className="text-gray-600">Download our Chrome extension and grant webcam permissions</p>
              </div>
              
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Monitor Emotions</h3>
                <p className="text-gray-600">AI analyzes your facial expressions in real-time</p>
              </div>
              
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Insights</h3>
                <p className="text-gray-600">Receive suggestions and view analytics on your dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">WorkFlow AI</span>
          </div>
          <p className="text-gray-400">
            © 2024 WorkFlow AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}