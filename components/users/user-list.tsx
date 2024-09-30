import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Calendar,
  Search,
  Plus,
  UserSearch,
  Bed,
  CircleUser,
  RefreshCcw,
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
import { useAuth } from '@/provider/auth-provider';
import { requests } from '@/lib/api';
import LoadingContainer from '@/components/container/loading-container';
import { User } from '@/types/user';
import { format } from 'date-fns';
import { RoleType } from '@/types/enums';
import { BedRoom } from '@/types/bedroom';
import EmptyContainer from '../container/empty-container';
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [bedRoomData, setBedRoomData] = useState<BedRoom[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    currentPage: 0,
    perPage: 50,
    total: 0,
    totalPages: 0,
  });

  const { toast } = useToast();
  const { setUnauthorized } = useAuth();

  const getChildrenData = useCallback(
    async (query: string = '', page: number = 0, append: boolean = false) => {
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

        if (append) {
          setUserData((prev) => [...prev, ...response.data]);
        } else {
          setUserData(response.data);
        }
        setPaginationMeta(response.meta);
      } catch (error: any) {
        if (error.status === 401) {
          setUnauthorized(true);
        } else {
          toast({
            title: error.message,
            variant: 'destructive',
          });
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setSearching(false);
      }
    },
    [
      isCareTaker,
      bedRoomFilter,
      genderFilter,
      paginationMeta.perPage,
      setUnauthorized,
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

  const handleLoadMore = () => {
    if (paginationMeta.currentPage < paginationMeta.totalPages - 1) {
      setLoadingMore(true);
      getChildrenData(searchQuery, paginationMeta.currentPage + 1, true);
    }
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
        if (error.status === 401) {
          setUnauthorized(true);
        } else {
          toast({
            title: error.message,
            variant: 'destructive',
          });
        }
      }
    };

    getBedRooms();
  }, [setUnauthorized, toast]);

  useEffect(() => {
    setSearching(true);
    debouncedSearch(searchQuery);
  }, [debouncedSearch, searchQuery, genderFilter, bedRoomFilter]);

  const renderUserCard = (user: User) => (
    <Card
      key={user.id}
      className='w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300'
    >
      <CardHeader className='bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700 p-4 text-white'>
        <div className='flex items-center space-x-4'>
          <Avatar className='h-16 w-16 border-2 border-white'>
            <AvatarImage
              className='object-cover'
              src={user.profile?.profilePicture}
              alt={user.username}
            />
            <AvatarFallback className='text-xl font-bold text-gray-600 dark:text-gray-200'>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className='text-xl font-bold'>
              {user.profile?.fullName || user.username}
            </CardTitle>
            <Badge variant='secondary' className='mt-1 bg-white/20 text-white'>
              {user.roles.includes(RoleType.ADMIN) ? 'Administrator' : 'User'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-4'>
        <div className='space-y-3'>
          <div className='flex items-center text-sm text-gray-600 dark:text-gray-200'>
            <CircleUser className='mr-2 h-4 w-4' />
            Gender: {user.profile?.gender}
          </div>
          <div className='flex items-center text-sm text-gray-600 dark:text-gray-200'>
            <Bed className='mr-2 h-4 w-4' />
            Bed Room: {user.profile?.bedRoom?.name}
          </div>
          <div className='flex items-center text-sm text-gray-600 dark:text-gray-200'>
            <Calendar className='mr-2 h-4 w-4' />
            Joined:{' '}
            {(user.profile?.joinDate &&
              format(new Date(user.profile.joinDate), 'dd MMMM yyyy')) ||
              '-'}
          </div>
          <div className='flex items-center'>
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                user.active ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className='text-sm font-medium'>
              {user.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='p-4'>
        <Button variant='outline' className='w-full' asChild>
          <Link href={isCareTaker ? `/users/caretakers/${user.id}` : `/users/children/${user.id}`}>
            <Eye className='mr-2 h-4 w-4' /> View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <LoadingContainer loading={loading}>
      <div className='mb-8 space-y-4'>
        <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
          <div className='relative flex-grow'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search users...'
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
                  Gender
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>Filter By Gender</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={genderFilter}
                  onValueChange={setGenderFilter}
                >
                  <DropdownMenuRadioItem value='all'>All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='MALE'>
                    Male
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='FEMALE'>
                    Female
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-full'>
                  <Bed className='mr-2 h-4 w-4' />
                  Bed Room
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>Filter By Bed Room</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={bedRoomFilter}
                  onValueChange={setBedRoomFilter}
                >
                  <DropdownMenuRadioItem value='all'>All</DropdownMenuRadioItem>
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
                <Plus className='mr-2 h-4 w-4' /> Add User
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <LoadingContainer loading={searching} fullScreen={false}>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {userData.map(renderUserCard)}
        </div>

        {userData.length > 0 &&
          paginationMeta.currentPage < paginationMeta.totalPages - 1 && (
            <div className='p-8 w-full flex justify-center items-center'>
              <Button
                onClick={handleLoadMore}
                className='flex items-center gap-2'
                disabled={loadingMore}
              >
                {loadingMore && <RefreshCcw className='w-4 h-4 animate-spin' />}
                Load more
              </Button>
            </div>
          )}

        {!userData.length && (
          <EmptyContainer
            image={
              <Image
                width={300}
                height={300}
                src={NotFoundImage}
                alt='not found users'
              />
            }
            text='User not found'
          />
        )}
      </LoadingContainer>
    </LoadingContainer>
  );
};

export default UserList;
