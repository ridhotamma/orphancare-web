import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <nav className='py-4 px-6 flex justify-between items-center border-b'>
        <h1 className='text-2xl font-bold text-primary'>OMS</h1>
        <Link href='/auth/login'>
          <Button variant='outline'>Log In</Button>
        </Link>
      </nav>

      <main className='flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='text-4xl sm:text-5xl font-extrabold text-primary mb-6'>
            Orphanage Management System
          </h2>
          <p className='text-xl sm:text-2xl text-muted-foreground mb-8'>
            Empowering caregivers, nurturing futures. Streamline your orphanage
            operations with our comprehensive management solution.
          </p>
          <Link href='/auth/login'>
            <Button size='lg'>Get Started</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
