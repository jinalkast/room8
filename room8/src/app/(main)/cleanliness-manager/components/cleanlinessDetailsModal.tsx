import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { ClipboardEdit, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { DialogClose } from '@/components/ui/dialog';
import useUser from '@/app/auth/hooks/useUser';
import LoadingSpinner from '@/components/loading';
import { TCleanlinessLog } from '@/lib/types';
import Image from 'next/image';

type props = {
  cleanlinessLog: TCleanlinessLog;
};

function CleanlinessDetailsModal({ cleanlinessLog }: props) {
  return (
    <Modal
      title="Details"
      description={`See what changes were made to your shared space and assign cleanup tasks`}
      trigger={
        <Button>
          <ClipboardEdit /> View Details
        </Button>
      }
      footer={
        <DialogClose asChild className="w-full">
          <Button variant="secondary">Exit</Button>
        </DialogClose>
      }>
      <div>
        <Image
          alt="before image of your shared space"
          width={200}
          height={200}
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cleanliness_images/${cleanlinessLog.before_image_url}`}
        />
        <Image
          alt="after image of your shared space"
          width={200}
          height={200}
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cleanliness_images/${cleanlinessLog.after_image_url}`}
        />
        Algo output: {cleanlinessLog.algorithm_output?.toString()}
      </div>
    </Modal>
  );
}

export default CleanlinessDetailsModal;
