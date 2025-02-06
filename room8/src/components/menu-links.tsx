'use client';

import { cn } from '@/lib/utils';
import { BotMessageSquare, CalendarCheck, House, HousePlus, Receipt, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Page = {
  path: string;
  icon: JSX.Element;
  title: string;
};

const MenuLinkButton = ({ page, pathname }: { page: Page; pathname: string }) => {
  return (
    <div className="relative">
      <Link
        href={page.path}
        className={cn('flex gap-3 items-center cursor-pointer p-4 rounded-full', {
          'bg-background rounded-r-none': pathname === page.path,
          'hover:bg-[#955363]': pathname !== page.path
        })}>
        {page.icon}
        {page.title}
      </Link>
      <div
        className={cn('absolute top-0 -right-6 w-6 h-full bg-inherit', {
          'bg-background': pathname === page.path
        })}
      />

      <div
        className={cn('absolute -top-4 w-4 h-4 -right-6', {
          'bg-background': pathname === page.path
        })}>
        <div
          className={cn('w-full h-full rounded-br-full', {
            'bg-macMaroon ': pathname === page.path
          })}></div>
      </div>

      <div
        className={cn('absolute -bottom-4 w-4 h-4 -right-6', {
          'bg-background': pathname === page.path
        })}>
        <div
          className={cn('w-full h-full rounded-tr-full', {
            'bg-macMaroon': pathname === page.path
          })}></div>
      </div>
    </div>
  );
};

const MenuLinks = () => {
  const pathname = usePathname();

  const HOUSE_PAGES = {
    dashboard: { path: '/dashboard', icon: <House />, title: 'Dashboard' },
    billSplitter: { path: '/bill-splitter', icon: <Receipt />, title: 'Bill Splitter' },
    choreSchedule: { path: '/schedule', icon: <CalendarCheck />, title: 'Chore Schedule' },
    chatBot: { path: '/chatbot', icon: <BotMessageSquare />, title: 'ChatBot' }
  };

  const USER_PAGES = {
    houseSettings: { path: '/house-settings', icon: <HousePlus />, title: 'My House' },
    profile: { path: '/profile', icon: <User />, title: 'My Profile' }
  };

  return (
    <div className="mt-14">
      <p className="uppercase text-sm tracking-widest mb-4 opacity-80">House Management</p>
      <ul className="space-y-6">
        {Object.values(HOUSE_PAGES).map((page) => (
          <MenuLinkButton key={page.path} page={page} pathname={pathname} />
        ))}
      </ul>
      <p className="uppercase text-sm tracking-widest mt-8 mb-4 opacity-80">USER MANAGEMENT</p>
      <ul className="space-y-6">
        {Object.values(USER_PAGES).map((page) => (
          <MenuLinkButton key={page.path} page={page} pathname={pathname} />
        ))}
      </ul>
    </div>
  );
};

export default MenuLinks;
