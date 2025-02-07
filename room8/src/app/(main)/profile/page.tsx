'use client';

import useUser from '@/app/auth/hooks/useUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { updateProfilePayload } from './types';
import useEditProfile from './hooks/useEditProfile';
import MutateLoadingSpinner from '@/components/mutate-loading';

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

    if (field === "profilePicture" && value instanceof Blob) {
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
      })
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

      <h2 className="text-4xl mb-2">My Profile</h2>
      <h3 className="text-2xl text-muted-foreground mb-4">Edit everything about yourself</h3>
      <Card className="h-[85vh] w-1/2 rounded-3xl brightness-150 mr-20">
        <CardContent className="h-full flex flex-col overflow-auto">
          <div className="w-full flex flex-col items-center justify-center mt-6">
            <Avatar className="w-48 h-48 mb-2">
              {isEditing && updatePayload.profilePicture !== null ? (
                <AvatarImage alt="your profile picture" src={updatePayload.profilePicture} />)
                :
                <AvatarImage alt="your profile picture" src={user!.image_url} />
              }
              <AvatarFallback>Your PFP</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl">{user!.name}</h2>
            <h3 className="text-muted text-xl mb-5">{user!.email}</h3>
            <h3 className="text-muted text-xl mb-5 border-b-2 w-full text-center pb-2">
              Joined: {new Date(user!.created_at).toLocaleDateString()}
            </h3>
          </div>
          {!isEditing ? (
            <div className="flex flex-col items-center">
              <span>
                <Phone className="inline" />
                {user!.phone}
              </span>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="m-auto px-4 py-2 bg-primary h-[50px] w-full text-white rounded-md">
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
                <label htmlFor="joined">Phone Number:</label>
                <Input
                  id="phoneNumber"
                  type="text"
                  value={updatePayload.phoneNumber || ''}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  className="p-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="joined">Profile Picture:</label>
                <Input
                  id="profilePicture"
                  type="file"
                  value={''}
                  onChange={(e) => {
                    const file = e.target?.files ? e.target.files[0] : null;
                    handleChange("profilePicture", file);
                  }}
                  className="p-2 border rounded-md"
                />

              </div>
              <Button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-primary h-[50px] w-full text-white rounded-md">
                Save Changes
              </Button>
              <Button
                onClick={handleCancelChanges}
                className="px-4 py-2 bg-primary h-[50px] w-full text-white rounded-md">
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <MutateLoadingSpinner condition={pendingUserUpdate} />

    </div>
  );
}
