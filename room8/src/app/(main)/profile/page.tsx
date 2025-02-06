'use client';

import useUser from '@/app/auth/hooks/useUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function ProfilePage() {
  const { data: user, status: userFetchStatus } = useUser();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (userFetchStatus === 'pending') {
    return 'Loading...';
  }

  if (userFetchStatus === 'error') {
    return 'Error fetching user';
  }

  return (
    <div>
      <h2 className="text-4xl mb-2">My Profile</h2>
      <h3 className="text-2xl text-muted-foreground mb-4">Edit everything about yourself</h3>
      <Card className="h-[85vh] w-1/2 rounded-3xl brightness-150 mr-20">
        <CardContent className="h-full flex flex-col">
          <div className="w-full flex flex-col items-center justify-center mt-6">
            <Avatar className="w-48 h-48 mb-2">
              <AvatarImage alt="your profile picture" src={user!.image_url} />
              <AvatarFallback>Your PFP</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl">{user!.name}</h2>
            <h3 className="text-muted text-xl mb-5">
             {(user!.email)}
            </h3>
            <h3 className="text-muted text-xl mb-5 border-b-2 w-full text-center pb-2">
              Joined: {new Date(user!.created_at).toLocaleDateString()}
            </h3>
          </div>
          {!isEditing ? <div>
            <span><Phone/> {user.</span>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-primary h-[50px] w-full text-white rounded-md">
              Edit Profile
            </Button>
          </div> : <div className="mt flex flex-col gap-2 flex-grow space-y-4 mt-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name:</label>
              <Input
                id="name"
                type="text"
                value={user?.name || ''}
                disabled={!isEditing}
                className="p-2 border rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email:</label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled={!isEditing}
                className="p-2 border rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="joined">Joined:</label>
              <Input
                id="joined"
                type="text"
                value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                disabled={true}
                className="p-2 border rounded-md"
              />
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-primary h-[50px] w-full text-white rounded-md">
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>}
          
        </CardContent>
      </Card>
    </div>
  );
}
