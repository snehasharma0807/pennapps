'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
// import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  // const { user, isLoading } = useUser();
  const user = null; // No user for now
  const isLoading = false;
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-50 to-green-100 items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <Logo variant="intention-ai" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{color: '#2c423f'}}>
            Welcome to intention.ai
          </h1>
          <p className="text-xl mb-8" style={{color: '#93a57b'}}>
            Transform your productivity with AI-powered emotion detection and personalized insights.
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#677d61'}}></div>
              <span style={{color: '#2c423f'}}>Real-time emotion monitoring</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#677d61'}}></div>
              <span style={{color: '#2c423f'}}>AI-powered productivity suggestions</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#677d61'}}></div>
              <span style={{color: '#2c423f'}}>Privacy-focused webcam analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{backgroundColor: '#ffffff'}}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <Logo variant="intention-ai" />
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{color: '#2c423f'}}>
              {isLogin ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-lg" style={{color: '#93a57b'}}>
              {isLogin 
                ? 'Sign in to continue your productivity journey' 
                : 'Create your account and boost your productivity'
              }
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4 mb-8">
            <Button 
              type="button"
              variant="outline"
              className="w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center"
              style={{borderColor: '#e5e7eb', color: '#2c423f'}}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              className="w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center"
              style={{borderColor: '#e5e7eb', color: '#2c423f'}}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#00BCF2" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
              </svg>
              Continue with Microsoft
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{borderColor: '#e5e7eb'}}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4" style={{backgroundColor: '#ffffff', color: '#93a57b'}}>or</span>
            </div>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field for signup */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2" style={{color: '#2c423f'}}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#93a57b'}} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={{
                      borderColor: '#e5e7eb',
                      '--tw-ring-color': '#bfcc94',
                      backgroundColor: '#f9fafb'
                    }}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{color: '#2c423f'}}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#93a57b'}} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: '#e5e7eb',
                    '--tw-ring-color': '#bfcc94',
                    backgroundColor: '#f9fafb'
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{color: '#2c423f'}}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#93a57b'}} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-14 py-4 border-2 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: '#e5e7eb',
                    '--tw-ring-color': '#bfcc94',
                    backgroundColor: '#f9fafb'
                  }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 hover:opacity-70 transition-opacity"
                  style={{color: '#93a57b'}}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field for signup */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{color: '#2c423f'}}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#93a57b'}} />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={{
                      borderColor: '#e5e7eb',
                      '--tw-ring-color': '#bfcc94',
                      backgroundColor: '#f9fafb'
                    }}
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105" 
              style={{backgroundColor: '#677d61', color: '#ffffff'}}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle between Login/Signup */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{color: '#93a57b'}}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
              className="text-lg font-medium hover:underline"
              style={{color: '#677d61'}}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center text-sm hover:underline" style={{color: '#93a57b'}}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
