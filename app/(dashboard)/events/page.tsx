/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Plus,
  Eye,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';
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
import { usePageTitle } from '@/hooks/use-page-title';
import Link from 'next/link';
import { DateRange } from 'react-day-picker';
import DateRangeFilter from '@/components/ui/date-range';
import { Event, EventStatusText } from '@/types/event';
import { requests } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import EmptyContainer from '@/components/container/empty-container';
import EmptyImageEvent from '@/images/not-found-event.png';
import Image from 'next/image';
import LoadingContainer from '@/components/container/loading-container';
import { useDebounce } from '@/hooks/use-debounce';
import { EventStatus } from '@/types/enums';

const EventsPage: React.FC = () => {
  usePageTitle('Events');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [events, setEvents] = useState<Event[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const getEvents = async (params: Record<string, any> = {}) => {
    setLoading(true);
    try {
      const response = await requests({
        url: '/admin/events',
        method: 'GET',
        params: {
          perPage: 50,
          ...params,
        },
      });
      setEvents(response.data);
      setPaginationMeta(response.meta);
    } catch (error: any) {
      toast({
        title: 'Terjadi Kesalahan',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    getEvents({
      name: debounceSearch,
      startDateFrom: dateRange?.from
        ? format(dateRange.from, 'yyyy-MM-dd')
        : undefined,
      startDateTo: dateRange?.to
        ? format(dateRange.to, 'yyyy-MM-dd')
        : undefined,
      status: filterStatus === 'all' ? undefined : filterStatus,
    });
  }, [debounceSearch, dateRange, filterStatus]);

  const handlePageChange = (page: number) => {
    getEvents({
      name: debounceSearch,
      page,
      startDateFrom: dateRange?.from
        ? format(dateRange.from, 'yyyy-MM-dd')
        : undefined,
      startDateTo: dateRange?.to
        ? format(dateRange.to, 'yyyy-MM-dd')
        : undefined,
      status: filterStatus === 'all' ? undefined : filterStatus,
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col space-y-4'>
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
            <DateRangeFilter
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Filter className='mr-2 h-4 w-4' />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                >
                  <DropdownMenuRadioItem value='all'>All</DropdownMenuRadioItem>
                  {Object.values(EventStatus).map((status) => (
                    <DropdownMenuRadioItem key={status} value={status}>
                      {EventStatusText[status]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild>
              <Link href='/events/create'>
                <Plus className='mr-2 h-4 w-4' /> Add Event
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <LoadingContainer loading={loading}>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Place</TableHead>
                <TableHead>Organizer</TableHead>
                <TableHead className='w-[100px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className='font-medium'>{event.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={'outline'}
                      className={`border-slate-800 min-w-[130px] text-center line-clamp-1`}
                    >
                      {EventStatusText[event.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(event.startDate, 'PPP')}</TableCell>
                  <TableCell>{format(event.endDate, 'PPP')}</TableCell>
                  <TableCell>{event.place}</TableCell>
                  <TableCell>{event.organizer}</TableCell>
                  <TableCell>
                    <Button variant='outline' size='sm' asChild>
                      <Link href={`/events/${event.id}`}>
                        <Eye className='mr-2 h-4 w-4' />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {events.length === 0 && (
          <EmptyContainer
            text='No events found'
            image={
              <Image
                src={EmptyImageEvent}
                alt='Empty state illustration'
                objectFit='contain'
                width={300}
                height={300}
              />
            }
          />
        )}
      </LoadingContainer>

      {events.length > 0 && (
        <div className='flex items-center justify-between px-2 py-4'>
          <div className='text-sm text-muted-foreground'>
            Showing {paginationMeta.currentPage * paginationMeta.perPage + 1} to{' '}
            {Math.min(
              (paginationMeta.currentPage + 1) * paginationMeta.perPage,
              paginationMeta.total
            )}{' '}
            of {paginationMeta.total} entries
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
              Page {paginationMeta.currentPage + 1} of{' '}
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
    </div>
  );
};

export default EventsPage;
