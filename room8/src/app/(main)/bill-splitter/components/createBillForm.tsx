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


export default function CreateBillForm({ closeBillModal }: {
  closeBillModal: () => void
}) {
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
      queryClient.invalidateQueries({queryKey: ['bills']});
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
  // async function onSubmit(values: z.infer<typeof postBillSchema>) {
  //   setIsLoading(true);
  //   try {
  //     console.log('values', values);
  //     console.log('Object.fromEntries(values.owes)', { ...values, owes: Object.fromEntries(values.owes)});

  //     // const res = await fetch(`/api/bills`, {
  //     //   method: 'POST',
  //     //   headers: { 'Content-Type': 'application/json' },
  //     //   body: JSON.stringify({
  //     //     ...values,
  //     //     owes: Object.fromEntries(values.owes)
  //     //   })
  //     // });
   
  //   } catch (error) {
  //     console.log(error);

  //   } finally {
  //     setIsLoading(false);
  //     form.reset();
  //   }
  // }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => postBillMutation.mutate(values))} className="space-y-8">
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

        <FormField
          control={form.control}
          name="owes"
          render={({ field }) => (
            <FormItem>
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
                              <AvatarImage src={roommate.image_url} />
                            </Avatar>
                            {roommate.name}:
                          </div>
                          <input
                            autoComplete={'off'}
                            type="number"
                            min={0}
                            step={0.01}
                            placeholder={'0'}
                            onChange={(e) => {
                              let value: number = parseFloat(e.target.value);
                              if (value <= 0) {
                                field.value.delete(roommate.id);
                              } else {
                                field.value.set(roommate.id, parseFloat(e.target.value));
                              }
                              console.log(field.value);
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

        <Button className='w-full mb-5' disabled={postBillMutation.isPending || roommatesStatus !== 'success'} type="submit">
          Create Bill
        </Button>
      </form>
    </Form>
  );
}
