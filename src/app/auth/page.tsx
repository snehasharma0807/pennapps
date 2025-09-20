'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Auth Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">
              Welcome to WorkFlow AI
            </CardTitle>
            <CardDescription>
              Sign in with your email and password to access your productivity dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading...</p>
              </div>
            ) : (
              <>
                {/* Email/Password Login */}
                <a href="/api/auth/login">
                  <Button className="w-full" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Sign In with Auth0
                  </Button>
                </a>

                {/* Auth Notice */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>Secure Authentication:</strong> Sign in with your email and password through Auth0's secure platform.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Options */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <Link href="#" className="text-indigo-600 hover:text-indigo-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-indigo-600 hover:text-indigo-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
