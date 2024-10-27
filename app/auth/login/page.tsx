'use client';
import React, { useState, FormEvent, ChangeEvent } from 'react';
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
import { Loader2, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Theme } from '@/types/themes';
import { useTheme } from 'next-themes';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { theme, setTheme } = useTheme() as {
    theme: Theme | undefined;
    setTheme: (value: string) => void;
  };

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState<boolean>(false);

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
      router.push('/dashboard');

      toast({
        title: 'Login Success',
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
    <div className='flex min-h-screen bg-background relative'>
      <div className='absolute top-4 right-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon'>
              <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
              <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
              <span className='sr-only'>Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel>Theme Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value='light'>Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='dark'>Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='system'>
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='hidden lg:block lg:w-1/2 relative'>
        <Image
          src={BackgroundImage}
          alt='Login background'
          layout='fill'
          objectFit='cover'
        />
      </div>

      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <h2 className='text-3xl font-bold mb-6 text-primary text-center'>
            Welcome Back
          </h2>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                type='username'
                id='username'
                name='username'
                placeholder='Enter your username'
                required
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                type='password'
                id='password'
                name='password'
                placeholder='Enter your password'
                required
                value={formData.password}
                onChange={handleInputChange}
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
                  Remember me
                </Label>
              </div>
              <div className='text-sm'>
                <Link
                  href='/auth/forgot-password'
                  className='font-medium text-primary hover:text-secondary'
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            <Button disabled={loading} type='submit' className='w-full'>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {loading ? 'Please Wait..' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
