import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HouseInvites() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invites</CardTitle>
        <CardDescription>
          If you are sent an invite to join a house, it will appear here.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
