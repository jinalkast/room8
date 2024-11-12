'use client';

import React, { useState } from 'react';
import useRoommates from '@/hooks/useRoommates';
import UserSkeleton from '@/components/userSkelton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string(),
  amount: z.coerce.number(),
  equally: z.boolean(),
  debts: z.map(z.string(), z.number())
});

export default function CreateBillForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: roommates, status: roommatesStatus } = useRoommates();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: 0,
      equally: false,
      debts: new Map()
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          debts: Object.fromEntries(values.debts)
        })
      });
      toast({
        title: 'Success!',
        description: "You're bill has been created"
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: "So, something went wrong when creating you're bill"
      });
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Name</FormLabel>
              <FormControl>
                <Input placeholder="Ex: December Internet Bill" {...field} />
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
                <Input type="number" step={0.01} min={0} placeholder="Ex: 10.24" {...field} />
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
          name="debts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Debtors</FormLabel>
              {roommatesStatus === 'pending' && <UserSkeleton />}
              {roommatesStatus === 'error' && (
                <div>Error getting your roommates. Try refreshing</div>
              )}
              {roommatesStatus === 'success' && (
                <FormControl>
                  <div className="space-y-2">
                    {roommates!.map((roommate, index) => (
                      <div className="flex gap-2 items-center" key={index}>
                        <Avatar>
                          <AvatarImage src={roommate.image_url} />
                        </Avatar>
                        {roommate.name}:
                        <input
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
                    ))}
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

        <Button disabled={isLoading || roommatesStatus !== 'success'} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
