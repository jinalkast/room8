import LoadingSpinner from '@/components/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import UserGuideModal from '@/components/user-guide-modal';
import { USER_GUIDE } from '@/lib/constants/user-guide';
import { TCleanlinessLog } from '@/lib/types';
import CleanlinessDetailsModal from './cleanliness-details-modal';

type props = {
  cleanlinessLogs: TCleanlinessLog[] | null | undefined;
};

function CleanlinessPast({ cleanlinessLogs }: props) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          Past Events <UserGuideModal data={USER_GUIDE.CM_EVENTS} />
        </CardTitle>
        <CardDescription>
          See what changes were made to your shared space and assign cleanup tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[338px] overflow-y-auto">
        {!cleanlinessLogs ? (
          <LoadingSpinner />
        ) : (
          <Table className="overflow-y-auto">
            <TableCaption>
              Past events in your shared living space. Does not include most recent event
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
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
                    <TableCell className="text-right">
                      <CleanlinessDetailsModal cleanlinessLogId={log.id} />
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
  );
}

export default CleanlinessPast;
