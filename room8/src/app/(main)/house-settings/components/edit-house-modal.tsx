import { Modal } from '@/components/modal';
import { THouse } from '../types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { DialogClose } from '@/components/ui/dialog';
import useEditHouse from '../hooks/useEditHouse';

type props = {
  house: THouse;
};

function EditHouseModal({ house }: props) {
  const [houseName, setHouseName] = useState(house.name);
  const [houseAddress, setHouseAddress] = useState(house.address);

  const { mutate: editHouse, isPending: editHousePending } = useEditHouse();

  return (
    <Modal
      title="Edit House Info"
      description={`Edit name and address of your house`}
      trigger={
        <Button>
          <Edit /> Edit Info
        </Button>
      }
      footer={
        <>
          <DialogClose asChild className="w-full">
            <Button
              disabled={editHousePending}
              onClick={() => {
                editHouse({ house: { name: houseName, address: houseAddress }, houseId: house.id });
              }}>
              Edit House
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

export default EditHouseModal;
