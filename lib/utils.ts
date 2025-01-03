import { EventStatus } from '@/types/enums';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(number: number) {
  if (isNaN(number)) {
    return 'Invalid number';
  }

  const absoluteNumber = Math.abs(number);
  const parts = absoluteNumber.toString().split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const formattedNumber = parts.join(',');

  return `${number < 0 ? '-' : ''}${formattedNumber}`;
}

export const unformatNumber = (value: string): number => {
  if (!value) return 0;
  const numberStr = value.replace(/\./g, '').replace(',', '.');
  return Number(numberStr);
};

export const getEventStatusColor = (status: EventStatus) => {
  const colors = {
    [EventStatus.FINISHED]: 'bg-gray-500',
    [EventStatus.PENDING]: 'bg-yellow-500',
    [EventStatus.ON_PROGRESS]: 'bg-green-500',
    [EventStatus.CANCELLED]: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
};