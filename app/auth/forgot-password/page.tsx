'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className='flex min-h-screen bg-background'>
      <div className='hidden lg:block lg:w-1/2 relative'>
        <Image
          src='https://picsum.photos/1080?random=2'
          alt='Forgot password background'
          layout='fill'
          objectFit='cover'
        />
      </div>

      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <h2 className='text-3xl font-bold mb-6 text-primary text-center'>
            Forgot Password
          </h2>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-text mb-1'
                >
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  required
                />
              </div>
              <button
                type='submit'
                className='w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-300'
              >
                Reset Password
              </button>
            </form>
          ) : (
            <div className='text-center'>
              <p className='text-green-600 mb-4'>
                If an account exists for {email}, you will receive password
                reset instructions.
              </p>
              <Link href='/auth/login' className='text-primary hover:text-secondary'>
                Return to Login
              </Link>
            </div>
          )}
          <div className='mt-8 text-center'>
            <Link
              href='/auth/login'
              className='text-sm text-primary hover:text-secondary'
            >
              Remember your password? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
