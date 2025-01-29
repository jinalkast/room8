import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import HouseInvites from './house-invites';

type props = {};

function CreateHouse({}: props) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>House Information</CardTitle>
          <CardDescription>
            Your are currently not in any house, to get access to all the features of Room8, create
            or join a house.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            <Plus /> Create House
          </Button>
        </CardContent>
      </Card>
      <HouseInvites />
    </div>
  );
}

export default CreateHouse;
