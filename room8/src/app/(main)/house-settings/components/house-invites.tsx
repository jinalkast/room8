import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useGetInvites from '../hooks/useGetInvites';
import LoadingSpinner from '@/components/loading';
import { Button } from '@/components/ui/button';
import useAcceptInvite from '../hooks/useAcceptInvite';
import useDeclineInvite from '../hooks/useDeclineInvite';

export default function HouseInvites() {
  const { data: invites, isLoading } = useGetInvites();
  const { mutate: acceptInvite } = useAcceptInvite();
  const { mutate: declineInvite } = useDeclineInvite();

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
                    <p>
                      {invite.inviter.name} invited you to join {invite.house.name} at{' '}
                      {invite.house.address}
                    </p>
                    <p>{invite.inviter.email}</p>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={() => acceptInvite(invite.id)}>Accept</Button>
                    <Button variant="destructive" onClick={() => declineInvite(invite.id)}>
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
