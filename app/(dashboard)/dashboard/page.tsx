'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  Home,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Gift,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import {
  DashboardAnalytics,
  initialDashboardState,
  ShortProfile,
} from '@/types/dashboard-analytics';
import LoadingContainer from '@/components/container/loading-container';
import { usePageTitle } from '@/hooks/use-page-title';
import Image from 'next/image';
import EmptyImageDistribution from '@/images/not-found-analytics.png';
import EmptyImageDonation from '@/images/not-found-donation.png';
import EmptyImageRecentDonation from '@/images/not-found-money.png';
import EmptyImageEvent from '@/images/not-found-document.png';
import { EventStatusText } from '@/types/event';
import { EventStatus } from '@/types/enums';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const COLORS = [
  '#0088FE', // Vivid Blue
  '#00C49F', // Teal
  '#FFBB28', // Golden Yellow
  '#FF8042', // Orange
  '#8884D8', // Purple
  '#FF4D6D', // Pink
  '#4CAF50', // Green
  '#607D8B', // Blue Gray
  '#009688', // Dark Teal
  '#FF6B6B', // Coral
  '#3F51B5', // Indigo
  '#795548', // Brown
  '#F44336', // Red
  '#FFA726', // Light Orange,
  '#9C27B0', // Deep Purple
];

const DashboardPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardAnalytics>(
    initialDashboardState()
  );

  usePageTitle('Dashboard');

  const {
    profile = {} as ShortProfile,
    donationTrends = [],
    donationTypeDistribution = [],
    latestDonations = [],
    latestEvents = [],
  } = dashboardData;

  useEffect(() => {
    const getDashboardAnalyticsData = async () => {
      setLoading(true);
      try {
        const data = await requests({
          url: '/admin/analytics/dashboard',
          method: 'GET',
        });
        setDashboardData(data);
      } catch (error: any) {
        toast({
          title: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    getDashboardAnalyticsData();
  }, [toast]);

  const renderEmptyState = (
    title: string,
    description: string,
    type:
      | 'donationDistribution'
      | 'donationTrends'
      | 'recentDonations'
      | 'recentEvents'
  ) => {
    const ImageType: Record<string, any> = {
      donationDistribution: EmptyImageDistribution,
      donationTrends: EmptyImageDonation,
      recentDonations: EmptyImageRecentDonation,
      recentEvents: EmptyImageEvent,
    };

    return (
      <div className='flex flex-col items-center justify-center p-8 text-center h-[300px] w-full rounded-lg'>
        <div className='relative h-full w-full mb-4'>
          <Image
            src={ImageType[type]}
            alt='Empty state illustration'
            fill={true}
            objectFit='contain'
          />
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>
    );
  };

  return (
    <LoadingContainer loading={loading}>
      <div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card className='hover:shadow-lg transition-shadow duration-300'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Anak Asuh Perempuan
              </CardTitle>
              <Users className='h-4 w-4 text-pink-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>
                {profile.totalStudentFemaleCount}
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                {profile.studentFemaleDifference === 'N/A'
                  ? 'N/A'
                  : `${profile.studentFemaleDifference} dibanding tahun lalu`}
              </p>
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-shadow duration-300'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Anak Asuh Laki-Laki
              </CardTitle>
              <Users className='h-4 w-4 text-blue-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>
                {profile.totalStudentMaleCount}
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                {profile.studentMaleDifference} dibanding tahun lalu
              </p>
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-shadow duration-300'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Pengasuh
              </CardTitle>
              <Home className='h-4 w-4 text-purple-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>{profile.careTakerCount}</div>
              <p className='text-xs text-gray-500 mt-1'>
                {profile.careTakerAdminCount} Orang Sebagai Administrator
              </p>
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-shadow duration-300'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Alumni
              </CardTitle>
              <ShoppingBag className='h-4 w-4 text-green-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>{profile.alumniCount}</div>
              <p className='text-xs text-gray-500 mt-1'>
                Jumlah orang yang sudah lulus
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <Card className='hover:shadow-lg transition-shadow duration-300'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <ShoppingBag className='mr-2' /> Distribusi Tipe Donasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {donationTypeDistribution.length > 0 ? (
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={donationTypeDistribution}
                      dataKey='amount'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      fill='#8884d8'
                      label
                    >
                      {donationTypeDistribution.map(
                        (entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend
                      wrapperStyle={{
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                renderEmptyState(
                  'Tidak ada data',
                  'Data donasi tidak ditemukan',
                  'donationDistribution'
                )
              )}
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-shadow duration-300'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <TrendingUp className='mr-2' /> Tren Donasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {donationTrends.length > 0 ? (
                <ResponsiveContainer width='100%' height={300}>
                  <LineChart data={donationTrends}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis
                      label={{
                        value: 'Jumlah Donasi',
                        angle: -90,
                        position: 'insideLeft',
                        offset: 0,
                        textAnchor: 'middle',
                        dy: 70,
                      }}
                    />
                    <Tooltip />
                    <Legend
                      wrapperStyle={{
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    />
                    {Object.keys(donationTrends[0]?.data || {}).map(
                      (key, index) => (
                        <Line
                          key={key}
                          type='monotone'
                          dataKey={`data.${key}`}
                          name={`Donasi ${
                            key.charAt(0).toUpperCase() + key.slice(1)
                          }`}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={3}
                        />
                      )
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                renderEmptyState(
                  'Tidak ada data',
                  'Data trend tidak ditemukan',
                  'donationTrends'
                )
              )}
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card className='hover:shadow-lg transition-shadow duration-300'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Gift className='mr-2' /> Donasi Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestDonations.length > 0 ? (
                <ul className='space-y-4'>
                  {latestDonations.slice(0, 5).map((donation: any) => (
                    <li key={donation.id} className='border-b pb-2'>
                      <div className='flex justify-between items-center'>
                        <span className='font-semibold'>
                          {donation.donatorName}
                        </span>
                        <span className='text-green-600 font-bold'>
                          {donation.amount}
                        </span>
                      </div>
                      <div className='flex justify-between items-center text-sm text-gray-600'>
                        <span>{donation.donationType}</span>
                        <span>
                          {new Date(donation.receivedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                renderEmptyState(
                  'Tidak ada data',
                  'Data donasi terbaru tidak ditemukan',
                  'recentDonations'
                )
              )}
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-shadow duration-300'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Calendar className='mr-2' /> Event Yang Akan Datang
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestEvents.length > 0 ? (
                <ul className='space-y-4'>
                  {latestEvents.slice(0, 5).map((event: any) => (
                    <li key={event.id} className='border-b pb-2'>
                      <div className='flex justify-between items-center'>
                        <span className='font-semibold'>{event.name}</span>
                        <Badge
                          className={`text-white min-w-[130px] text-center line-clamp-1 hover:bg-none`}
                        >
                          {EventStatusText[event.status as EventStatus]}
                        </Badge>
                      </div>
                      <div className='flex justify-between items-center text-sm text-gray-600 mt-1'>
                        <span>{event.organizer}</span>
                      </div>
                      <div className='text-xs text-gray-500 mt-1'>
                        {formatDate(event.startDate)} -{' '}
                        {formatDate(event.endDate)}
                      </div>
                      <div className='text-xs text-gray-500 mt-1'>
                        {event.place}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                renderEmptyState(
                  'Tidak ada data',
                  'Data event tidak ditemukan',
                  'recentEvents'
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </LoadingContainer>
  );
};

export default DashboardPage;
