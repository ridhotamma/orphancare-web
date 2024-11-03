import { EventStatus } from '@/types/enums';

export type Event = {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  organizer: string;
  status: EventStatus;
  organizerPhoneNumber: string;
  place: string;
  createdAt?: string;
  updatedAt?: string;
};

export const EventStatusText = {
  [EventStatus.FINISHED]: 'Telah Selesai',
  [EventStatus.PENDING]: 'Yang Akan Datang',
  [EventStatus.ON_PROGRESS]: 'Masih Berlangsung',
  [EventStatus.CANCELLED]: 'Dibatalkan',
};
