'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Event } from '@/types/event';
import { EventStatus } from '@/types/enums';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const EventFormPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();

  const isEditMode = !!id;

  const [event, setEvent] = useState<Event>({
    id: '',
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    organizer: '',
    status: EventStatus.PENDING,
    organizerPhoneNumber: '',
    place: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    if (isEditMode) {
      const mockEvent: Event = {
        id: '1',
        name: 'Sahur on The Road',
        startDate: new Date('2024-01-11'),
        endDate: new Date('2024-12-01'),
        organizer: 'Universitas Bina Nusantara',
        status: EventStatus.PENDING,
        organizerPhoneNumber: '+6285199881122',
        place: 'Panti Asuhan Annajah (Di Tempat)',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setEvent(mockEvent);
    }
  }, [isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: EventStatus) => {
    setEvent((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting event:', event);
    router.push('/events');
  };

  return (
    <div className='container mx-auto px-0 lg:px-20'>
      <div className='flex items-center mb-6'>
        <Button variant='link' className='p-0' asChild>
          <Link href='/events'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Event List
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Event Name</Label>
              <Input
                id='name'
                name='name'
                value={event.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='startDate'>Start Date</Label>
                <Input
                  id='startDate'
                  name='startDate'
                  type='date'
                  value={format(event.startDate, 'yyyy-MM-dd')}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='endDate'>End Date</Label>
                <Input
                  id='endDate'
                  name='endDate'
                  type='date'
                  value={format(event.endDate, 'yyyy-MM-dd')}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='organizer'>Organizer</Label>
              <Input
                id='organizer'
                name='organizer'
                value={event.organizer}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='organizerPhoneNumber'>
                Organizer Phone Number
              </Label>
              <Input
                id='organizerPhoneNumber'
                name='organizerPhoneNumber'
                value={event.organizerPhoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='place'>Place</Label>
              <Input
                id='place'
                name='place'
                value={event.place}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='status'>Status</Label>
              <Select onValueChange={handleStatusChange} value={event.status}>
                <SelectTrigger>
                  <SelectValue placeholder='Select event status' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EventStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full'>
              {isEditMode ? 'Update Event' : 'Create Event'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EventFormPage;
