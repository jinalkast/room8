import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProfileFromId(
  id: string,
  roommates: Array<{ id: string; name: string; imageUrl: string }>
) {
  return roommates.find((roommate) => roommate.id === id);
}
