'use client';

import React, { useState } from 'react';
import useRoommates from '@/hooks/useRoommates';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

const formSchema = z.object({
  name: z.string(),
  amount: z.number(),
  equally: z.boolean(),
  debts: z.array(z.map(z.string(), z.number()))
});

export default function CreateBillForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debts, setDebts] = useState<Array<{ key: string; value: number }>>([]);

  const { data: roommates, status } = useRoommates();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: 0,
      equally: false,
      debts: []
    }
  });

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
                <Input type="number" step={0.01} placeholder="Ex: 10.24" {...field} />
              </FormControl>
              <FormDescription>Enter the amount you paid</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
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
        />
        <FormField
          control={form.control}
          name="debts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Debtors</FormLabel>
              <FormControl>
                <div>
                  {roommates &&
                    roommates.map((roommate, index) => (
                      <div key={index}>
                        <label>
                          {roommate.name}:
                          <input
                            type="number"
                            onChange={(e) =>
                              setDebts([
                                ...debts,
                                { key: roommate.id, value: e.target.value as unknown as number }
                              ])
                            }
                            placeholder="Enter how much they owe"
                          />
                        </label>
                      </div>
                    ))}
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription>Select who owes you money for this bill</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
