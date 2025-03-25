'use client';

import { Button } from '@/components/ui/button';
import { supabaseBrowser } from '@/lib/supabase/browser';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

export default function HomePage() {
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
    <div className="grid place-content-center min-h-screen text-center">
      <div className="w-[90vw] h-[83vh] relative grid place-content-center">
        <Image
          src="/images/landing.jpg"
          alt="McMaster housing building"
          fill
          objectFit="cover"
          objectPosition="bottom"
          className="rounded-2xl opacity-50 blur-sm"
        />
        <div className="relative z-40 flex items-center flex-col">
          <h1 className="text-[120px] tracking-[16px] text-white">
            ROOM<span className="text-macAccent">8</span>
          </h1>
          <h2 className="w-[1000px] text-xl text-white">
            Room8 is the ultimate roommate management app designed to keep your shared home running
            smoothly. From organizing chores and splitting bills to monitoring cleanliness and
            chatting with your house group, Room8 takes the stress out of co-living
          </h2>
          <Button
            className="flex items-center gap-2 mt-8 px-10 py-6 text-xl border border-white backdrop-blur-md hover:bg-transparent hover:-translate-y-1 transition-all hover:backdrop-blur-lg"
            variant="ghost"
            onClick={() => handleLoginWithOAuth('google')}>
            <FcGoogle /> Sign In with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
