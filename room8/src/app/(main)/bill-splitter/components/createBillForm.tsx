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
import { Currency, DollarSign, XIcon } from 'lucide-react';
import LoadingSpinner from '@/components/loading';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function CreateBillForm({ closeBillModal }: { closeBillModal: () => void }) {
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
      amount: undefined,
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

  if (userStatus === 'pending' || roommatesStatus === 'pending') {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => postBillMutation.mutate(values))}
        className="space-y-6 pb-4">
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

        <FormField
          control={form.control}
          name="owes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Split Bill With</FormLabel>
              {roommates && user && (
                <FormControl>
                  <div className="space-y-4">
                    {roommates!.map((roommate, index) =>
                      roommate.id !== user!.id ? (
                        <div className="flex gap-2 items-center justify-between" key={index}>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={roommate.imageUrl} />
                          </Avatar>
                          <p>{roommate.name}</p>
                          <div className="flex gap-2 items-center ml-auto">
                            <DollarSign />
                            <Input
                              className="w-24"
                              autoComplete={'off'}
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
                                console.log(field.value);
                              }}
                            />
                          </div>
                          <Checkbox checked={true} onCheckedChange={() => {}} className="h-8 w-8" />
                        </div>
                      ) : null
                    )}
                  </div>
                </FormControl>
              )}
              <div className="!mt-4 border rounded-md p-2">
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      splitBillEqually();
                    }}
                    className="flex-1">
                    Equally
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      splitBillEqually();
                    }}
                    className="flex-1">
                    Exclude Me
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      splitBillEqually();
                    }}
                    className="flex-1">
                    Half & Half
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
