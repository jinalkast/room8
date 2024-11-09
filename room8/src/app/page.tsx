'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="grid place-content-center min-h-screen">
      <Link href="/auth">
        <Button>Sign In</Button>
      </Link>
    </div>
  );
}
