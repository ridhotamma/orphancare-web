'use client'

import React, { useState } from 'react';
import { Donation } from '@/types/donation';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GiftIcon, CalendarIcon, UserIcon, Eye, Search, Filter, Plus } from 'lucide-react';
import { mockDonations } from '@/data/mockup/donations-mockup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePageTitle } from '@/hooks/use-page-title';

const DonationCard: React.FC<{ donation: Donation }> = ({ donation }) => (
  <Card className='h-full'>
    <CardHeader>
      <CardTitle className='flex items-center justify-between'>
        <span className='text-lg font-semibold'>{donation.name}</span>
        <Badge variant='outline'>{donation.donationType.name}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <GiftIcon className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm'>
            {donation.amount} {donation.unit?.name || ''}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <CalendarIcon className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm'>
            {format(donation.receivedDate, 'PPP')}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <UserIcon className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm'>{donation.donatorName}</span>
        </div>
        <div className='text-sm text-muted-foreground'>
          Received by: {donation.receiver}
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

const DonationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  usePageTitle('Donations')
  
  return (
    <div>
      <div className='mb-8 space-y-4'>
        <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
          <div className='relative flex-grow'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search Donations...'
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
                <DropdownMenuLabel>Filter Donations</DropdownMenuLabel>
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
              <Plus className='mr-2 h-4 w-4' /> Add Donation
            </Button>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {mockDonations.map((donation) => (
          <DonationCard key={donation.id} donation={donation} />
        ))}
      </div>
    </div>
  );
};

export default DonationsPage;
