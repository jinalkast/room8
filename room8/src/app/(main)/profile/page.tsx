'use client';

import useUser from '@/app/auth/hooks/useUser';
import MutateLoadingSpinner from '@/components/mutate-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useEditProfile from './hooks/useEditProfile';
import { updateProfilePayload } from './types';

export default function ProfilePage() {
  const { data: user, status: userFetchStatus } = useUser();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatePayload, setUpdatePayload] = useState<updateProfilePayload>({
    phoneNumber: '',
    name: '',
    profilePicture: null
  });
  const { mutate: editProfile, isPending: pendingUserUpdate } = useEditProfile({
    onSuccessCallback: () => {
      setUpdatePayload({
        phoneNumber: user!.phone,
        name: user!.name,
        profilePicture: null
      });
      setIsEditing(false);
    }
  });

  function handleChange<K extends keyof updateProfilePayload>(
    field: K,
    value: updateProfilePayload[K] | Blob | null
  ) {
    if (field === 'profilePicture' && value instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatePayload((old) => ({ ...old, [field]: reader.result as string }));
      };
      reader.readAsDataURL(value);
    } else {
      setUpdatePayload((old) => ({ ...old, [field]: value }));
    }
  }

  function handleSaveChanges() {
    editProfile({ userID: user!.id, payload: updatePayload });
  }

  function handleCancelChanges() {
    if (user) {
      setUpdatePayload({
        phoneNumber: user.phone,
        name: user.name,
        profilePicture: null
      });
    }
    setIsEditing(false);
  }

  useEffect(() => {
    if (user) {
      setUpdatePayload({
        phoneNumber: user.phone,
        name: user.name,
        profilePicture: null
      });
    }
  }, [user]);

  if (userFetchStatus === 'pending') {
    return 'Loading...';
  }

  if (userFetchStatus === 'error') {
    return 'Error fetching user';
  }

  return (
    <div>
      <h2 className="text-4xl mb-8">My Profile</h2>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>View and edit your profile information</CardDescription>
        </CardHeader>
        <CardContent className="h-full flex flex-col overflow-auto">
          <div className="w-full flex flex-col items-center justify-center mt-6">
            <div className="relative w-48 h-48 rounded-full overflow-hidden">
              {isEditing && updatePayload.profilePicture !== null ? (
                <Image
                  fill
                  alt="your profile picture"
                  src={updatePayload.profilePicture}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              ) : (
                <Image
                  fill
                  alt="your profile picture"
                  src={user!.image_url}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              )}
            </div>

            <p className="text-2xl mt-4">{user!.name}</p>
            <p className="text-muted-foreground text-lg mb-2">{user!.email}</p>
            <p className="text-muted-foreground text-lg mb-2 text-center">
              Joined {new Date(user!.created_at).toUTCString()}
            </p>
            {user?.phone && (
              <span className="text-muted-foreground">
                <Phone className="inline" />
                {user!.phone}
              </span>
            )}
          </div>
          {!isEditing ? (
            <div className="flex flex-col items-center mt-6">
              <Button onClick={() => setIsEditing(!isEditing)} className="w-full">
                Edit Profile
              </Button>
            </div>
          ) : (
            <div className="mt flex flex-col gap-2 flex-grow space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name">Name:</label>
                <Input
                  id="name"
                  type="text"
                  value={updatePayload.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="p-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <Input
                  id="phoneNumber"
                  type="text"
                  value={updatePayload.phoneNumber || ''}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  className="p-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="profilePicture">Profile Picture:</label>
                <Input
                  id="profilePicture"
                  type="file"
                  value={''}
                  onChange={(e) => {
                    const file = e.target?.files ? e.target.files[0] : null;
                    handleChange('profilePicture', file);
                  }}
                  className="p-2 border rounded-md"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveChanges} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={handleCancelChanges} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <MutateLoadingSpinner condition={pendingUserUpdate} />
    </div>
  );
}
