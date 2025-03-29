'use client';

import { Menu } from 'lucide-react';
import MenuLogo from './menu-logo';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import Link from 'next/link';
import { HOUSE_PAGES, USER_PAGES } from './menu-links';
import useUser from '@/app/auth/hooks/useUser';
import useGetHouse from '@/hooks/useGetHouse';

export default function MobileMenu() {
  const { data: house } = useGetHouse();
  const { data: user } = useUser();

  return (
    <div className="bg-macMaroon h-16 flex items-center justify-between p-2">
      <div className="basis-[120px]">
        <MenuLogo />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white mr-2">
            <Menu className="!h-8 !w-8" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-macMaroon text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Menu</SheetTitle>
          </SheetHeader>

          <div className="py-4 flex flex-col">
            <p className="uppercase text-sm tracking-widest mb-2 opacity-80">House Management</p>
            {Object.values(HOUSE_PAGES).map((page) => {
              if (page.auth && !user?.house_id) return null;
              if (page.camera && !house?.cameraId) return null;

              return (
                <SheetClose asChild>
                  <Link
                    key={page.path}
                    href={page.path}
                    className="flex items-center gap-2 px-2 py-3 hover:bg-macMaroon/80 rounded">
                    {page.icon}
                    {page.title}
                  </Link>
                </SheetClose>
              );
            })}

            <p className="uppercase text-sm tracking-widest mt-6 mb-2 opacity-80">
              User Management
            </p>
            {Object.values(USER_PAGES).map((page) => {
              if (page.auth && !user?.house_id) return null;

              return (
                <SheetClose asChild>
                  <Link
                    key={page.path}
                    href={page.path}
                    className="flex items-center gap-2 px-2 py-3 hover:bg-macMaroon/80 rounded">
                    {page.icon}
                    {page.title}
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
