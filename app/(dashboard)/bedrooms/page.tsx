'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Users, Search, Plus, Eye } from 'lucide-react';
import { mockBedRooms } from '@/data/mockup/bedroom-mockup';
import { Profile } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePageTitle } from '@/hooks/use-page-title';
import Link from 'next/link';
import mockUsers from '@/data/mockup/users-mockup';
import { BedRoomType, MultiSelectItem } from '@/types/bedroom-type';
import BedroomFormDialog from '@/components/bedrooms/bedroom-form-dialog';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';

const BedRoomPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bedRoomTypes, setBedRoomTypes] = useState<BedRoomType[]>([]);

  const userDropdownList: MultiSelectItem[] = mockUsers
    .map((user) => ({
      id: user.id as string,
      label: user.profile?.fullName as string,
      value: user.profile?.id as string,
      avatarUrl: user.profile?.profilePicture as string,
    }))
    .filter((user) => user.label);

  const handleAddBedroom = () => {
    console.log('add bed room');
  };

  const { toast } = useToast();

  useEffect(() => {
    const getBedRoomTypes = async () => {
      try {
        const data = await requests({
          url: '/admin/bedroom-types',
          method: 'GET',
        });

        setBedRoomTypes(data);
      } catch (error: any) {
        toast({
          title: error.error,
          content: error.message,
          variant: 'destructive',
        });
      }
    };

    getBedRoomTypes();
  }, [toast]);

  usePageTitle('Bed Rooms');

  return (
    <div>
      <div className='mb-6 space-y-4'>
        <div className='flex flex-wrap md:flex-nowrap gap-4'>
          <div className='relative w-full flex-grow'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search bedrooms...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' /> Add Bedroom
          </Button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {mockBedRooms.map((bedroom, index) => (
          <Card
            key={index}
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
                  {bedroom.profiles?.map((profile: Profile, index: number) => (
                    <>
                      {index < 5 && (
                        <Avatar
                          key={index}
                          className='border-2 border-background transition-all ease-in-out duration-200'
                        >
                          <AvatarImage
                            src={profile.profilePicture}
                            alt={profile.fullName}
                          />
                          <AvatarFallback>
                            {profile.fullName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </>
                  ))}

                  {bedroom.profiles && bedroom.profiles?.length > 5 && (
                    <Avatar key={index} className='border-2 border-background'>
                      <AvatarFallback className='bg-blue-400 text-white font-bold'>
                        {bedroom.profiles.length - 5}+
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className='flex items-center space-x-1'>
                  <Users className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>
                    {bedroom.profiles?.length}
                  </span>
                </div>
              </div>
              <Button variant='outline' className='w-full mt-8' asChild>
                <Link href={`/bedrooms/${bedroom.id}`}>
                  <Eye className='mr-2 h-4 w-4' /> View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <BedroomFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddBedroom}
        bedRoomTypes={bedRoomTypes}
        users={userDropdownList}
      />
    </div>
  );
};

export default BedRoomPage;
