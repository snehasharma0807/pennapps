'use client';

import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function TestIconsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Icon Test Page</h1>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Lucide React Icons</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>User Icon</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Mail Icon</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Lock Icon</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Eye Icon</span>
              </div>
              <div className="flex items-center space-x-2">
                <EyeOff className="h-5 w-5" />
                <span>EyeOff Icon</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>ArrowLeft Icon</span>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Navigation</h2>
            <div className="space-x-4">
              <a href="/auth" className="text-blue-500 hover:underline">Go to Auth Page</a>
              <a href="/" className="text-blue-500 hover:underline">Go to Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
