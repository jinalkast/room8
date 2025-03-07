import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import useCreateChore from '../hooks/useCreateChore';
import useRoommates from '@/hooks/useRoommates';
import { daysOfWeek } from '@/lib/constants';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

const choreSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  responsible: z.array(z.string()).min(1, 'Select at least one roommate'),
  date: z.string().min(1, 'Select a day')
});

type ChoreFormValues = z.infer<typeof choreSchema>;

export default function CreateChoreModal() {
  const [open, setOpen] = useState(false);
  const { data: roommates, isLoading: roommatesLoading } = useRoommates();
  const createChore = useCreateChore();

  const form = useForm<ChoreFormValues>({
    resolver: zodResolver(choreSchema),
    defaultValues: {
      title: '',
      description: '',
      responsible: [],
      date: 'sunday'
    }
  });

  const onSubmit = (values: ChoreFormValues) => {
    createChore.mutate(values);
    form.reset();
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={'Add Chore'}
      trigger={
        <Button>
          <Plus /> Add Chore
        </Button>
      }
      footer={
        <>
          <Button variant="default" className="w-full" onClick={form.handleSubmit(onSubmit)}>
            Create Chore
          </Button>
          <DialogClose asChild className="w-full">
            <Button variant="secondary" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
        </>
      }>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chore Name</FormLabel>
                <FormControl>
                  <Input placeholder="Sweeping..." autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Sweep the floor..." autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <div className="flex gap-2">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      onClick={() => field.onChange(day.toLowerCase())}
                      className={`cursor-pointer transition-all w-8 h-8 flex items-center justify-center rounded-md ${
                        field.value === day.toLowerCase()
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                      {day[0].toUpperCase()}
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign to</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {roommates?.map((roommate) => (
                    <div
                      key={roommate.id}
                      onClick={() => {
                        const newValue = field.value.includes(roommate.id)
                          ? field.value.filter((id) => id !== roommate.id)
                          : [...field.value, roommate.id];
                        field.onChange(newValue);
                      }}
                      className={`px-2 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-all ${
                        field.value.includes(roommate.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                      <Image
                        src={roommate.imageUrl || '/default-avatar.png'}
                        alt={roommate.name}
                        width={40}
                        height={40}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm">{roommate.name}</span>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
}
