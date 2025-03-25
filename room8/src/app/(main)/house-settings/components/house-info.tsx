import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { THouse } from '../types';
import RoommatesTable from '@/components/roommates-table';
import InviteUserModal from '@/app/(main)/house-settings/components/invite-user-modal';
import EditHouseModal from '@/app/(main)/house-settings/components/edit-house-modal';
import HouseNotes from '@/app/(main)/house-settings/components/house-notes';
import ActivateCameraCard from '@/app/(main)/house-settings/components/activate-camera-card';
import PendingInvitesTable from '@/app/(main)/house-settings/components/pending-roommates-table';
import UserGuideModal from '@/components/user-guide-modal';
import { USER_GUIDE } from '@/lib/constants/user-guide';

type props = {
  house: THouse;
};

function HouseInfo({ house }: props) {
  return (
    <div className="flex gap-6">
      <div className="basis-2/3 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              House Info <UserGuideModal data={USER_GUIDE.H_INFO} />
            </CardTitle>
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
            <EditHouseModal house={house} />
            <InviteUserModal house={house} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              Housemates <UserGuideModal data={USER_GUIDE.H_MEMBERS} />
            </CardTitle>
            <CardDescription>See who you&apos;re living with!</CardDescription>
          </CardHeader>
          <CardContent>
            <RoommatesTable remove />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              Pending Invites <UserGuideModal data={USER_GUIDE.H_INVITES} />
            </CardTitle>
            <CardDescription>We&apos;re waiting on a response from these people</CardDescription>
          </CardHeader>
          <CardContent>
            <PendingInvitesTable remove />
          </CardContent>
        </Card>
        <ActivateCameraCard />
      </div>

      <HouseNotes />
    </div>
  );
}

export default HouseInfo;
