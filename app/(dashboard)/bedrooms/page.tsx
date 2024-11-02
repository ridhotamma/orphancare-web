'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BedroomFormDialog from '@/components/bedrooms/bedroom-form-dialog';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, UserX, Bed } from 'lucide-react';
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
  usePageTitle('Kamar Tidur');

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bedRoomTypes, setBedRoomTypes] = useState<BedRoomType[]>([]);
  const [bedrooms, setBedrooms] = useState<BedRoom[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [bedroomTypeFilter, setBedroomTypeFilter] = useState<string>('all');
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
        title: 'Kamar berhasil ditambahkan',
        content: 'berhasil dibuat',
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

  const renderProfiles = (profiles: Profile[] | undefined) => {
    if (!profiles?.length) {
      return (
        <div className='flex items-center text-gray-500'>
          <UserX className='h-4 w-4 mr-2' />
          <span className='text-sm'>Kosong</span>
        </div>
      );
    }

    return (
      <div className='flex -space-x-2'>
        {profiles.slice(0, 3).map((profile) => (
          <Avatar key={profile.id} className='border-2 border-white h-8 w-8'>
            <AvatarImage src={profile.profilePicture} alt={profile.fullName} />
            <AvatarFallback>{profile.fullName?.[0]}</AvatarFallback>
          </Avatar>
        ))}
        {profiles.length > 3 && (
          <Avatar className='border-2 border-white h-8 w-8'>
            <AvatarFallback className='bg-blue-400 text-white'>
              +{profiles.length - 3}
            </AvatarFallback>
          </Avatar>
        )}
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
              placeholder='Cari kamar tidur...'
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
                  Kategori Kamar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter tipe</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={bedroomTypeFilter}
                  onValueChange={setBedroomTypeFilter}
                >
                  <DropdownMenuRadioItem value='all'>
                    Semua
                  </DropdownMenuRadioItem>
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
            <Plus className='mr-2 h-4 w-4' /> Tambah Kamar
          </Button>
        </div>
      </div>

      <LoadingContainer loading={loading}>
        {bedrooms.length > 0 ? (
          <Card className='p-4'>
            <div className='grid gap-4'>
              {bedrooms.map((bedroom) => (
                <div
                  key={bedroom.id}
                  className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50'
                >
                  <div className='flex items-center space-x-4'>
                    <div>
                      <h3 className='font-medium'>
                        {bedroom.name || `Kamar ${bedroom.id}`}
                      </h3>
                      <Badge variant='secondary' className='mt-1'>
                        {bedroom.bedRoomType.name}
                      </Badge>
                    </div>
                  </div>

                  <div className='flex items-center space-x-6'>
                    {renderProfiles(bedroom.profiles)}

                    <Button variant='outline' size='sm' asChild>
                      <Link href={`/bedrooms/${bedroom.id}`}>
                        <Eye className='h-4 w-4 mr-2' />
                        Detail
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <EmptyContainer
            image={
              <Image
                width={300}
                height={300}
                src={NotFoundImage}
                alt='kamar tidak ditemukan'
              />
            }
            text='Kamar tidak ditemukan'
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
