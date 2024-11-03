/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { NumericFormat } from 'react-number-format';
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
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import LoadingContainer from '../container/loading-container';
import { ArrowLeft, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const DonationFormPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const isEditMode = !!id;

  const [donation, setDonation] = useState<Donation>({
    name: '',
    amount: 0,
    receivedDate: format(new Date(), 'yyyy-MM-dd'),
    receiver: '',
    donatorName: '',
    donationType: null,
    donationTypeId: null,
    unitId: null,
    unit: null,
  });

  const [donationTypes, setDonationTypes] = useState<DonationType[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { toast } = useToast();

  const getDonationTypes = async () => {
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

  const getDonationDetails = async () => {
    setLoading(true);
    try {
      const response = await requests({
        url: `/admin/donations/${id}`,
        method: 'GET',
      });
      setDonation(response);
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

  const updateDonation = async () => {
    try {
      const response = await requests({
        url: `/admin/donations/${id}`,
        method: 'PUT',
        data: donation,
      });
      setDonation(response);
      router.push('/donations');
      toast({
        title: 'Berhasil ubah donasi',
        description: 'Donasi berhasil diubah',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Terjadi Kesalahan',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const saveDonation = async () => {
    try {
      await requests({
        url: `/admin/donations`,
        method: 'POST',
        data: donation,
      });
      router.push('/donations');
      toast({
        title: 'Berhasil tambah donasi',
        description: 'Donasi berhasil ditambahkan',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Terjadi Kesalahan',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteDonation = async () => {
    try {
      await requests({
        url: `/admin/donations/${id}`,
        method: 'DELETE',
      });
      router.push('/donations');
      toast({
        title: 'Berhasil hapus donasi',
        description: 'Donasi berhasil dihapus',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Terjadi Kesalahan',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getUnits = async () => {
    try {
      const response = await requests({
        url: '/admin/units',
        method: 'GET',
      });
      setUnits(response);
    } catch (error: any) {
      toast({
        title: 'Terjadi Kesalahan',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    getUnits();
    getDonationTypes();

    if (isEditMode) {
      getDonationDetails();
    }
  }, [isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDonation((prev) => ({ ...prev, [name]: value }));
  };

  const handleDonationTypeChange = (value: string) => {
    const selectedType = donationTypes.find((type) => type.id === value);
    if (selectedType) {
      setDonation((prev) => ({
        ...prev,
        donationType: selectedType,
        donationTypeId: selectedType.id,
      }));
    }
  };

  const handleUnitChange = (value: string) => {
    const selectedUnit = units.find((unit) => unit.id === value);
    setDonation((prev) => ({
      ...prev,
      unit: selectedUnit || null,
      unitId: selectedUnit?.id as string,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      updateDonation();
    } else {
      saveDonation();
    }
  };

  return (
    <LoadingContainer loading={loading}>
      <div className='container mx-auto px-0 lg:px-20'>
        <div className='flex items-center justify-between mb-6'>
          <Button variant='link' className='p-0' asChild>
            <Link href='/donations'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Donation List
            </Link>
          </Button>
          {isEditMode && (
            <Button
              variant='destructive'
              onClick={() => setShowDeleteDialog(true)}
              size='sm'
            >
              <Trash2 className='h-4 w-4 mr-2' />
              Hapus Donasi
            </Button>
          )}
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
                  placeholder='Contoh: Donasi uang untuk keperluan...'
                  required
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='amount'>Amount</Label>
                  <NumericFormat
                    value={donation.amount}
                    onValueChange={(values) =>
                      setDonation((prev) => ({
                        ...prev,
                        amount: values.floatValue as number,
                      }))
                    }
                    allowLeadingZeros
                    thousandSeparator=','
                    customInput={Input}
                    name='amount'
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
                      {units.map((unit) => (
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
                  placeholder='Contoh: Anita'
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
                  placeholder='Contoh: Pak Budi Sepriadi'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='donationType'>Donation Type</Label>
                <Select
                  onValueChange={handleDonationTypeChange}
                  value={donation.donationTypeId as string}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select donation type' />
                  </SelectTrigger>
                  <SelectContent>
                    {donationTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={loading} type='submit' className='w-full'>
                {isEditMode ? 'Update Donation' : 'Create Donation'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apakah Anda yakin ingin menghapus donasi ini?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan secara permanen
              menghapus donasi dan menghapus semua data yang terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteDonation}
              className='bg-red-500 hover:bg-red-600'
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LoadingContainer>
  );
};

export default DonationFormPage;
