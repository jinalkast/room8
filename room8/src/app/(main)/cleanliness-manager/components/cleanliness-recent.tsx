import LoadingSpinner from '@/components/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserGuideModal from '@/components/user-guide-modal';
import { USER_GUIDE } from '@/lib/constants/user-guide';
import { TCleanlinessLog } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import CleanlinessDetailsModal from './cleanliness-details-modal';
import CleanlinessImage from './cleanliness-image';

type props = {
  cleanlinessLog?: TCleanlinessLog | null;
};

export default function CleanlinessRecent({ cleanlinessLog }: props) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          Most Recent Event <UserGuideModal data={USER_GUIDE.CM_RECENT_EVENT} />
        </CardTitle>
        <CardDescription>Here&apos;s what just happened at home!</CardDescription>
        <CardDescription>
          {cleanlinessLog &&
            `${new Date(cleanlinessLog.created_at).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {cleanlinessLog ? (
          <div>
            <div className="flex justify-between items-center">
              <CleanlinessImage
                imageUrl={cleanlinessLog.before_image_url}
                size={300}
                title="Most Recent Before Image"
              />
              <ArrowRight className="w-12 h-12" />
              <CleanlinessImage
                imageUrl={cleanlinessLog.after_image_url}
                size={300}
                title="Most Recent After Image"
              />
            </div>
            <CleanlinessDetailsModal recent cleanlinessLogId={cleanlinessLog.id} />
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </CardContent>
    </Card>
  );
}
