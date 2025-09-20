'use client';

import { Button } from '@/components/ui/button';
import { Brain, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Animated Logo */}
      <div className="w-1/2 flex items-center justify-center p-8" style={{backgroundColor: '#ffffff'}}>
        <div className="text-center">
          {/* Animated Logo Container */}
          <div className="logo-container">
            {/* intention.ai */}
            <div className="logo-text">
              <span className="i-dot">i</span>ntention<span className="i-dot">i</span>.ai
            </div>
            
            {/* intentionalai */}
            <div className="logo-text">
              ìntentionìai
            </div>
            
            {/* intentional with strikethrough */}
            <div className="logo-text">
              <span className="i-dot">i</span>ntentional
              <div className="logo-strikethrough"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="w-1/2 flex flex-col justify-center p-12" style={{backgroundColor: '#bfcc94'}}>
        {/* Header with Logo and Login */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="static-logo">
            <Logo variant="intention-ai" />
          </Link>
          <Link href="/auth">
            <Button variant="ghost" className="login-button" style={{color: '#2c423f'}}>Log in</Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight" style={{color: '#2c423f'}}>
            <span style={{color: '#677d61'}}>3 signals.</span> <span style={{color: '#93a57b'}}>1 glance.</span> <em style={{color: '#fffd7a', fontStyle: 'italic'}}>Intentional productivity</em>
          </h1>
          
          <div className="mb-8">
            <Link href="/extension">
              <Button size="lg" className="text-white text-lg px-8 py-4 rounded-lg" style={{backgroundColor: '#677d61'}}>
                Add to Chrome - It's Free
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#677d61'}}></div>
              <span style={{color: '#2c423f'}}>Real-time emotion detection</span>
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
    </div>
  );
}