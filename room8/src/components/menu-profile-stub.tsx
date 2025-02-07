'use client';

import useSignOut from '@/app/auth/hooks/useSignOut';
import useUser from '@/app/auth/hooks/useUser';
import Image from 'next/image';
import { Button } from './ui/button';

const MenuProfileStub = () => {
  const { data: user } = useUser();
  const signout = useSignOut();

  return (
    user && (
      <div className="p-3 bg-[#490024] rounded-full mt-auto flex gap-4 items-center">
        <Image
          alt="profile picture"
          src={user.image_url}
          width={32}
          height={32}
          className="rounded-full w-10 h-10"
        />
        <div>
          <h2 className="text-sm">{user.name}</h2>
          <Button variant="link" onClick={signout} className="text-xs text-macAccent p-0 m-0 h-fit">
            Sign Out
          </Button>
        </div>
      </div>
    )
  );
};
export default MenuProfileStub;
