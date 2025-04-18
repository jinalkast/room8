import LoadingSpinner from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import useAcceptInvite from '../hooks/useAcceptInvite';
import useDeclineInvite from '../hooks/useDeclineInvite';
import useGetInvites from '../hooks/useGetInvites';

export default function HouseInvites() {
  const { data: invites, isLoading } = useGetInvites();
  const { mutate: acceptInvite, isPending: acceptInvitePending } = useAcceptInvite();
  const { mutate: declineInvite, isPending: declineInvitePending } = useDeclineInvite();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Pending Invites</CardTitle>
        <CardDescription>
          If you are sent an invite to join a house, it will appear here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isLoading ? (
          <div className="flex flex-col gap-4">
            {invites &&
              invites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between">
                  <div>
                    <div className="flex gap-4 items-center">
                      <Image
                        src={invite.inviter.imageUrl}
                        alt={invite.inviter.name}
                        width={48}
                        height={48}
                        className="rounded-full h-10 w-10"
                      />
                      <p>
                        <span className="font-bold text-macAccent">{invite.inviter.name}</span>{' '}
                        invited you to join{' '}
                        <span className="font-bold text-macAccent">{invite.house.name}</span> at{' '}
                        <span className="font-bold text-macAccent">{invite.house.address}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button disabled={acceptInvitePending} onClick={() => acceptInvite(invite.id)}>
                      Accept
                    </Button>
                    <Button
                      disabled={declineInvitePending}
                      variant="destructive"
                      onClick={() => declineInvite(invite.id)}>
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </CardContent>
    </Card>
  );
}
