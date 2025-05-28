'use client';

export const dynamic = 'force-dynamic';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';

function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to Recall</CardTitle>
          <CardDescription>Sign in to start creating and studying flashcards</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: callbackUrl })}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loading /></div>}>
      <SignIn />
    </Suspense>
  );
}