'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TestAuthPage() {
  const { user: customUser, logout: customLogout } = useAuth();
  const { user: auth0User, logout: auth0Logout } = useUser();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Auth0 User</h2>
            {auth0User ? (
              <div>
                <p><strong>Name:</strong> {auth0User.name}</p>
                <p><strong>Email:</strong> {auth0User.email}</p>
                <p><strong>ID:</strong> {auth0User.sub}</p>
                <Button onClick={() => auth0Logout()} className="mt-4">
                  Logout from Auth0
                </Button>
              </div>
            ) : (
              <p>Not logged in with Auth0</p>
            )}
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Custom Auth User</h2>
            {customUser ? (
              <div>
                <p><strong>Name:</strong> {customUser.name}</p>
                <p><strong>Email:</strong> {customUser.email}</p>
                <p><strong>ID:</strong> {customUser.id}</p>
                <p><strong>Email Verified:</strong> {customUser.emailVerified ? 'Yes' : 'No'}</p>
                <Button onClick={() => customLogout()} className="mt-4">
                  Logout from Custom Auth
                </Button>
              </div>
            ) : (
              <p>Not logged in with custom auth</p>
            )}
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-x-4">
              <Link href="/auth">
                <Button>Go to Auth Page</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Go to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
