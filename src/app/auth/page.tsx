'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { validatePassword } from '@/lib/password';

export default function AuthPage() {
  const { user: auth0User, isLoading: auth0Loading } = useUser();
  const { user: customUser, login } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<{ valid: boolean; errors: string[] }>({ valid: false, errors: [] });

  useEffect(() => {
    // If user is already logged in via either Auth0 or custom auth, redirect to dashboard
    if (auth0User || customUser) {
      console.log('User already logged in, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [auth0User, customUser, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input changed:', e.target.name, e.target.value);
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);
    
    // Validate password in real-time for signup
    if (e.target.name === 'password' && !isLogin) {
      const validation = validatePassword(e.target.value);
      setPasswordValidation(validation);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate passwords match for registration
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      // Validate password strength for registration
      if (!isLogin && !passwordValidation.valid) {
        setError('Password does not meet requirements. Please check the requirements below.');
        setIsSubmitting(false);
        return;
      }

      const endpoint = isLogin ? '/api/auth/custom-login' : '/api/auth/custom-register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, name: formData.name };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store token and redirect
      if (data.token) {
        login(data.token, data.user);
        setSuccess(isLogin ? 'Login successful!' : 'Account created successfully!');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Alternative Options */}
          <div className="text-center mb-8">
            <p className="text-sm mb-4" style={{color: '#93a57b'}}>
              Prefer social login?
            </p>
            <Link href="/oauth">
              <Button 
                variant="outline"
                className="w-full py-3 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                style={{borderColor: '#e5e7eb', color: '#2c423f'}}
              >
                Sign in with Google
              </Button>
            </Link>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-lg border-2" style={{backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626'}}>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-lg border-2" style={{backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#16a34a'}}>
              {success}
            </div>
          )}

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
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-300 transition-all duration-200 bg-gray-50 text-gray-900 placeholder-gray-500"
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
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-300 transition-all duration-200 bg-gray-50 text-gray-900 placeholder-gray-500"
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
                  className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-300 transition-all duration-200 bg-gray-50 text-gray-900 placeholder-gray-500"
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

            {/* Password Requirements for signup */}
            {!isLogin && (
              <div className="mt-3">
                <div className="text-sm font-medium mb-2" style={{color: '#2c423f'}}>
                  Password Requirements:
                </div>
                <div className="space-y-1 text-xs">
                  <div className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    At least 8 characters
                  </div>
                  <div className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    One uppercase letter (A-Z)
                  </div>
                  <div className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    One lowercase letter (a-z)
                  </div>
                  <div className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${/\d/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    One number (0-9)
                  </div>
                  <div className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    One special character (!@#$%^&*...)
                  </div>
                </div>
                {formData.password && !passwordValidation.valid && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                    <strong>Password needs:</strong>
                    <ul className="mt-1 list-disc list-inside">
                      {passwordValidation.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

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
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-300 transition-all duration-200 bg-gray-50 text-gray-900 placeholder-gray-500"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" 
              style={{backgroundColor: '#677d61', color: '#ffffff'}}
            >
              {isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
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
                setPasswordValidation({ valid: false, errors: [] });
                setError('');
                setSuccess('');
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
