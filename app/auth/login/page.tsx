import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import BackgroundImage from '@/images/background-image-1.webp';

const LoginPage = () => {
  return (
    <div className='flex min-h-screen bg-background'>
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
          <form className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <Input
                type='email'
                id='email'
                placeholder='Enter your email'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                type='password'
                id='password'
                placeholder='Enter your password'
                required
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='remember-me' />
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
            <Button type='submit' className='w-full'>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
