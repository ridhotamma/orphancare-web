'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import mockUsers from '@/data/mockup/users-mockup';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Mail,
  Calendar,
  FileText,
  Search,
  Filter,
  Plus,
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
import { usePageTitle } from '@/hooks/use-page-title';

const CareTakersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [bedRoomFilter, setBedRoomFilter] = useState('all');

  usePageTitle('Caretakers');

  return (
    <div>
      <div className='mb-8 space-y-4'>
        <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
          <div className='relative flex-grow'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search users...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-2 lg:gap-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Filter className='mr-2 h-4 w-4' />
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
                  <DropdownMenuRadioItem value='male'>
                    Male
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='female'>
                    Female
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Filter className='mr-2 h-4 w-4' />
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
                  <DropdownMenuRadioItem value='male'>
                    Umar bin Khattab
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='female'>
                    Ummu Kultsum
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> Add User
            </Button>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {mockUsers.map((user) => (
          <div key={user.id}>
            <Card className='w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300'>
              <CardHeader className='bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700 text-white p-4'>
                <div className='flex items-center space-x-4'>
                  <Avatar className='h-16 w-16 border-2 border-white'>
                    <AvatarImage
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
                    <Badge
                      variant='secondary'
                      className='mt-1 bg-white/20 text-white'
                    >
                      Administrator
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-4'>
                <div className='space-y-3'>
                  <div className='flex items-center text-sm text-gray-600 dark:text-gray-200'>
                    <Mail className='mr-2 h-4 w-4' />
                    {user.email}
                  </div>
                  <div className='flex items-center text-sm text-gray-600 dark:text-gray-200'>
                    <FileText className='mr-2 h-4 w-4' />
                    Documents: {user.documents.size}
                  </div>
                  <div className='flex items-center text-sm text-gray-600 dark:text-gray-200'>
                    <Calendar className='mr-2 h-4 w-4' />
                    Joined: {user.createdAt.toLocaleDateString()}
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
                <Button variant='outline' className='w-full'>
                  <Eye className='mr-2 h-4 w-4' /> View Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareTakersPage;
