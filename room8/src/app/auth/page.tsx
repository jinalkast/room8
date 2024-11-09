'use client';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function AuthPage() {
  const handleLoginWithOAuth = (provider: 'google') => {
    const supabase = supabaseBrowser();
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: location.origin + '/auth/callback'
      }
    });
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className=" w-96 rounded-md border p-5 space-y-5 relative">
        <div className="flex items-center gap-2">
          <KeyRound />
          <h1 className="text-2xl font-bold">Room8</h1>
        </div>

        <div className="flex flex-col gap-5">
          <Button
            className=" w-full flex items-center gap-2 "
            variant="outline"
            onClick={() => handleLoginWithOAuth('google')}>
            <FcGoogle /> Google
          </Button>
        </div>
        <div className="glowBox -z-10"></div>
      </div>
    </div>
  );
}
