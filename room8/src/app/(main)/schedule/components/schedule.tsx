'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { act, useState } from 'react';
import ScheduleItem from './schedule-item';
import { daysOfWeek } from '@/lib/constants';
import useAllActivities from '../hooks/useGetAllActivities';
import useUser from '@/app/auth/hooks/useUser';
import { Modal } from '@/components/modal';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useCreateChore from '../hooks/useCreateChore';
import useRoommates from '@/hooks/useRoommates';

export default function ScheduleViewer() {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const { data: activities, isLoading } = useAllActivities();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: roommates, isLoading: roommatesLoading } = useRoommates();

  const [selectedRoommate, setSelectedRoommate] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('Sunday');

  const createChore = useCreateChore();

  const handleCreateChore = () => {
    console.log('Creating chore...');
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Date:', selectedDate);
    console.log('Roommates:', selectedRoommate);

    const chore = {
      title,
      description,
      responsible: selectedRoommate,
      date: selectedDate.toLowerCase()
    };

    createChore.mutate(chore);
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setSelectedRoommate([]);
    setSelectedDate('sunday');
  };

  const filteredActivities = showAll
    ? activities
    : activities?.filter((activity) => activity.responsible.includes(user?.id));

  return (
    <div className="mt-8 border h-[400px] rounded-lg flex flex-col">
      <div className="flex p-4 border-b">
        <h3 className="text-2xl">Weekly Schedule</h3>
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex gap-2 items-center ">
            <Label htmlFor="airplane-mode">Show All</Label>
            <Switch
              id="airplane-mode"
              checked={showAll}
              onCheckedChange={() => {
                setShowAll((prev) => !prev);
              }}
            />
          </div>
          <Modal
            open={open}
            onOpenChange={setOpen}
            title={'Add Chore'}
            trigger={<Button className="ml-auto">Add Chore</Button>}
            footer={
              <>
                <DialogClose asChild className="w-full">
                  <Button
                    variant="default"
                    onClick={() => {
                      handleCreateChore();
                      clearForm();
                    }}>
                    Create Chore
                  </Button>
                </DialogClose>
                <DialogClose asChild className="w-full">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      clearForm();
                    }}>
                    Cancel
                  </Button>
                </DialogClose>
              </>
            }>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="chore">Chore Name: </Label>
                <Input
                  id="chore"
                  autoComplete={'off'}
                  type="text"
                  placeholder="Sweeping..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description: </Label>
                <Input
                  id="description"
                  autoComplete={'off'}
                  type="text"
                  placeholder="Sweep the floor..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date: </Label>

                <RadioGroup defaultValue={selectedDate} onValueChange={setSelectedDate}>
                  {daysOfWeek.map((day) => (
                    <div className="flex items-center space-x-2" key={day}>
                      <RadioGroupItem value={day} id={day} />
                      <Label htmlFor={day}>{day}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="roommates">Assign to: </Label>
                {roommates && (
                  <>
                    <div className="grid gap-2">
                      {roommates.map((roommate) => (
                        <div key={roommate.id} className="flex items-center gap-2">
                          <Switch
                            id={roommate.id}
                            checked={selectedRoommate.includes(roommate.id)}
                            onCheckedChange={() => {
                              setSelectedRoommate((prev) =>
                                prev.includes(roommate.id)
                                  ? prev.filter((id) => id !== roommate.id)
                                  : [...prev, roommate.id]
                              );
                            }}
                          />
                          <Label htmlFor={roommate.id}>{roommate.name}</Label>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Modal>
        </div>
      </div>

      <div className="p-4 flex-1">
        <div className="grid grid-cols-7 gap-4 h-full">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
            (day) => (
              <div key={day} className="p-2 rounded-lg h-full bg-muted">
                <h4 className="font-light tracking-[4px] text-center">{day}</h4>
                <div className="overflow-y-auto flex flex-col gap-2 mt-4">
                  {filteredActivities &&
                    filteredActivities
                      .filter((activity) => activity.time === day.toLowerCase())
                      .map((activity) => <ScheduleItem key={activity.id} item={activity} />)}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
