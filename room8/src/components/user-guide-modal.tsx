import { Info } from 'lucide-react';
import { Modal } from './modal';
import { Button } from './ui/button';
import { DialogClose } from './ui/dialog';
import { TUserGuideData } from '@/lib/types';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel';

type props = {
  data: TUserGuideData;
};

function UserGuideModal({ data }: props) {
  return (
    <Modal
      title={data.title}
      className="min-w-[800px]"
      description={data.description}
      trigger={
        <Info className="cursor-pointer hover:bg-primary/30 !transition-all p-1 rounded-full w-6 h-6" />
      }
      footer={
        <DialogClose asChild className="w-full">
          <Button>Got it!</Button>
        </DialogClose>
      }>
      <div>
        <Carousel>
          <CarouselContent>
            {data.slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[350px] rounded-md ">
                  <Image src={slide.src} alt={slide.alt} fill className="p-2 object-contain" />
                </div>

                <p className="mt-2 text-center">{slide.explanation}</p>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </Modal>
  );
}

export default UserGuideModal;
