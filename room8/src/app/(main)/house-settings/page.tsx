import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import HouseInvites from './components/house-invites';

export default function HouseSettingsPage() {
  return (
    <div>
      <h2 className="text-4xl mb-6">My House</h2>
      <div className="flex gap-6">
        <div className="basis-2/3 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>House Information</CardTitle>
              <CardDescription>
                Your are currently not in any house, to get access to all the features of Room8,
                create or join a house.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>
                <Plus /> Create House
              </Button>
              <Button className="ml-4">
                <Plus /> Invite Roommate
              </Button>
            </CardContent>
          </Card>
          <HouseInvites />
          {false && (
            <Card>
              <CardHeader>
                <CardTitle>Housemates</CardTitle>
                <CardDescription>See who you&apos;re living with!</CardDescription>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          )}
        </div>
        {false && (
          <Card className="basis-1/3 h-[85vh]">
            <CardHeader>
              <CardTitle>House Notes</CardTitle>
              <CardDescription>See what your roommates are saying!</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
