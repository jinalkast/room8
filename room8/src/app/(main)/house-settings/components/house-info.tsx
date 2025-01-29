import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { THouse } from '../types';
import { Button } from '@/components/ui/button';
import { Edit, Plus } from 'lucide-react';
import RoommatesTable from '@/components/roommates-table';
import { Modal } from '@/components/modal';
import InviteUserModal from './invite-user-modal';

type props = {
  house: THouse;
};

function HouseInfo({ house }: props) {
  return (
    <div className="flex gap-6">
      <div className="basis-2/3 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>House Info</CardTitle>
            <CardDescription>Manage and view your house information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <p className="font-semibold">Name:</p>
                <p>{house.name}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-semibold">Address:</p>
                <p>{house.address}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-semibold">ChatBot Active:</p>
                {house.chatbotActive ? (
                  <div className="w-4 h-4 rounded-sm bg-green-500" />
                ) : (
                  <div className="w-4 h-4 rounded-sm bg-red-500" />
                )}
              </div>
            </div>
            <Modal
              title="Edit House Info"
              description={`Edit name and address of your house`}
              trigger={
                <Button>
                  <Edit /> Edit Info
                </Button>
              }>
              <p>update me</p>
            </Modal>
            <InviteUserModal house={house} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Housemates</CardTitle>
            <CardDescription>See who you&apos;re living with!</CardDescription>
          </CardHeader>
          <CardContent>
            <RoommatesTable remove />
          </CardContent>
        </Card>
      </div>

      <Card className="basis-1/3 h-[85vh]">
        <CardHeader>
          <CardTitle>House Notes</CardTitle>
          <CardDescription>See what your roommates are saying!</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default HouseInfo;
