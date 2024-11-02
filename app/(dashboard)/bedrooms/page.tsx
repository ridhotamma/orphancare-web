'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BedroomFormDialog from '@/components/bedrooms/bedroom-form-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, Eye, UserX, Bed } from 'lucide-react';
import { Profile } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePageTitle } from '@/hooks/use-page-title';
import { BedRoomType, MultiSelectItem } from '@/types/bedroom-type';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import { BedRoom } from '@/types/bedroom';
import { User } from '@/types/user';
import EmptyContainer from '@/components/container/empty-container';
import NotFoundImage from '@/images/not-found-dashboard.png';
import Image from 'next/image';
import LoadingContainer from '@/components/container/loading-container';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDebounce } from '@/hooks/use-debounce';

interface Payload {
  id?: string;
  name: string;
  bedRoomTypeId: string;
  profiles: string[];
}

const BedRoomPage: React.FC = () => {
  usePageTitle('Bed Rooms');

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bedRoomTypes, setBedRoomTypes] = useState<BedRoomType[]>([]);
  const [bedrooms, setBedrooms] = useState<BedRoom[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [bedroomTypeFilter, setBedroomTypeFilter] = useState<string>();
  const [isMounted, setIsMounted] = useState(false);

  const { toast } = useToast();

  const getBedRoomTypes = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const getBedroomData = async (params: Record<string, any> = {}) => {
    setLoading(true);
    try {
      const response = await requests({
        url: '/admin/bedrooms',
        method: 'GET',
        params: {
          page: 0,
          perPage: 50,
          ...params,
        },
      });

      setBedrooms(response.data);
    } catch (error: any) {
      toast({
        title: error.error,
        content: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await requests({
        url: '/admin/users',
        method: 'GET',
        params: {
          page: 0,
          perPage: 150,
        },
      });

      setUsers(response.data);
    } catch (error: any) {
      toast({
        title: error.error,
        content: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBedroom = async (data: Payload) => {
    setLoading(true);
    try {
      await requests({
        url: '/admin/bedrooms',
        method: 'POST',
        data,
      });
      toast({
        title: 'Bedroom successfully added',
        content: 'created successfully',
        variant: 'success',
      });
      getBedroomData();
    } catch (error: any) {
      toast({
        title: error.error,
        content: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    getBedRoomTypes();
    getBedroomData();
    getUserData();
    setIsMounted(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMounted) {
      getBedroomData({
        name: debounceSearch,
        bedRoomTypeId: bedroomTypeFilter === 'all' ? null : bedroomTypeFilter,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch, bedroomTypeFilter, isMounted]);

  const userDropdownList: MultiSelectItem[] = users
    ?.map((user) => ({
      id: user.profile?.id as string,
      label: user.profile?.fullName as string,
      value: user.profile?.id as string,
      avatarUrl: user.profile?.profilePicture as string,
    }))
    .filter((user) => user.label);

  const renderProfileSection = (profiles: Profile[] | undefined) => {
    if (!profiles || profiles.length === 0) {
      return (
        <div className='flex items-center justify-center p-2 bg-gray-50 dark:bg-slate-700 rounded-md'>
          <UserX className='h-4 w-4 text-gray-400 mr-2' />
          <span className='text-sm text-gray-500 dark:text-white'>
            Belum ada penghuni
          </span>
        </div>
      );
    }

    return (
      <div className='flex items-center justify-between'>
        <div className='flex -space-x-4 hover:-space-x-1'>
          {profiles.map((profile: Profile, index: number) => (
            <>
              {index < 5 && (
                <Avatar
                  key={profile.id}
                  className='border-2 border-background transition-all ease-in-out duration-200'
                >
                  <AvatarImage
                    src={profile.profilePicture}
                    alt={profile.fullName}
                    className='object-cover'
                  />
                  <AvatarFallback>{profile.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </>
          ))}
          {profiles.length > 5 && (
            <Avatar className='border-2 border-background'>
              <AvatarFallback className='bg-blue-400 text-white font-bold'>
                {profiles.length - 5}+
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className='flex items-center space-x-1'>
          <Users className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm text-muted-foreground'>
            {profiles.length}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className='mb-6 space-y-4'>
        <div className='flex flex-wrap md:flex-nowrap gap-4'>
          <div className='relative w-full flex-grow'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search bedrooms...'
              className='pl-10 flex-grow'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='w-40'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-full'>
                  <Bed className='mr-2 h-4 w-4' />
                  Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>Filter type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={bedroomTypeFilter}
                  onValueChange={setBedroomTypeFilter}
                >
                  <DropdownMenuRadioItem value='all'>All</DropdownMenuRadioItem>
                  {bedRoomTypes.map((bedRoom) => (
                    <DropdownMenuRadioItem key={bedRoom.id} value={bedRoom.id}>
                      {bedRoom.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' /> Add Bedroom
          </Button>
        </div>
      </div>

      <LoadingContainer loading={loading}>
        {bedrooms.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {bedrooms.map((bedroom) => (
              <Card
                key={bedroom.id}
                className='hover:shadow-lg transition-shadow duration-300'
              >
                <CardHeader className='flex flex-col items-center justify-between space-y-2 pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    {bedroom.name || `Room ${bedroom.id}`}
                  </CardTitle>
                  <Badge variant='secondary'>{bedroom.bedRoomType.name}</Badge>
                </CardHeader>
                <CardContent>
                  <div className='mt-4'>
                    {renderProfileSection(bedroom.profiles)}
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
        ) : (
          <EmptyContainer
            image={
              <Image
                width={300}
                height={300}
                src={NotFoundImage}
                alt='not found users'
              />
            }
            text='Bedrooms not found'
          />
        )}
      </LoadingContainer>

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
