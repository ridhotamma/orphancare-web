'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Donation } from '@/types/donation';
import { DonationType } from '@/types/donation-type';
import { Unit } from '@/types/unit';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const mockDonationTypes: DonationType[] = [
  {
    id: 'edd53f5b-e213-4420-80f1-ffdfd5c896ce',
    name: 'Food',
    type: 'GOODS',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Clothing',
    type: 'GOODS',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Money',
    type: 'CASH',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockUnits: Unit[] = [
  {
    id: '161f1fce-92c1-4341-bbc7-fc5263a8cbdf',
    name: 'Kg',
    type: 'WEIGHT',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Piece',
    type: 'COUNT',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Liter',
    type: 'VOLUME',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DonationFormPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const isEditMode = !!id;

  const [donation, setDonation] = useState<Donation>({
    id: '',
    name: '',
    amount: 0,
    receivedDate: new Date(),
    receiver: '',
    donatorName: '',
    donationType: mockDonationTypes[0],
    unit: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    if (isEditMode) {
      const mockDonation: Donation = {
        id: '1',
        name: 'Donasi Alat Masak',
        amount: 1,
        receivedDate: new Date('2024-08-24'),
        receiver: 'Anita',
        donatorName: 'Marcella',
        donationType: mockDonationTypes[0],
        unit: mockUnits[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setDonation(mockDonation);
    }
  }, [isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDonation((prev) => ({ ...prev, [name]: value }));
  };

  const handleDonationTypeChange = (value: string) => {
    const selectedType = mockDonationTypes.find((type) => type.id === value);
    if (selectedType) {
      setDonation((prev) => ({ ...prev, donationType: selectedType }));
    }
  };

  const handleUnitChange = (value: string) => {
    const selectedUnit = mockUnits.find((unit) => unit.id === value);
    setDonation((prev) => ({ ...prev, unit: selectedUnit || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      amount: donation.amount.toString(),
      receiver: donation.receiver,
      name: donation.name,
      unitId: donation.unit?.id,
      donationTypeId: donation.donationType.id,
      donatorName: donation.donatorName,
      receivedDate: format(donation.receivedDate, 'yyyy-MM-dd'),
    };
    console.log('Submitting donation:', payload);
    router.push('/donations');
  };

  return (
    <div className='container mx-auto px-0 lg:px-20'>
      <div className='flex items-center mb-6'>
        <Button variant='link' className='p-0' asChild>
          <Link href='/donations'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Event List
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? 'Edit Donation' : 'Create New Donation'}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Donation Name</Label>
              <Input
                id='name'
                name='name'
                value={donation.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='amount'>Amount</Label>
                <Input
                  id='amount'
                  name='amount'
                  type='number'
                  value={donation.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='unit'>Unit</Label>
                <Select
                  onValueChange={handleUnitChange}
                  value={donation.unit?.id || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select unit' />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='receivedDate'>Received Date</Label>
              <Input
                id='receivedDate'
                name='receivedDate'
                type='date'
                value={format(donation.receivedDate, 'yyyy-MM-dd')}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='receiver'>Receiver</Label>
              <Input
                id='receiver'
                name='receiver'
                value={donation.receiver}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='donatorName'>Donator Name</Label>
              <Input
                id='donatorName'
                name='donatorName'
                value={donation.donatorName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='donationType'>Donation Type</Label>
              <Select
                onValueChange={handleDonationTypeChange}
                value={donation.donationType.id}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select donation type' />
                </SelectTrigger>
                <SelectContent>
                  {mockDonationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full'>
              {isEditMode ? 'Update Donation' : 'Create Donation'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default DonationFormPage;
