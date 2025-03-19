'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useAllCompletedChores from '@/app/(main)/schedule/hooks/useGetAllCompletedChores';
import Image from 'next/image';
import LoadingSpinner from '@/components/loading';
import useBillsHistory from '@/app/(main)/bill-splitter/hooks/useBillHistory';
import useRoommates from '@/hooks/useRoommates';
import useGetCleanlinessTasks from '@/app/(main)/cleanliness-manager/hooks/useGetCleanlinessTasks';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useMemo, useState } from 'react';

type historyItem = {
  person: {
    name: string;
    image_url: string;
    id: string;
  };
  text: string;
  date: string;
};

const ALL_USER_ID = '123';

export default function HouseHistory() {
  const { data: roommates, isLoading: isRoommatesLoading } = useRoommates();
  const { data: completedChores, isLoading: isChoresLoading } = useAllCompletedChores();
  const { data: billHistory, isLoading: isBillHistoryLoading } = useBillsHistory(1);
  const { data: cleanlinessTasks, isLoading: isCleanlinessTasksLoading } = useGetCleanlinessTasks();
  const [selectedUserID, setSelectedUserID] = useState<string>(ALL_USER_ID);

  const historyItems = useMemo(() => {
    if (!completedChores || !billHistory || !cleanlinessTasks || !roommates) {
      return [];
    }

    return completedChores!
      .map((chore) => {
        return {
          person: {
            name: chore.responsible.profile.name,
            image_url: chore.responsible.profile.image_url,
            id: chore.responsible.id
          },
          date: chore.created_at,
          text: `Completed ${chore.chore.chores.title} on ${new Date(chore.created_at).toLocaleString()}`
        };
      })
      .concat(
        billHistory!.map((bill) => {
          return {
            person: {
              id: bill.debtor_id,
              name: bill.debtor,
              image_url: roommates?.find((r) => r.name === bill.debtor)?.imageUrl || ''
            },
            date: bill.date_paid,
            text: `${bill.debtor} paid ${bill.loaner} $${bill.amount_paid} for ${bill.bill_name || 'Untitled Debt'} on ${new Date(bill.date_paid).toLocaleString()}`
          };
        })
      )
      .concat(
        cleanlinessTasks!
          .filter((task) => task.status === 'completed')
          .map((task) => {
            return {
              person: {
                id: task.completed_by.id,
                name: task.completed_by.name,
                image_url: task.completed_by.image_url || ''
              },
              date: task.completed_at!,
              text: `${task.completed_by.name} completed ${task.name} on ${new Date(task.completed_at!).toLocaleString()}`
            };
          })
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [completedChores, billHistory, cleanlinessTasks, roommates]);

  if (isChoresLoading || isBillHistoryLoading || isCleanlinessTasksLoading || isRoommatesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="w-full xl:w-2/3">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2 className="text-xl">House History</h2>
          <div className='flex items-center gap-2'>
            <p className='text-sm'>Filter by roommate:</p>
          <Select value={selectedUserID} onValueChange={(value) => setSelectedUserID(value)}>
            <SelectTrigger className="w-[180px] bg-macMaroon">
              <SelectValue placeholder="Filter by roommate" />
            </SelectTrigger>
            <SelectContent>
              {roommates?.map((roommate) => (
                <SelectItem key={roommate.id} value={roommate.id} className="flex items-center">
                  {roommate.name}
                </SelectItem>
              ))}
              <SelectItem value={ALL_USER_ID} className="flex items-center">
                All Roommates
              </SelectItem>
            </SelectContent>
          </Select>
          </div>
        </CardTitle>
        <CardDescription>View everything that's ever happened in one spot!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col max-h-[900px] overflow-y-auto border rounded-lg">
          {historyItems
            ?.filter((i) =>
              selectedUserID === ALL_USER_ID ? true : i.person.id === selectedUserID
            )
            .map((item, index) => (
              <div key={`History item ${index}`} className="border-b p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={item.person.image_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                    width={32}
                    height={32}
                  />
                  <span className="font-medium">{item.person.name}</span>
                  <span className="text-muted-foreground ml-auto">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
