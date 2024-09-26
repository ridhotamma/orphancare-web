'use client';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CalendarIcon,
  Eye,
  Filter,
  MapPinIcon,
  Plus,
  Search,
  UserIcon,
} from 'lucide-react';
import { EventStatus } from '@/types/enums';
import { Event } from '@/types/event';
import mockEvents from '@/data/mockup/events-mockup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusColors = {
  [EventStatus.FINISHED]: 'bg-gray-500',
  [EventStatus.PENDING]: 'bg-yellow-500',
  [EventStatus.ON_PROGRESS]: 'bg-green-500',
  [EventStatus.CANCELLED]: 'bg-red-500',
};

const EventCard: React.FC<{ event: Event }> = ({ event }) => (
  <Card className='overflow-hidden transition-all hover:shadow-lg'>
    <CardContent className='p-0'>
      <div className='bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700 p-4 text-white'>
        <h3 className='text-xl font-semibold mb-2'>{event.name}</h3>
        <Badge className={`${statusColors[event.status]} text-xs font-medium`}>
          {event.status}
        </Badge>
      </div>
      <div className='p-4 space-y-3'>
        <div className='flex items-center text-sm'>
          <CalendarIcon className='mr-2 h-4 w-4 text-gray-500' />
          <span>
            {format(event.startDate, 'MMM d')} -{' '}
            {format(event.endDate, 'MMM d, yyyy')}
          </span>
        </div>
        <div className='flex items-center text-sm'>
          <MapPinIcon className='mr-2 h-4 w-4 text-gray-500' />
          <span>{event.place}</span>
        </div>
        <div className='flex items-center text-sm'>
          <UserIcon className='mr-2 h-4 w-4 text-gray-500' />
          <span>{event.organizer}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter className='p-4'>
      <Button variant='outline' className='w-full'>
        <Eye className='mr-2 h-4 w-4' /> View Details
      </Button>
    </CardFooter>
  </Card>
);

const EventsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  return (
    <div>
      <div className='mb-8 space-y-4'>
        <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
          <div className='relative flex-grow'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search events...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Filter className='mr-2 h-4 w-4' />
                  Category
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>Filter Documents</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <DropdownMenuRadioItem value='all'>All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='video'>
                    Video
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='pdf'>PDF</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='image'>
                    Image
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> Add Event
            </Button>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
