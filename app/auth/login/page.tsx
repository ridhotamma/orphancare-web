'use client';
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { requests } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

import BackgroundImage from '@/images/background-image-1.webp';
import cookieStorage from '@/lib/storage/cookies';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const REMEMBERED_USERNAME_KEY = 'rememberedUsername';

const LoginPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const rememberedUsername: string | null = cookieStorage.getItem(
      REMEMBERED_USERNAME_KEY
    );
    if (rememberedUsername) {
      setFormData((prev) => ({
        ...prev,
        username: rememberedUsername,
        rememberMe: true,
      }));
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await requests({
        url: '/auth/login',
        method: 'POST',
        data: formData,
      });

      const authToken = response.jwt;

      cookieStorage.setItem('authToken', authToken);

      if (formData.rememberMe) {
        cookieStorage.setItem(REMEMBERED_USERNAME_KEY, formData.username);
      } else {
        cookieStorage.removeItem(REMEMBERED_USERNAME_KEY);
      }

      router.push('/dashboard');

      toast({
        title: 'Berhasil Masuk',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='hidden lg:block lg:w-1/2 relative'>
        <Image
          src={BackgroundImage}
          alt='Latar belakang login'
          layout='fill'
          objectFit='cover'
        />
      </div>

      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <h2 className='text-3xl font-bold mb-6 text-primary text-center'>
            Selamat Datang Kembali
          </h2>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <Label htmlFor='username'>Nama Pengguna</Label>
              <Input
                type='username'
                id='username'
                name='username'
                placeholder='Masukkan nama pengguna'
                required
                value={formData.username}
                onChange={handleInputChange}
                autoComplete='username'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Kata Sandi</Label>
              <Input
                type='password'
                id='password'
                name='password'
                placeholder='Masukkan kata sandi'
                required
                value={formData.password}
                onChange={handleInputChange}
                autoComplete='current-password'
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='remember-me'
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label
                  htmlFor='remember-me'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Ingat saya
                </Label>
              </div>
              <div className='text-sm'>
                <Link
                  href='/auth/forgot-password'
                  className='font-medium text-primary hover:text-secondary'
                >
                  Lupa kata sandi?
                </Link>
              </div>
            </div>
            <Button disabled={loading} type='submit' className='w-full'>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {loading ? 'Mohon Tunggu..' : 'Masuk'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
