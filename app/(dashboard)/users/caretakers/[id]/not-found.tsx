'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NotFound() {
  const params = useParams()

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-primary mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-text mb-4'>
          User with id {params.id} is not found
        </h2>
        <p className='text-text mb-8'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href='/'
          className='bg-secondary text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors'
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
