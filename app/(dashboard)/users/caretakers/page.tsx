'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Search,
  Plus,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Mock data based on the User type
const mockUsers = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'johndoe',
    roles: new Set(['CHILD']),
    profile: { firstName: 'John', lastName: 'Doe', age: 10 },
    active: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-20'),
  },
  {
    id: '2',
    email: 'jane@example.com',
    username: 'janedoe',
    roles: new Set(['CHILD']),
    profile: { firstName: 'Jane', lastName: 'Doe', age: 12 },
    active: false,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-07-10'),
  },
  {
    id: '3',
    email: 'jane@example.com',
    username: 'janedoe',
    roles: new Set(['CHILD']),
    profile: { firstName: 'Jane', lastName: 'Doe', age: 12 },
    active: false,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-07-10'),
  },
  {
    id: '4',
    email: 'jane@example.com',
    username: 'janedoe',
    roles: new Set(['CHILD']),
    profile: { firstName: 'Jane', lastName: 'Doe', age: 12 },
    active: false,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-07-10'),
  },
  // Add more mock data as needed
];

const CareTakerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredChildren = mockUsers.filter(
    (user) =>
      user.profile &&
      (user.profile.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        user.profile.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pageCount = Math.ceil(filteredChildren.length / itemsPerPage);
  const paginatedChildren = filteredChildren.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className='min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <div className='relative w-64'>
          <Input
            type='text'
            placeholder='Search children...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
          <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
        </div>
        <Button className='bg-green-500 hover:bg-green-600'>
          <Plus className='mr-2 h-4 w-4' /> Add New Child
        </Button>
      </div>

      <div className='rounded-lg shadow overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedChildren.map((child) => (
              <TableRow key={child.id}>
                <TableCell className='font-medium'>
                  {child.profile?.firstName} {child.profile?.lastName}
                </TableCell>
                <TableCell>
                  <div className='flex items-center'>
                    <Mail className='mr-2 h-4 w-4 text-gray-400' />
                    {child.email}
                  </div>
                </TableCell>
                <TableCell>{child.profile?.age}</TableCell>
                <TableCell>
                  {child.active ? (
                    <span className='flex items-center text-green-600'>
                      <CheckCircle className='mr-1 h-4 w-4' /> Active
                    </span>
                  ) : (
                    <span className='flex items-center text-red-600'>
                      <XCircle className='mr-1 h-4 w-4' /> Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className='flex items-center'>
                    <Calendar className='mr-2 h-4 w-4 text-gray-400' />
                    {child.createdAt.toLocaleDateString()}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='mt-6'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='#' />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#' isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href='#' />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default CareTakerPage;
