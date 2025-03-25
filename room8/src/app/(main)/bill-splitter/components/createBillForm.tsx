'use client';

import React, { useEffect, useState } from 'react';
import useRoommates from '@/hooks/useRoommates';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { postBillSchema, TBillPreset } from '@/app/(main)/bill-splitter/types';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import useUser from '@/app/auth/hooks/useUser';
import usePostBill from '@/app/(main)/bill-splitter/hooks/postBill';
import { useQueryClient } from '@tanstack/react-query';
import { DollarSign } from 'lucide-react';
import LoadingSpinner from '@/components/loading';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/datepicker';
import BillPresetsButton from '@/app/(main)/bill-splitter/components/billPresetsButton';
import usePostBillPreset from '@/app/(main)/bill-splitter/hooks/postBillPresets';
import useBillPresets from '@/app/(main)/bill-splitter/hooks/useBillPresets';

export default function CreateBillForm({ closeBillModal }: { closeBillModal: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [roommatesSelected, setRoommatesSelected] = useState<string[]>([]);
  const { data: presetsData, status: presetsStatus } = useBillPresets();

  const { data: user, status: userStatus } = useUser();
  const { data: roommates, status: roommatesStatus } = useRoommates();
  const { mutate: postBillPreset, isPending: isPresetPostPending } = usePostBillPreset({
    queryClient,
    onSuccessCallback() {
      toast({
        title: 'Success',
        description: 'Preset Successfully saved'
      });
    },
    onErrorCallback() {
      toast({
        title: 'Error',
        description: 'We could not save this preset'
      });
    }
  });

  const postBillMutation = usePostBill({
    onSuccessCallback: () => {
      toast({
        title: 'Success!',
        description: "You're bill has been created"
      });
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      closeBillModal();
    },
    onErrorCallback: () => {
      toast({
        title: 'Error',
        description: "So, something went wrong when creating you're bill"
      });
    }
  });

  const form = useForm<z.infer<typeof postBillSchema>>({
    resolver: zodResolver(postBillSchema),
    defaultValues: {
      name: '',
      amount: undefined,
      owed_by: undefined,
      equally: false,
      owes: new Map()
    }
  });

  useEffect(() => {
    if (roommates && user) {
      setRoommatesSelected(roommates.map((roommate) => roommate.id));
    }
  }, [roommates, user]);

  const splitBillEqually = () => {
    const newOwes = new Map();
    const billAmount = form.getValues('amount');
    const selectedRoommates = roommatesSelected.length;
    const splitAmount = parseFloat((billAmount / selectedRoommates).toFixed(2));

    for (const roommateId of roommatesSelected) {
      newOwes.set(roommateId, splitAmount);
    }

    form.setValue('owes', newOwes);
  };

  const splitBillEquallyExcludeMe = () => {
    const newOwes = new Map();
    const billAmount = form.getValues('amount');
    const allRoommates = roommates?.map((roommate) => roommate.id) || [];
    const selectedRoommates = allRoommates.filter((id) => id !== user?.id);
    const splitAmount = parseFloat((billAmount / selectedRoommates.length).toFixed(2));

    for (const roommateId of selectedRoommates) {
      newOwes.set(roommateId, splitAmount);
    }

    form.setValue('owes', newOwes);
    setRoommatesSelected(selectedRoommates);
  };

  const splitBillHalfAndHalf = () => {
    const newOwes = new Map();
    const billAmount = form.getValues('amount');
    const halfAmount = parseFloat((billAmount / 2).toFixed(2));
    const remainingAmount = billAmount - halfAmount;
    const selectedRoommates = roommatesSelected.filter((id) => id !== user?.id).length;
    const splitAmount = parseFloat((remainingAmount / selectedRoommates).toFixed(2));

    if (user?.id) {
      newOwes.set(user.id, halfAmount);
    }

    for (const roommateId of roommatesSelected) {
      if (roommateId !== user?.id) {
        newOwes.set(roommateId, splitAmount);
      }
    }

    form.setValue('owes', newOwes);
    if (user?.id && !roommatesSelected.includes(user.id)) {
      setRoommatesSelected([...roommatesSelected, user.id]);
    }
  };

  const clearAll = () => {
    const newOwes = new Map();
    if (roommates) {
      const allRoommates = roommates.map((roommate) => roommate.id);
      setRoommatesSelected(allRoommates);
      for (const roommateId of allRoommates) {
        newOwes.set(roommateId, 0);
      }
    }
    form.setValue('owes', newOwes);
  };

  const applyPreset = (preset: TBillPreset) => {
    form.setValue('name', preset.name);
    form.setValue('amount', preset.amount);
    form.setValue('owes', preset.owes);
    form.clearErrors();
  };

  const handleSavePreset = (formData: z.infer<typeof postBillSchema>) => {
    const totalAmount = formData.amount;
    const owes = formData.owes;
    let sum = 0;

    owes.forEach((amount) => {
      sum += amount;
    });

    const roundingError = Math.abs(totalAmount - sum);
    if (roundingError > 1) {
      toast({
        title: 'Error',
        description: 'The amounts do not add up to the total value. Please check the values.'
      });
      return;
    }

    // setPresets(prev=> [...prev, {...formData, owes: new Map(formData.owes)}]);
    postBillPreset(formData);
  };

  const setDatePreset = (preset: string) => {
    const today = new Date();
    let newDate: Date;

    switch (preset) {
      case 'tomorrow':
        newDate = new Date(today);
        newDate.setDate(today.getDate() + 1);
        break;
      case 'next week':
        newDate = new Date(today);
        newDate.setDate(today.getDate() + 7);
        break;
      case 'next month':
        newDate = new Date(today);
        newDate.setMonth(today.getMonth() + 1);
        break;
      case 'start of next month':
        newDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        break;
      default:
        newDate = new Date(today);
    }

    form.setValue('owed_by', newDate);
  };

  const incrementBillAmount = (amount: number) => {
    const currentAmount = form.getValues('amount') || 0;
    form.setValue('amount', +currentAmount + amount);
  };

  if (userStatus === 'pending' || roommatesStatus === 'pending') {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((formData) => {
          const totalAmount = formData.amount;
          const owes = formData.owes;
          let sum = 0;

          owes.forEach((amount) => {
            sum += amount;
          });

          const roundingError = Math.abs(totalAmount - sum);

          if (roundingError > 1) {
            toast({
              title: 'Error',
              description: 'The amounts do not add up to the total value. Please check the values.'
            });
            return;
          }

          owes.delete(user?.id || 'XXX'); // DELETE owe for self
          postBillMutation.mutate(formData);
        })}
        className="space-y-6 pb-4">
        {presetsStatus === 'pending' && <div>Fetching Presets</div>}
        {presetsStatus === 'error' && <div>Error Fetching Presets</div>}
        {presetsStatus === 'success' && (
          <FormField
            control={form.control}
            name="equally"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bill Presets</FormLabel>
                <FormControl>
                  <>
                    <div className="!my-2 border rounded-md p-2">
                      <div className="flex gap-2 items-center">
                        {presetsData!.map((preset, index) => (
                          <BillPresetsButton billPreset={preset} applyPreset={applyPreset} />
                        ))}
                        {presetsData!.length === 0 && (
                          <p className="text-sm text-muted">No presets available</p>
                        )}
                      </div>
                    </div>
                    <Button
                      disabled={isPresetPostPending}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSavePreset(form.getValues());
                      }}
                      size={'sm'}>
                      Save current as a preset
                    </Button>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Name</FormLabel>
              <FormControl>
                <Input autoComplete={'off'} placeholder="December Internet Bill" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="owed_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owed By (optional)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2 w-full justify-between">
                  <DatePicker
                    classname="w-full"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                  <Button
                    disabled={!field.value}
                    onClick={(event) => {
                      event.preventDefault();
                      field.onChange(undefined);
                    }}
                    variant={'destructive'}>
                    Clear
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="!mt-2 rounded-md">
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setDatePreset('tomorrow');
              }}
              className="flex-1">
              Tomorrow
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setDatePreset('next week');
              }}
              className="flex-1">
              Next Week
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setDatePreset('next month');
              }}
              className="flex-1">
              Next Month
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setDatePreset('start of next month');
              }}
              className="flex-1">
              Start of Next Month
            </Button>
          </div>
        </div>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Amount</FormLabel>
              <FormControl>
                <div className="flex gap-2 items-center">
                  <DollarSign />
                  <Input
                    autoComplete={'off'}
                    type="number"
                    step={0.01}
                    min={0}
                    placeholder="10.24"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="!mt-2 rounded-md">
          <div className="flex gap-2 flex-wrap">
            {[1, 5, 10, 25, 50, 100, 500].map((amount) => (
              <Button
                key={amount}
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  incrementBillAmount(amount);
                }}
                className="flex-1">
                +${amount}
              </Button>
            ))}
          </div>
        </div>
        <FormField
          control={form.control}
          name="owes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Split Bill With</FormLabel>
              {roommates && user && (
                <FormControl>
                  <div className="space-y-4">
                    {roommates!.map((roommate, index) => {
                      const thisRoommateSelected = roommatesSelected.includes(roommate.id);

                      return (
                        <div className="flex gap-2 items-center justify-between" key={index}>
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              className={cn(!thisRoommateSelected && 'opacity-30')}
                              src={roommate.imageUrl}
                            />
                          </Avatar>
                          <p className={cn(!thisRoommateSelected && 'opacity-30')}>
                            {roommate.name}
                          </p>
                          <div className="flex gap-2 items-center ml-auto">
                            <DollarSign className={cn(!thisRoommateSelected && 'opacity-30')} />
                            <Input
                              className="w-24"
                              autoComplete={'off'}
                              disabled={!thisRoommateSelected}
                              type="number"
                              min={0}
                              step={0.01}
                              placeholder={'0.00'}
                              value={field.value.get(roommate.id) || ''}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                const updatedOwes = new Map(field.value);

                                // Update the Map with the new value
                                if (value > 0) {
                                  updatedOwes.set(roommate.id, value);
                                } else {
                                  updatedOwes.delete(roommate.id);
                                }

                                // Sync the updated Map with the form state
                                form.setValue('owes', updatedOwes);
                              }}
                            />
                          </div>
                          <Checkbox
                            checked={thisRoommateSelected}
                            onCheckedChange={() => {
                              if (thisRoommateSelected) {
                                setRoommatesSelected(
                                  roommatesSelected.filter((id) => id !== roommate.id)
                                );
                                const updatedOwes = new Map(field.value);
                                updatedOwes.delete(roommate.id);
                                form.setValue('owes', updatedOwes);
                              } else {
                                setRoommatesSelected([...roommatesSelected, roommate.id]);
                              }
                            }}
                            className="h-8 w-8"
                          />
                        </div>
                      );
                    })}
                  </div>
                </FormControl>
              )}
              <div className="!mt-4 rounded-md">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      splitBillEqually();
                    }}
                    className="flex-1">
                    Equally
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      splitBillEquallyExcludeMe();
                    }}
                    className="flex-1">
                    Exclude Me
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      splitBillHalfAndHalf();
                    }}
                    className="flex-1">
                    Half & Half
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      clearAll();
                    }}
                    className="flex-1">
                    Clear
                  </Button>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          disabled={postBillMutation.isPending || roommatesStatus !== 'success'}
          type="submit">
          Create Bill
        </Button>
      </form>
    </Form>
  );
}
