'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useAllCompletedChores from '../hooks/useGetAllCompletedChores';
import Image from 'next/image';
import LoadingSpinner from '@/components/loading';

export default function ChoreHistory() {
  const { data: completedChores, isLoading } = useAllCompletedChores();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chore History</CardTitle>
        <CardDescription>View completed chores history.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col max-h-[300px] overflow-y-auto border rounded-lg">
          {completedChores?.map((chore) => (
            <div key={chore.id} className="border-b p-4">
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src={chore.responsible.profile.image_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
                />
                <span className="font-medium">{chore.responsible.profile.name}</span>
                <span className="text-muted-foreground ml-auto">
                  {new Date(chore.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Completed {chore.chore.chores.title} on{' '}
                {new Date(chore.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
