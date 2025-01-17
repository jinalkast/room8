'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="grid place-content-center min-h-screen text-center">
      <h1 className="text-[100px] font-thin tracking-[16px]">ROOM8</h1>
      <h2 className="mt-4 text-[40px] font-light text-muted-foreground">
        Proof of Concept Demo By <span className="text-macAccent">Team 19</span>
      </h2>
      <Link href="/auth">
        <Button className="mt-12 text-[30px] p-8">Sign In</Button>
      </Link>
    </div>
  );
}
