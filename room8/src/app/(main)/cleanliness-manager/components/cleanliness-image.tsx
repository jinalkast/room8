import { Modal } from '@/components/modal';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type props = {
  imageUrl: string;
  size?: number;
  title: string;
};

function CleanlinessImage({ imageUrl, size, title }: props) {
  return (
    <Modal
      title="Image Details"
      description={title}
      className="min-w-[750px]"
      trigger={
        <div className={`w-[300px] h-[200px] relative`}>
          <Image
            alt="after image of your shared space"
            className={cn('cursor-pointer transition-all hover:-translate-y-1 rounded-xl border')}
            objectFit="cover"
            fill
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cleanliness_images/${imageUrl}`}
          />
        </div>
      }>
      <div className="h-[500px] relative">
        <Image
          alt="after image of your shared space"
          className="rounded-xl"
          unoptimized
          fill
          objectFit="contain"
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cleanliness_images/${imageUrl}`}
        />
      </div>
    </Modal>
  );
}

export default CleanlinessImage;
