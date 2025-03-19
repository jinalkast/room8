import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import React from 'react';
import { TBillPreset } from '../types';
import useDeleteBillPreset from '../hooks/deleteBillPreset';
import { useToast } from '@/hooks/useToast';
import { useQueryClient } from '@tanstack/react-query';

const BillPresetsButton = ({
  billPreset,
  applyPreset
}: {
  billPreset: TBillPreset;
  applyPreset: (preset: TBillPreset) => void;
}) => {
  const { toast } = useToast();
  const { mutate: deletePreset, isPending: isPresetDeleting } = useDeleteBillPreset({
    queryClient: useQueryClient(),
    onSuccessCallback() {
      toast({
        title: 'Success',
        description: 'Preset successfully deleted'
      });
    },
    onErrorCallback() {
      toast({
        title: 'Error!',
        description: 'Failed to delete the preset'
      });
    }
  });

  const handleApplyPreset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    applyPreset(billPreset);
  };

  const handleDeletePreset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    deletePreset(billPreset.id);
  };

  return (
    <Button onClick={handleApplyPreset} className="max-w-[120px]">
      {billPreset.name}
      <Button
        size="icon"
        variant="ghost"
        className="p-1 !h-6 !w-6"
        disabled={isPresetDeleting}
        onClick={handleDeletePreset}>
        <Trash className="!h-4 !w-4" fill={'none'} stroke={'currentColor'} />
      </Button>
    </Button>
  );
};

export default BillPresetsButton;
