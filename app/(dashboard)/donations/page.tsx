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
import { Donation } from '@/types/donation';
import { requests } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import EmptyContainer from '@/components/container/empty-container';
import EmptyImageDonation from '@/images/not-found-money.png';
import Image from 'next/image';
import LoadingContainer from '@/components/container/loading-container';
import { useDebounce } from '@/hooks/use-debounce';
import { DonationType } from '@/types/donation-type';
import { formatNumber } from '@/lib/utils';

const DonationsPage: React.FC = () => {
  usePageTitle('Donations');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [donationTypes, setDonationTypes] = useState<DonationType[]>([]);

  const { toast } = useToast();

  const getDonationTypes = async (params: Record<string, any> = {}) => {
    try {
      const response = await requests({
        url: '/admin/donation-types',
        method: 'GET',
      });
      setDonationTypes(response);
    } catch (error: any) {
      toast({
        title: 'Terjadi Kesalahan',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getDonations = async (params: Record<string, any> = {}) => {
    setLoading(true);
    try {
      const response = await requests({
        url: '/admin/donations',
        method: 'GET',
        params: {
          perPage: 50,
          ...params,
        },
      });
      setDonations(response.data);
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
    getDonationTypes();
  }, []);

  useEffect(() => {
    getDonations({
      name: debounceSearch,
      startDate: dateRange?.from ? format(dateRange?.from || new Date(), 'yyyy-MM-dd') : null,
      endDate: dateRange?.to ? format(dateRange?.to || new Date(), 'yyyy-MM-dd') : null,
      donationTypeId: filterCategory === 'all' ? null : filterCategory,
    });
  }, [debounceSearch, dateRange, filterCategory]);

  const handlePageChange = (page: number) => {
    getDonations({
      name: debounceSearch,
      page,
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
              placeholder='Search Donations...'
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
                  {donationTypes.map((type) => {
                    return (
                      <DropdownMenuRadioItem key={type.id} value={type.id}>
                        {type.name}
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild>
              <Link href='/donations/create'>
                <Plus className='mr-2 h-4 w-4' /> Add Donation
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
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Donator</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead className='w-[100px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className='font-medium'>{donation.name}</TableCell>
                  <TableCell>
                    <Badge variant='outline'>
                      {donation.donationType?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatNumber(donation.amount)} {donation.unit?.name || ''}
                  </TableCell>
                  <TableCell>{format(donation.receivedDate, 'PPP')}</TableCell>
                  <TableCell>{donation.donatorName}</TableCell>
                  <TableCell>{donation.receiver}</TableCell>
                  <TableCell>
                    <Button variant='outline' size='sm' asChild>
                      <Link href={`/donations/${donation.id}`}>
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

        {donations.length === 0 && (
          <EmptyContainer
            text='Data donasi tidak ditemukan'
            image={
              <Image
                src={EmptyImageDonation}
                alt='Empty state illustration'
                objectFit='contain'
                width={300}
              />
            }
          />
        )}
      </LoadingContainer>

      {donations.length > 0 && (
        <div className='flex items-center justify-between px-2 py-4'>
          <div className='text-sm text-muted-foreground'>
            Menampilkan{' '}
            {paginationMeta.currentPage * paginationMeta.perPage + 1} sampai{' '}
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
    </div>
  );
};

export default DonationsPage;
