'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Noop, RefCallBack } from 'react-hook-form';

type props = {
  classname?: string;
  selected: Date | undefined;
  onChange: (date: any) => void;
  onBlur: Noop;
  ref: RefCallBack;
};

export function DatePicker({ classname, selected, onChange, onBlur, ref }: props) {
  const handleSelect = (date: Date | undefined) => {
    onChange(date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !selected && 'text-muted-foreground',
            classname && classname
          )}
          onBlur={onBlur}
          ref={ref}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          fromDate={new Date()}
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
