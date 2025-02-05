'use client';

import React, { useState } from 'react';
import useRoommates from '@/hooks/useRoommates';
import UserSkeleton from '@/components/userSkeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { postBillSchema } from '@/app/(main)/bill-splitter/types';

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
import usePostBill from '../hooks/postBill';
import { useQueryClient } from '@tanstack/react-query';
import { XIcon } from 'lucide-react';

export default function CreateBillForm({ closeBillModal }: { closeBillModal: () => void }) {
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: user, status: userStatus } = useUser();
  const { data: roommates, status: roommatesStatus } = useRoommates();
  const queryClient = useQueryClient();
  const { toast } = useToast();
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
      amount: 0,
      equally: false,
      owes: new Map()
    }
  });

  const splitBillEqually = () => {
    const newOwes = new Map();
    const billAmount = form.getValues('amount');
    for (const roommate of roommates!) {
      if (roommate.id !== user!.id) {
        newOwes.set(roommate.id, parseFloat((billAmount / roommates!.length).toFixed(2)));
      }
    }
    console.log(newOwes);
    form.setValue('owes', newOwes);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => postBillMutation.mutate(values))}
        className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Name</FormLabel>
              <FormControl>
                <Input autoComplete={'off'} placeholder="Ex: December Internet Bill" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Amount</FormLabel>
              <FormControl>
                <Input
                  autoComplete={'off'}
                  type="number"
                  step={0.01}
                  min={0}
                  placeholder="Ex: 10.24"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter the amount you paid</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="equally"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Split the bill equally</FormLabel>
              <FormControl>
                <Input className="w-5" type="checkbox" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Check this off if you are splitting the bill equally
              </FormDescription>
            </FormItem>
          )}
        /> */}
        <div className="mb-0">
          <p>Divide up the bill...</p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              splitBillEqually();
            }}
            disabled={roommatesStatus !== 'success'}>
            Equally
          </Button>
        </div>

        <FormField
          control={form.control}
          name="owes"
          render={({ field }) => (
            <FormItem>
              <p>
                <b>or manually</b>
              </p>
              <FormLabel>Debtors</FormLabel>
              {roommatesStatus === 'pending' && <UserSkeleton />}
              {roommatesStatus === 'error' && (
                <div>Error getting your roommates. Try refreshing</div>
              )}
              {roommatesStatus === 'success' && userStatus === 'success' && (
                <FormControl>
                  <div className="space-y-2">
                    {roommates!.map((roommate, index) =>
                      roommate.id !== user!.id ? (
                        <div className="flex gap-2 items-center justify-between" key={index}>
                          <div className="flex items-center gap-1">
                            <Avatar>
                              <AvatarImage src={roommate.imageUrl} />
                            </Avatar>
                            <p className="max-w-[120px] truncate">{roommate.name}:</p>
                          </div>
                          <input
                            className="ml-auto"
                            autoComplete={'off'}
                            type="number"
                            min={0}
                            step={0.01}
                            placeholder={'0'}
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
                              console.log(field.value);
                            }}
                          />
                          <XIcon
                            className="cursor-pointer"
                            onClick={() => {
                              const updatedOwes = new Map(field.value);
                              updatedOwes.delete(roommate.id);
                              form.setValue('owes', updatedOwes);
                            }}
                          />
                        </div>
                      ) : null
                    )}
                  </div>
                </FormControl>
              )}
              <FormMessage />
              <FormDescription>
                How much does everyone owe you? Leave it as 0 if they don&apos;t owe you anything
              </FormDescription>
            </FormItem>
          )}
        />

        <Button
          className="w-full mb-5"
          disabled={postBillMutation.isPending || roommatesStatus !== 'success'}
          type="submit">
          Create Bill
        </Button>
      </form>
    </Form>
  );
}
