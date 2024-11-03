/* eslint-disable react-hooks/exhaustive-deps */
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
import { Event, EventStatusText } from '@/types/event';
import { EventStatus } from '@/types/enums';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import LoadingContainer from '@/components/container/loading-container';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const EventFormPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isEditMode = !!id;

  const [event, setEvent] = useState<Event>({
    name: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    organizer: '',
    status: EventStatus.PENDING,
    organizerPhoneNumber: '',
    place: 'Panti Asuhan Annajah (Di tempat)',
  });

  const getEventDetails = async () => {
    setLoading(true);
    try {
      const response = await requests({
        url: `/admin/events/${id}`,
        method: 'GET',
      });
      setEvent(response);
    } catch (error: any) {
      toast({
        title: 'Terjadi Kesalahan',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async () => {
    try {
      const response = await requests({
        url: `/admin/events/${id}`,
        method: 'PUT',
        data: event,
      });
      setEvent(response);
      router.push('/events');
      toast({
        title: 'Event Updated',
        description: 'Event has been successfully updated',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Terjadi Kesalahan',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const saveEvent = async () => {
    try {
      await requests({
        url: '/admin/events',
        method: 'POST',
        data: event,
      });
      router.push('/events');
      toast({
        title: 'Event Created',
        description: 'Event has been successfully created',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Terjadi Kesalahan',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteEvent = async () => {
    try {
      await requests({
        url: `/admin/events/${id}`,
        method: 'DELETE',
      });
      router.push('/events');
      toast({
        title: 'Event Deleted',
        description: 'Event has been successfully deleted',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Terjadi Kesalahan',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (isEditMode) {
      getEventDetails();
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
    if (isEditMode) {
      updateEvent();
    } else {
      saveEvent();
    }
  };

  return (
    <LoadingContainer loading={loading}>
      <div className='container mx-auto px-0 lg:px-20'>
        <div className='flex items-center justify-between mb-6'>
          <Button variant='link' className='p-0' asChild>
            <Link href='/events'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Event List
            </Link>
          </Button>
          {isEditMode && (
            <Button
              variant='destructive'
              onClick={() => setShowDeleteDialog(true)}
              size='sm'
            >
              <Trash2 className='h-4 w-4 mr-2' />
              Delete Event
            </Button>
          )}
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
                  placeholder='Example: Community Service Event'
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
                  placeholder='Example: Community Organization'
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
                  placeholder='Example: +6281234567890'
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
                  placeholder='Example: Community Center'
                  required
                />
              </div>
              {isEditMode && (
                <div className='space-y-2'>
                  <Label htmlFor='status'>Status</Label>
                  <Select
                    onValueChange={handleStatusChange}
                    value={event.status}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select event status' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EventStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {EventStatusText[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button disabled={loading} type='submit' className='w-full'>
                {isEditMode ? 'Update Event' : 'Create Event'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this event?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              event and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteEvent}
              className='bg-red-500 hover:bg-red-600'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LoadingContainer>
  );
};

export default EventFormPage;
