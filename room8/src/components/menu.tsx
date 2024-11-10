'use client';

import useSignOut from '@/app/auth/hooks/useSignOut';
import useUser from '@/app/auth/hooks/useUser';
import { cn } from '@/lib/utils';
import { BotMessageSquare, CalendarCheck, House, Receipt, School, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

export default function Menu() {
  const { data: user, isLoading: userLoading } = useUser();
  const signout = useSignOut();

  const pathname = usePathname();

  const PAGES = {
    dashboard: { path: '/dashboard', icon: <House />, title: 'Dashboard' },
    billSplitter: { path: '/bill-splitter', icon: <Receipt />, title: 'Bill Splitter' },
    choreSchedule: { path: '/schedule', icon: <CalendarCheck />, title: 'Chore Schedule' },
    chatBot: { path: '/chatbot', icon: <BotMessageSquare />, title: 'ChatBot' },
    settings: { path: '/settings', icon: <Settings />, title: 'Settings' }
  };

  return (
    <div className="fixed w-[300px] h-[90vh] top-[0] left-[0] border-r bg-macMaroon rounded-lg m-12 p-4 flex flex-col">
      <div className="flex gap-4 items-center">
        <div className="p-2 rounded-full bg-macAccent">
          <School color="#332611" />
        </div>
        <h1 className="text-2xl font-light tracking-[5px] uppercase">Room8</h1>
      </div>

      <div className="mt-12">
        <ul className="space-y-4">
          {Object.values(PAGES).map((page) => (
            <Link
              href={page.path}
              key={page.path}
              className={cn(
                'text-lg flex gap-3 items-center cursor-pointer hover:bg-[#955363] p-2 rounded-md transition-all',
                {
                  'bg-[#490024]': pathname === page.path
                }
              )}>
              {page.icon}
              {page.title}
            </Link>
          ))}
        </ul>
      </div>

      {user && (
        <div className="p-3 bg-[#490024] rounded-md mt-auto flex gap-4 items-center">
          <Image
            alt="profile picture"
            src={user.image_url}
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <h2>{user.name}</h2>
            <Button
              variant="link"
              onClick={signout}
              className="text-sm text-macAccent p-0 m-0 h-fit">
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
