'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Shield, Lock, Eye, EyeOff, Sparkles, CheckCircle, XCircle, Brain, Zap } from 'lucide-react';
import Link from 'next/link';
import LogoButton from '@/components/LogoButton';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
          }}
          animate={{
            background: [
              'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
              'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #f8fafc 100%)',
              'linear-gradient(135deg, #cbd5e1 0%, #f8fafc 50%, #e2e8f0 100%)',
              'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => {
          // Use deterministic positions based on index to avoid hydration mismatch
          const left = (i * 13.7) % 100;
          const top = (i * 23.3) % 100;
          const duration = 4 + (i % 3) * 0.5;
          const delay = (i % 4) * 0.75;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-30"
              style={{
                background: '#677d61',
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay
              }}
            />
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <motion.div
            className="text-center max-w-md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <LogoButton size="lg" />
            </motion.div>
            
            <motion.h1
              className="text-5xl font-bold mb-6"
              style={{color: '#2c423f'}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to{' '}
              <span
                style={{
                  backgroundImage: 'linear-gradient(135deg, #677d61 0%, #93a57b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                intention.ai
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl mb-8 leading-relaxed"
              style={{color: '#93a57b'}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Transform your productivity with AI-powered emotion detection and personalized insights.
            </motion.p>
            
            <motion.div
              className="space-y-4 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: Brain, text: 'Real-time emotion monitoring' },
                { icon: Zap, text: 'AI-powered productivity suggestions' },
                { icon: Shield, text: 'Privacy-focused webcam analysis' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{backgroundColor: '#677d61'}}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <feature.icon className="w-4 h-4 text-white" />
                  </motion.div>
                  <span style={{color: '#2c423f'}} className="group-hover:text-gray-600 transition-colors">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <LogoButton size="md" />
              </motion.div>
              
              <motion.h2
                className="text-4xl font-bold mb-3"
                style={{color: '#2c423f'}}
                whileHover={{ scale: 1.02 }}
              >
                {isLogin ? 'Welcome back' : 'Get started'}
              </motion.h2>
              
              <motion.p
                className="text-lg"
                style={{color: '#93a57b'}}
                whileHover={{ scale: 1.01 }}
              >
                {isLogin 
                  ? 'Sign in to continue your productivity journey' 
                  : 'Create your account and boost your productivity'
                }
              </motion.p>
            </motion.div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 p-4 rounded-2xl border-2 backdrop-blur-sm"
                  style={{borderColor: '#ef4444', backgroundColor: 'rgba(254, 242, 242, 0.8)'}}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5" style={{color: '#dc2626'}} />
                    <p className="text-sm font-medium" style={{color: '#dc2626'}}>{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auth Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Name field for signup */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium mb-2" style={{color: '#2c423f'}}>
                      Full Name
                    </label>
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200" style={{color: '#93a57b'}} />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        style={{
                          borderColor: '#e5e7eb',
                          backgroundColor: 'rgba(249, 250, 251, 0.8)'
                        }}
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email field */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{color: '#2c423f'}}>
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200" style={{color: '#93a57b'}} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    style={{
                      borderColor: '#e5e7eb',
                      backgroundColor: 'rgba(249, 250, 251, 0.8)'
                    }}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              {/* Password field */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="password" className="block text-sm font-medium mb-2" style={{color: '#2c423f'}}>
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200" style={{color: '#93a57b'}} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    style={{
                      borderColor: '#e5e7eb',
                      backgroundColor: 'rgba(249, 250, 251, 0.8)'
                    }}
                    placeholder="Enter your password"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 hover:opacity-70 transition-all duration-200"
                    style={{color: '#93a57b'}}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Password Requirements Display (only for signup) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    className="mt-2 p-4 rounded-2xl backdrop-blur-sm"
                    style={{backgroundColor: 'rgba(248, 250, 252, 0.8)'}}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm font-medium mb-3" style={{color: '#2c423f'}}>
                      Password Requirements:
                    </p>
                    <div className="space-y-2">
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
                          <motion.div
                            key={index}
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <motion.div
                              className={`w-3 h-3 rounded-full flex items-center justify-center ${
                                isMet ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                              whileHover={{ scale: 1.2 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {isMet && <CheckCircle className="w-2 h-2 text-white" />}
                            </motion.div>
                            <span
                              className={`text-sm transition-colors duration-200 ${
                                isMet ? 'text-green-600 font-medium' : 'text-gray-500'
                              }`}
                            >
                              {requirement}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Real-time Password Validation Errors */}
              <AnimatePresence>
                {!isLogin && passwordErrors.length > 0 && formData.password && (
                  <motion.div
                    className="mt-2 p-4 rounded-2xl border backdrop-blur-sm"
                    style={{borderColor: '#fbbf24', backgroundColor: 'rgba(254, 243, 199, 0.8)'}}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <p className="text-sm font-medium mb-2 flex items-center space-x-2" style={{color: '#92400e'}}>
                      <XCircle className="w-4 h-4" />
                      <span>Password needs improvement:</span>
                    </p>
                    <ul className="space-y-1">
                      {passwordErrors.map((error, index) => (
                        <motion.li
                          key={index}
                          className="text-sm flex items-center space-x-2"
                          style={{color: '#92400e'}}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span>•</span>
                          <span>{error}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirm Password field for signup */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{color: '#2c423f'}}>
                      Confirm Password
                    </label>
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200" style={{color: '#93a57b'}} />
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        style={{
                          borderColor: '#e5e7eb',
                          backgroundColor: 'rgba(249, 250, 251, 0.8)'
                        }}
                        placeholder="Confirm your password"
                        required={!isLogin}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 text-lg font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden" 
                  style={{backgroundColor: '#677d61', color: '#ffffff'}}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, #677d61 0%, #93a57b 50%, #677d61 100%)'
                    }}
                    animate={{
                      background: [
                        'linear-gradient(135deg, #677d61 0%, #93a57b 50%, #677d61 100%)',
                        'linear-gradient(135deg, #93a57b 0%, #677d61 50%, #93a57b 100%)',
                        'linear-gradient(135deg, #677d61 0%, #93a57b 50%, #677d61 100%)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Sparkle effect */}
                  <motion.div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/60"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Please wait...
                      </>
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <Sparkles className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </motion.form>

            {/* Toggle between Login/Signup */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm mb-2" style={{color: '#93a57b'}}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                    setError('');
                    setPasswordErrors([]);
                  }}
                  className="text-lg font-medium hover:underline backdrop-blur-sm"
                  style={{color: '#677d61'}}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Button>
              </motion.div>
            </motion.div>

            {/* Back to Home */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Link href="/" className="inline-flex items-center text-sm hover:underline backdrop-blur-sm transition-all duration-200" style={{color: '#93a57b'}}>
                <motion.div whileHover={{ x: -5 }}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </motion.div>
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
