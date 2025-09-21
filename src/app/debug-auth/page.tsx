'use client';

import { useState } from 'react';

export default function DebugAuthPage() {
  const [testData, setTestData] = useState({
    email: 'test@example.com',
    password: 'TestPass123!',
    name: 'Test User'
  });

  const testRegistration = async () => {
    try {
      const response = await fetch('/api/auth/custom-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      console.log('Registration response:', data);
      alert(`Registration: ${response.ok ? 'Success' : 'Failed'}\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Registration error:', error);
      alert(`Registration error: ${error}`);
    }
  };

  const testLogin = async () => {
    try {
      const response = await fetch('/api/auth/custom-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testData.email,
          password: testData.password
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);
      alert(`Login: ${response.ok ? 'Success' : 'Failed'}\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Auth API Debug Page</h1>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Data</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium">Email:</label>
                <input
                  type="email"
                  value={testData.email}
                  onChange={(e) => setTestData({...testData, email: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password:</label>
                <input
                  type="password"
                  value={testData.password}
                  onChange={(e) => setTestData({...testData, password: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Name:</label>
                <input
                  type="text"
                  value={testData.name}
                  onChange={(e) => setTestData({...testData, name: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-x-4">
              <button
                onClick={testRegistration}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Test Registration
              </button>
              <button
                onClick={testLogin}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Test Login
              </button>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
            <div className="space-y-2 text-sm">
              <p><strong>JWT_SECRET:</strong> {process.env.NEXT_PUBLIC_JWT_SECRET ? 'Set' : 'Not set'}</p>
              <p><strong>MONGODB_URI:</strong> {process.env.NEXT_PUBLIC_MONGODB_URI ? 'Set' : 'Not set'}</p>
              <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server side'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
