import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import useCreateHouse from '../hooks/useCreateHouse';
// Test
export default function CreateHouseModal() {
  const [houseName, setHouseName] = useState('');
  const [houseAddress, setHouseAddress] = useState('');

  const { mutate: createHouse, isPending: createHousePending } = useCreateHouse();

  return (
    <Modal
      title="Create House"
      description="Create a new house to get started"
      trigger={
        <Button>
          <Plus /> Create House
        </Button>
      }
      footer={
        <>
          <DialogClose asChild className="w-full">
            <Button
              onClick={() => {
                createHouse({ name: houseName, address: houseAddress });
              }}
              disabled={createHousePending}>
              Create House
            </Button>
          </DialogClose>
          <DialogClose asChild className="w-full">
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </>
      }>
      <div className="flex flex-col gap-4">
        <div>
          <Label>House Name</Label>
          <Input
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
            placeholder="House Name"
          />
        </div>

        <div>
          <Label>House Address</Label>
          <Input
            value={houseAddress}
            onChange={(e) => setHouseAddress(e.target.value)}
            placeholder="House Address"
          />
        </div>
      </div>
    </Modal>
  );
}
