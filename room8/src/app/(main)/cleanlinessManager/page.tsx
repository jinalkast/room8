'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import useCleanlinessLogs from './hooks/useCleanlinessLogs';
import useGetHouse from '@/hooks/useGetHouse';
import LoadingSpinner from '@/components/loading';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { TCleanlinessLog } from '@/lib/types';
import CleanlinessDetailsModal from '@/app/(main)/cleanlinessManager/components/cleanlinessDetailsModal';

export default function CleanlinessManagerPage() {
  const { data: houseData, error: getHouseError } = useGetHouse();
  const { data: cleanlinessLogs, error: getCleanlinessLogsError } = useCleanlinessLogs({
    params: { houseID: houseData?.id || 'placeholder_for_typescript' },
    enabled: houseData !== undefined
  });
  return (
    <div>
      <h2 className="text-4xl mb-8">Cleanliness Management System</h2>
      <div className="w-[40vw] flex flex-col">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Most Recent Event {(cleanlinessLogs && cleanlinessLogs.length > 0) ? `- ${new Date(cleanlinessLogs[0].created_at).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}` : ''}</CardTitle>
            <CardDescription>Here's what just happened at home!</CardDescription>
          </CardHeader>
          <CardContent>
            {!cleanlinessLogs ? (
              <LoadingSpinner />
            ) : cleanlinessLogs.length > 0 ? (
              <div className='flex gap-4'>
                <Image
                  alt="before image of your shared space"
                  width={200}
                  height={200}
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cleanliness_images/${cleanlinessLogs[0].before_image_url}`}
                />
                <Image
                  alt="after image of your shared space"
                  width={200}
                  height={200}
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cleanliness_images/${cleanlinessLogs[0].after_image_url}`}
                />
                Algo output: {cleanlinessLogs[0].algorithm_output?.toString()}
              </div>
            ) : (
              <div>No logs</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Past Events</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            {!cleanlinessLogs ? (
              <LoadingSpinner />
            ) : (
              <Table className="mt-4 overflow-y-auto">
                <TableCaption>Past events in your shared living space. Does not include most recent event</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Changes Detected</TableHead>
                    <TableHead className="text-right"> </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cleanlinessLogs.length > 0 ? (
                    cleanlinessLogs.slice(1).map((log: TCleanlinessLog) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {new Date(log.created_at).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          {Object.keys(log.algorithm_output as Object).length.toString()} changes
                          detected
                        </TableCell>
                        <TableCell className="text-right">
                          <CleanlinessDetailsModal cleanlinessLog={log} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <div>No logs</div>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
