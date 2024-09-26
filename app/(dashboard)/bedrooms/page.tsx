'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Users, ArrowRight, Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockBedRooms } from '@/data/mockup/bedroom-mockup';
import { Profile } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BedRoomPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddBedroom = () => {
    console.log('add bed room');
  };

  const handleBedRoomClick = (id: string) => {
    router.push(`/bedrooms/${id}`);
  };

  return (
    <div>
      <div className='mb-6 space-y-4'>
        <div className='flex space-x-4'>
          <div className='relative flex-grow'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search bedrooms...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddBedroom}>
            <Plus className='mr-2 h-4 w-4' /> Add Bedroom
          </Button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {mockBedRooms.map((bedroom) => (
          <Card
            key={bedroom.id}
            className='hover:shadow-lg transition-shadow duration-300'
          >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {bedroom.name || `Room ${bedroom.id}`}
              </CardTitle>
              <Badge variant='outline'>{bedroom.bedRoomType.name}</Badge>
            </CardHeader>
            <CardContent>
              <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                <BedDouble className='h-4 w-4' />
                <span>{bedroom.bedRoomType.type}</span>
              </div>
              <div className='mt-4 flex items-center justify-between'>
                <div className='flex -space-x-4 hover:-space-x-1'>
                  {bedroom.profiles.map((profile: Profile, index: number) => (
                    <>
                      {index < 5 && (
                        <Avatar
                          key={profile.id}
                          className='border-2 border-background transition-all ease-in-out duration-200'
                        >
                          <AvatarImage
                            src={profile.profilePicture}
                            alt={profile.fullName}
                          />
                          <AvatarFallback>
                            {profile.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </>
                  ))}

                  {bedroom.profiles.length > 5 && (
                    <Avatar className='border-2 border-background'>
                      <AvatarFallback className='bg-blue-400 text-white font-bold'>
                        {bedroom.profiles.length - 5}+
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className='flex items-center space-x-1'>
                  <Users className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>
                    {bedroom.profiles.length}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleBedRoomClick(bedroom.id)}
                className='mt-4 flex items-center text-sm text-blue-500 hover:text-blue-600'
              >
                View Details
                <ArrowRight className='ml-1 h-4 w-4' />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BedRoomPage;
