'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Pencil, X, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { requests } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { usePageTitle } from '@/hooks/use-page-title';
import IndonesianFlag from '@/images/indonesia.png';
import UKFlag from '@/images/united-kingdom.png';
import JapanFlag from '@/images/japan.png';
import NotFoundBankImage from '@/images/not-found-bank.png';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

type BankAccount = {
  id: string;
  bankName: string;
  bankAccountNumber: string;
  bankBranch: string;
  accountHolderName: string;
};

type Settings = {
  id: string;
  enableChildSubmission: boolean;
  enableDonationPortal: boolean;
  bankAccounts: BankAccount[];
  orgPhoneNumber: string;
};

const AppSettingsPage = () => {
  usePageTitle('Pengaturan Aplikasi');

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    id: '',
    enableChildSubmission: false,
    enableDonationPortal: false,
    bankAccounts: [],
    orgPhoneNumber: '',
  });
  const [locale, setLocale] = useState('id');

  const addBankAccount = () => {
    setSettings((prev) => ({
      ...prev,
      bankAccounts: [
        ...prev.bankAccounts,
        {
          id: crypto.randomUUID(),
          bankName: '',
          bankAccountNumber: '',
          bankBranch: '',
          accountHolderName: '',
        },
      ],
    }));
  };

  const removeBankAccount = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((account) => account.id !== id),
    }));
  };

  const updateBankAccount = (
    id: string,
    field: keyof BankAccount,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map((account) =>
        account.id === id ? { ...account, [field]: value } : account
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await requests({
        url: '/admin/settings',
        method: 'PUT',
        data: settings,
      });
      toast({
        title: 'Berhasil Disimpan',
        description: 'Pengaturan aplikasi berhasil tersimpan',
        variant: 'success',
      });
      setSettings(response);
      setIsEdit(false);
    } catch (error: any) {
      const errorMessage =
        error.message ||
        Object.values(error)
          .map((entry) => entry)
          .join(', ');
      toast({
        title: 'Terjadi Kesalahan',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSettings = async () => {
    setLoading(true);
    try {
      const response = await requests({
        url: '/admin/settings',
        method: 'GET',
      });
      setSettings(response);
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

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div className='container mx-auto px-0 lg:px-20'>
      {/* Header and navigation section remains the same */}
      <div className='flex items-center justify-between mb-6'>
        <Button variant='link' className='p-0' asChild>
          <Link href='/dashboard'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Kembali ke dashboard
          </Link>
        </Button>
        {isEdit ? (
          <div className='space-x-2'>
            <Button
              variant='outline'
              onClick={() => setIsEdit(false)}
              disabled={loading}
            >
              <X className='h-4 w-4 mr-2' />
              Batalkan
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className='h-4 w-4 mr-2' />
              Simpan pengaturan
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEdit(true)} disabled={loading}>
            <Pencil className='h-4 w-4 mr-2' />
            Ubah pengaturan
          </Button>
        )}
      </div>

      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Bahasa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Label htmlFor='locale'>Bahasa aplikasi</Label>
              <p className='text-sm text-gray-500 mb-2'>
                Pilih bahasa yang akan digunakan dalam aplikasi. Perubahan
                bahasa akan mempengaruhi tampilan seluruh konten aplikasi.
              </p>
              <Select
                onValueChange={(value) => setLocale(value)}
                value={locale}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Pilih bahasa' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='id'>
                    <div className='flex items-center gap-2'>
                      <div className='w-5 h-5 relative'>
                        <Image
                          src={IndonesianFlag}
                          alt='indonesian flag'
                          fill
                          className='object-cover'
                        />
                      </div>
                      Bahasa Indonesia
                    </div>
                  </SelectItem>
                  <SelectItem value='en'>
                    <div className='flex items-center gap-2'>
                      <div className='w-5 h-5 relative'>
                        <Image
                          src={UKFlag}
                          alt='english flag'
                          fill
                          className='object-cover'
                        />
                      </div>
                      English
                    </div>
                  </SelectItem>
                  <SelectItem value='ja'>
                    <div className='flex items-center gap-2'>
                      <div className='w-5 h-5 relative'>
                        <Image
                          src={JapanFlag}
                          alt='japanese flag'
                          fill
                          className='object-cover'
                        />
                      </div>
                      日本語
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Aplikasi</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='donations-feature'>Buka portal donasi</Label>
                  <p className='text-sm text-gray-500'>
                    Dengan membuka portal donasi, masyarakat dapat memberikan
                    donasi secara online melalui transfer bank.
                  </p>
                </div>
                <Switch
                  id='donations-feature'
                  checked={settings.enableDonationPortal}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      enableDonationPortal: checked,
                    }))
                  }
                  disabled={!isEdit}
                />
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='child-submission'>
                    Buka portal pendaftaran anak panti baru
                  </Label>
                  <p className='text-sm text-gray-500'>
                    Dengan membuka portal pendaftaran, pihak panti asuhan dapat
                    mendaftarkan anak-anak baru untuk tinggal di panti.
                  </p>
                </div>
                <Switch
                  id='child-submission'
                  checked={settings.enableChildSubmission}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      enableChildSubmission: checked,
                    }))
                  }
                  disabled={!isEdit}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone'>Nomor telepon panti</Label>
              <p className='text-sm text-gray-500 mb-2'>
                Nomor telepon ini akan ditampilkan sebagai kontak utama panti
                asuhan dan dapat dihubungi oleh donatur atau pihak yang
                berkepentingan untuk informasi lebih lanjut.
              </p>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry='ID'
                placeholder='Masukkan nomor telepon panti'
                inputComponent={Input}
                value={settings.orgPhoneNumber}
                onChange={(newPhoneNumber) =>
                  setSettings((prev) => ({
                    ...prev,
                    orgPhoneNumber: newPhoneNumber as string,
                  }))
                }
                disabled={!isEdit}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>Akun Bank</CardTitle>
              <p className='text-sm text-gray-500 mt-1'>
                Daftar rekening bank yang dapat digunakan untuk menerima donasi.
              </p>
            </div>
            {isEdit && (
              <Button onClick={addBankAccount} variant='outline' size='sm'>
                <Plus className='h-4 w-4 mr-2' />
                Tambah akun
              </Button>
            )}
          </CardHeader>
          <CardContent className='space-y-6'>
            {settings.bankAccounts.map((account, index) => (
              <div key={account.id} className='space-y-4 p-4 border rounded-lg'>
                <div className='flex justify-between items-center'>
                  <h4 className='font-medium'>Bank Account {index + 1}</h4>
                  {isEdit && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => removeBankAccount(account.id)}
                      className='text-red-500 hover:text-red-700'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  )}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Nama Bank</Label>
                    <Input
                      value={account.bankName}
                      onChange={(e) =>
                        updateBankAccount(
                          account.id,
                          'bankName',
                          e.target.value
                        )
                      }
                      disabled={!isEdit}
                      placeholder='Contoh: Bank BCA'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Nomor Rekening</Label>
                    <Input
                      value={account.bankAccountNumber}
                      onChange={(e) =>
                        updateBankAccount(
                          account.id,
                          'bankAccountNumber',
                          e.target.value
                        )
                      }
                      disabled={!isEdit}
                      placeholder='Contoh: 1234567890'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Cabang</Label>
                    <Input
                      value={account.bankBranch}
                      onChange={(e) =>
                        updateBankAccount(
                          account.id,
                          'bankBranch',
                          e.target.value
                        )
                      }
                      disabled={!isEdit}
                      placeholder='Contoh: Jakarta Pusat'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Nama Pemegang Rekening</Label>
                    <Input
                      value={account.accountHolderName}
                      onChange={(e) =>
                        updateBankAccount(
                          account.id,
                          'accountHolderName',
                          e.target.value
                        )
                      }
                      disabled={!isEdit}
                      placeholder='Contoh: Yayasan Panti Asuhan'
                    />
                  </div>
                </div>
              </div>
            ))}
            {settings.bankAccounts.length === 0 && (
              <div className='flex flex-col justify-center items-center'>
                <Image
                  src={NotFoundBankImage}
                  width={200}
                  height={200}
                  alt='bank account not found'
                />
                <div className='text-center text-gray-500 py-4'>
                  <p>Belum ada akun bank untuk donasi.</p>{' '}
                  <p className='text-sm'>
                    Tambahkan akun bank untuk memudahkan donatur melakukan
                    transfer donasi.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppSettingsPage;
