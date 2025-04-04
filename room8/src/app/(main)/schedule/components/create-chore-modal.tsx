import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useRoommates from '@/hooks/useRoommates';
import { daysOfWeek } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  GlassWater,
  Paintbrush,
  Plus,
  Refrigerator,
  Soup,
  Trash,
  WashingMachine
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useCreateChore from '../hooks/useCreateChore';

const choreSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  responsible: z.array(z.string()).min(1, 'Select at least one roommate'),
  date: z.string().min(1, 'Select a day')
});

type ChoreFormValues = z.infer<typeof choreSchema>;

type chorePreset = {
  name: string;
  description: string;
  icon: JSX.Element;
};

const chorePresets: chorePreset[] = [
  {
    name: 'Sweeping',
    description: 'Sweep the floor',
    icon: <Paintbrush />
  },
  {
    name: 'Mopping',
    description: 'Mop the floor',
    icon: <GlassWater />
  },
  {
    name: 'Dishes',
    description: 'Wash the dishes',
    icon: <Soup />
  },
  {
    name: 'Groceries',
    description: 'Grocery Run',
    icon: <Refrigerator />
  },
  {
    name: 'Laundry',
    description: 'Do the laundry',
    icon: <WashingMachine />
  },
  {
    name: 'Trash',
    description: 'Take out the trash',
    icon: <Trash />
  }
];

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

  const handleApplyPreset = (preset: chorePreset) => {
    form.setValue('title', preset.name);
    form.setValue('description', preset.description);
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
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Chore Presets</label>
            <div className="!my-2 border rounded-md p-2">
              <div className="flex flex-wrap gap-2 items-center">
                {chorePresets.map((chore) => (
                  <Button
                    key={chore.name}
                    onClick={(e) => {
                      e.preventDefault();
                      handleApplyPreset(chore);
                    }}
                    size="sm"
                    variant="secondary"
                    className="flex-1">
                    {chore.name}
                    {chore.icon}
                  </Button>
                ))}
              </div>
            </div>
          </div>
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
