import { EventStatus } from '@/types/enums';
import { Event } from '@/types/event';

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Annual Tech Conference',
    startDate: new Date('2024-10-15T09:00:00').toLocaleString(),
    endDate: new Date('2024-10-17T18:00:00').toLocaleString(),
    organizer: 'TechCorp Inc.',
    status: EventStatus.PENDING,
    organizerPhoneNumber: '+1 (555) 123-4567',
    place: 'San Francisco Convention Center',
    createdAt: new Date('2024-01-15T10:30:00').toLocaleString(),
    updatedAt: new Date('2024-01-15T10:30:00').toLocaleString(),
  },
  {
    id: '2',
    name: 'Local Food Festival',
    startDate: new Date('2024-07-22T11:00:00').toLocaleString(),
    endDate: new Date('2024-07-24T20:00:00').toLocaleString(),
    organizer: 'Foodie Events LLC',
    status: EventStatus.ON_PROGRESS,
    organizerPhoneNumber: '+1 (555) 987-6543',
    place: 'Downtown Park',
    createdAt: new Date('2023-12-01T14:45:00').toLocaleString(),
    updatedAt: new Date('2024-02-28T09:15:00').toLocaleString(),
  },
  {
    id: '3',
    name: 'International Film Symposium',
    startDate: new Date('2024-09-05T10:00:00').toLocaleString(),
    endDate: new Date('2024-09-10T22:00:00').toLocaleString(),
    organizer: 'Global Cinema Association',
    status: EventStatus.PENDING,
    organizerPhoneNumber: '+1 (555) 246-8101',
    place: 'Metropolitan Arts Center',
    createdAt: new Date('2024-03-10T11:20:00').toLocaleString(),
    updatedAt: new Date('2024-03-10T11:20:00').toLocaleString(),
  },
  {
    id: '4',
    name: 'Summer Music Festival',
    startDate: new Date('2024-08-01T12:00:00').toLocaleString(),
    endDate: new Date('2024-08-03T23:59:59').toLocaleString(),
    organizer: 'Melody Makers Productions',
    status: EventStatus.PENDING,
    organizerPhoneNumber: '+1 (555) 369-2580',
    place: 'Riverside Amphitheater',
    createdAt: new Date('2024-02-15T13:00:00').toLocaleString(),
    updatedAt: new Date('2024-04-01T10:30:00').toLocaleString(),
  },
  {
    id: '5',
    name: 'Startup Pitch Competition',
    startDate: new Date('2024-11-10T09:00:00').toLocaleString(),
    endDate: new Date('2024-11-10T18:00:00').toLocaleString(),
    organizer: 'Venture Capital Partners',
    status: EventStatus.PENDING,
    organizerPhoneNumber: '+1 (555) 159-7530',
    place: 'Innovation Hub',
    createdAt: new Date('2024-05-20T15:45:00').toLocaleString(),
    updatedAt: new Date('2024-05-20T15:45:00').toLocaleString(),
  },
  {
    id: '6',
    name: 'Charity Marathon',
    startDate: new Date('2024-06-30T07:00:00').toLocaleString(),
    endDate: new Date('2024-06-30T14:00:00').toLocaleString(),
    organizer: 'RunForGood Foundation',
    status: EventStatus.FINISHED,
    organizerPhoneNumber: '+1 (555) 753-9510',
    place: 'City Central Park',
    createdAt: new Date('2023-11-01T09:00:00').toLocaleString(),
    updatedAt: new Date('2024-07-01T10:00:00').toLocaleString(),
  },
];

export default mockEvents;
