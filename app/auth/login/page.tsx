import Image from 'next/image';
import React from 'react';

const LoginPage = () => {
  return (
    <div className='flex min-h-screen bg-background'>
      <div className='hidden lg:block lg:w-1/2 relative'>
        <Image
          src='https://picsum.photos/1080?random=1'
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
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                required
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-text mb-1'
              >
                Password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                required
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-text'
                >
                  Remember me
                </label>
              </div>
              <div className='text-sm'>
                <a
                  href='#'
                  className='font-medium text-primary hover:text-secondary'
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <button
              type='submit'
              className='w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-300'
            >
              Sign In
            </button>
          </form>
          <p className='mt-8 text-center text-sm text-text'>
            Not a member?{' '}
            <a
              href='#'
              className='font-medium text-primary hover:text-secondary'
            >
              Sign up now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
