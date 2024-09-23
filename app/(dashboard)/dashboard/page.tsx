'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Home,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Coffee,
} from 'lucide-react';

// Mock data for the line chart
const donationData = [
  { month: 'Jan', money: 1000, food: 500 },
  { month: 'Feb', money: 1500, food: 700 },
  { month: 'Mar', money: 1200, food: 600 },
  { month: 'Apr', money: 1800, food: 900 },
  { month: 'May', money: 2000, food: 1000 },
  { month: 'Jun', money: 2500, food: 1200 },
];

// Mock data for inventory
const inventoryData = [
  { category: 'Clothing', count: 500 },
  { category: 'Electronics', count: 200 },
  { category: 'Furniture', count: 150 },
  { category: 'Books', count: 1000 },
  { category: 'Toys', count: 300 },
];

const DashboardPage = () => {
  return (
    <div className='min-h-screen'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-300'>
              Female Children
            </CardTitle>
            <Users className='h-4 w-4 text-pink-500' />
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-pink-600'>245</div>
            <p className='text-xs text-gray-500 mt-1'>↑ 12% from last month</p>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-300'>
              Male Children
            </CardTitle>
            <Users className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-blue-600'>231</div>
            <p className='text-xs text-gray-500 mt-1'>↑ 8% from last month</p>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-300'>
              Female Bedrooms
            </CardTitle>
            <Home className='h-4 w-4 text-purple-500' />
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-purple-600'>62</div>
            <p className='text-xs text-gray-500 mt-1'>85% occupancy</p>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-300'>
              Male Bedrooms
            </CardTitle>
            <Home className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-green-600'>58</div>
            <p className='text-xs text-gray-500 mt-1'>90% occupancy</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <CardHeader>
            <CardTitle className='flex items-center text-gray-800 dark:text-gray-300'>
              <ShoppingBag className='mr-2' /> Total Inventory by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='category' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <CardHeader>
            <CardTitle className='flex items-center text-gray-800 dark:text-gray-300'>
              <TrendingUp className='mr-2' /> Donation Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={donationData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='money'
                  stroke='#8884d8'
                  name='Money'
                />
                <Line
                  type='monotone'
                  dataKey='food'
                  stroke='#82ca9d'
                  name='Food'
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <CardHeader>
            <CardTitle className='flex items-center text-gray-800 dark:text-gray-300'>
              <DollarSign className='mr-2' /> Recent Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              <li className='flex justify-between items-center'>
                <span>Anonymous</span>
                <span className='font-semibold text-green-600'>$1,000</span>
              </li>
              <li className='flex justify-between items-center'>
                <span>Sarah Johnson</span>
                <span className='font-semibold text-green-600'>$500</span>
              </li>
              <li className='flex justify-between items-center'>
                <span>Tech for Good Inc.</span>
                <span className='font-semibold text-green-600'>$5,000</span>
              </li>
              <li className='flex justify-between items-center'>
                <span>Local Bakery</span>
                <span className='font-semibold text-orange-600'>50 loaves</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <CardHeader>
            <CardTitle className='flex items-center text-gray-800 dark:text-gray-300'>
              <Coffee className='mr-2' /> Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* <ul className='space-y-2'>
              <li className='flex justify-between items-center'>
                <span>Community Fundraiser</span>
                <span className='text-sm text-gray-600'>July 15</span>
              </li>
              <li className='flex justify-between items-center'>
                <span>Volunteer Appreciation Day</span>
                <span className='text-sm text-gray-600'>July 22</span>
              </li>
              <li className='flex justify-between items-center'>
                <span>Back-to-School Drive</span>
                <span className='text-sm text-gray-600'>August 5</span>
              </li>
              <li className='flex justify-between items-center'>
                <span>Annual Gala Dinner</span>
                <span className='text-sm text-gray-600'>September 10</span>
              </li>
            </ul> */}
            <div className='w-full h-24 grid place-items-center'>
              No upcoming events
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
