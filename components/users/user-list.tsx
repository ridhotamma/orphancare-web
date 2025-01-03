import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Search,
  Plus,
  UserSearch,
  Bed,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import LoadingContainer from '@/components/container/loading-container';
import { User } from '@/types/user';
import { format } from 'date-fns';
import { RoleType } from '@/types/enums';
import { BedRoom } from '@/types/bedroom';
import EmptyContainer from '@/components/container/empty-container';
import Image from 'next/image';
import NotFoundImage from '@/images/not-found-common.png';
import Link from 'next/link';

type UserListProps = {
  isCareTaker?: boolean;
};

type PaginationMeta = {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
};

const UserList: React.FC<UserListProps> = ({ isCareTaker }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [bedRoomFilter, setBedRoomFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [bedRoomData, setBedRoomData] = useState<BedRoom[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    currentPage: 0,
    perPage: 10,
    total: 0,
    totalPages: 0,
  });

  const { toast } = useToast();

  const getChildrenData = useCallback(
    async (query: string = '', page: number = 0) => {
      try {
        const params: Record<string, any> = {
          isCareTaker,
          page,
          perPage: paginationMeta.perPage,
          search: query,
          bedRoomId: bedRoomFilter === 'all' ? undefined : bedRoomFilter,
          gender: genderFilter === 'all' ? undefined : genderFilter,
        };

        const response = await requests({
          url: '/admin/users',
          params,
        });

        setUserData(response.data);
        setPaginationMeta(response.meta);
      } catch (error: any) {
        toast({
          title: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
        setSearching(false);
      }
    },
    [
      isCareTaker,
      bedRoomFilter,
      genderFilter,
      paginationMeta.perPage,
      toast,
    ]
  );

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        getChildrenData(query, 0);
        setSearching(false);
      }, 500);
    },
    [getChildrenData]
  );

  const handleSearchUsers = (query: string) => {
    setSearchQuery(query);
    setSearching(true);
    debouncedSearch(query);
  };

  const handlePageChange = (page: number) => {
    getChildrenData(searchQuery, page);
  };

  useEffect(() => {
    const getBedRooms = async () => {
      try {
        const response = await requests({
          url: '/admin/bedrooms',
          method: 'GET',
        });
        setBedRoomData(response.data);
      } catch (error: any) {
        toast({
          title: error.message,
          variant: 'destructive',
        });
      }
    };

    getBedRooms();
  }, [toast]);

  useEffect(() => {
    setSearching(true);
    debouncedSearch(searchQuery);
  }, [debouncedSearch, searchQuery, genderFilter, bedRoomFilter]);

  return (
    <LoadingContainer loading={loading}>
      <div className='mb-8 space-y-4'>
        <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
          <div className='relative flex-grow'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Cari pengguna...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => handleSearchUsers(e.target.value)}
            />
          </div>
          <div className='flex items-center flex-wrap md:flex-nowrap gap-2 lg:gap-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-full'>
                  <UserSearch className='mr-2 h-4 w-4' />
                  Jenis Kelamin
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter Berdasarkan Jenis Kelamin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={genderFilter}
                  onValueChange={setGenderFilter}
                >
                  <DropdownMenuRadioItem value='all'>Semua</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='MALE'>
                    Laki-laki
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='FEMALE'>
                    Perempuan
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-full'>
                  <Bed className='mr-2 h-4 w-4' />
                  Kamar Tidur
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter Berdasarkan Kamar Tidur</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={bedRoomFilter}
                  onValueChange={setBedRoomFilter}
                >
                  <DropdownMenuRadioItem value='all'>Semua</DropdownMenuRadioItem>
                  {bedRoomData.map((bedRoom) => (
                    <DropdownMenuRadioItem key={bedRoom.id} value={bedRoom.id}>
                      {bedRoom.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className='w-full' asChild>
              <Link
                href={
                  isCareTaker
                    ? '/users/caretakers/create'
                    : '/users/children/create'
                }
              >
                <Plus className='mr-2 h-4 w-4' /> Tambah Pengguna
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <LoadingContainer loading={searching} fullScreen={false}>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Kamar Tidur</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-center'>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center space-x-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={user.profile?.profilePicture}
                          alt={user.username}
                          className='object-cover'
                        />
                        <AvatarFallback>
                          {user.profile?.fullName?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.profile?.fullName || user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary'>
                      {user.roles.includes(RoleType.ADMIN)
                        ? 'Administrator'
                        : 'Pengguna'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.profile?.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
                  </TableCell>
                  <TableCell>{user.profile?.bedRoom?.name || '-'}</TableCell>
                  <TableCell>
                    {user.profile?.joinDate
                      ? format(new Date(user.profile.joinDate), 'dd MMM yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <div
                        className={`h-2 w-2 rounded-full mr-2 ${
                          user.active ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span>{user.active ? 'Aktif' : 'Tidak Aktif'}</span>
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Button variant='outline' size='sm' asChild>
                      <Link
                        href={
                          isCareTaker
                            ? `/users/caretakers/${user.id}`
                            : `/users/children/${user.id}`
                        }
                      >
                        <Eye className='mr-2 h-4 w-4' /> Lihat
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {!userData.length && (
          <EmptyContainer
            image={
              <Image
                width={300}
                height={300}
                src={NotFoundImage}
                alt='pengguna tidak ditemukan'
              />
            }
            text='Pengguna tidak ditemukan'
          />
        )}

        {userData.length > 0 && (
          <div className='flex items-center justify-between px-2 py-4'>
            <div className='text-sm text-muted-foreground'>
              Menampilkan {paginationMeta.currentPage * paginationMeta.perPage + 1}{' '}
              sampai{' '}
              {Math.min(
                (paginationMeta.currentPage + 1) * paginationMeta.perPage,
                paginationMeta.total
              )}{' '}
              dari {paginationMeta.total} entri
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(0)}
                disabled={paginationMeta.currentPage === 0}
              >
                <ChevronsLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(paginationMeta.currentPage - 1)}
                disabled={paginationMeta.currentPage === 0}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <span className='text-sm'>
                Halaman {paginationMeta.currentPage + 1} dari{' '}
                {paginationMeta.totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(paginationMeta.currentPage + 1)}
                disabled={
                  paginationMeta.currentPage === paginationMeta.totalPages - 1
                }
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(paginationMeta.totalPages - 1)}
                disabled={
                  paginationMeta.currentPage === paginationMeta.totalPages - 1
                }
              >
                <ChevronsRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </LoadingContainer>
    </LoadingContainer>
  );
};

export default UserList;
