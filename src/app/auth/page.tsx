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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const validatePasswordStrength = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);

    // Real-time password validation
    if (e.target.name === 'password') {
      const errors = validatePasswordStrength(e.target.value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Validate password strength for registration
    if (!isLogin) {
      const passwordValidationErrors = validatePasswordStrength(formData.password);
      if (passwordValidationErrors.length > 0) {
        setError(`Password requirements not met: ${passwordValidationErrors.join(', ')}`);
        setIsSubmitting(false);
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }
    }

    try {
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

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        // Handle password validation errors specifically
        if (data.passwordErrors && data.passwordErrors.length > 0) {
          setPasswordErrors(data.passwordErrors);
          setError(`Password requirements not met: ${data.passwordErrors.join(', ')}`);
        } else {
          setError(data.error || 'An error occurred');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An error occurred. Please try again.');
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


          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border-2" style={{borderColor: '#ef4444', backgroundColor: '#fef2f2'}}>
              <p className="text-sm font-medium" style={{color: '#dc2626'}}>{error}</p>
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
                    className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={{
                      borderColor: '#e5e7eb',
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
                  className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: '#e5e7eb',
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
                  className="w-full pl-12 pr-14 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: '#e5e7eb',
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

            {/* Password Requirements Display (only for signup) */}
            {!isLogin && (
              <div className="mt-2">
                <p className="text-xs font-medium mb-2" style={{color: '#2c423f'}}>
                  Password Requirements:
                </p>
                <div className="space-y-1">
                  {[
                    'At least 8 characters long',
                    'One uppercase letter (A-Z)',
                    'One lowercase letter (a-z)', 
                    'One number (0-9)',
                    'One special character (!@#$%^&*)'
                  ].map((requirement, index) => {
                    const isMet = formData.password && (
                      (index === 0 && formData.password.length >= 8) ||
                      (index === 1 && /[A-Z]/.test(formData.password)) ||
                      (index === 2 && /[a-z]/.test(formData.password)) ||
                      (index === 3 && /\d/.test(formData.password)) ||
                      (index === 4 && /[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
                    );
                    
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className={`w-2 h-2 rounded-full ${isMet ? 'bg-green-500' : 'bg-gray-300'}`}
                        ></div>
                        <span 
                          className={`text-xs ${isMet ? 'text-green-600' : 'text-gray-500'}`}
                        >
                          {requirement}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Real-time Password Validation Errors */}
            {!isLogin && passwordErrors.length > 0 && formData.password && (
              <div className="mt-2 p-3 rounded-lg border" style={{borderColor: '#fbbf24', backgroundColor: '#fef3c7'}}>
                <p className="text-xs font-medium mb-2" style={{color: '#92400e'}}>
                  Password needs improvement:
                </p>
                <ul className="space-y-1">
                  {passwordErrors.map((error, index) => (
                    <li key={index} className="text-xs flex items-center space-x-2" style={{color: '#92400e'}}>
                      <span>•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
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
                    className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={{
                      borderColor: '#e5e7eb',
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
                setError('');
                setPasswordErrors([]);
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
