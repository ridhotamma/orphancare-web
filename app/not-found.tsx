import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-primary mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-text mb-4'>
          Page Not Found
        </h2>
        <p className='text-text mb-8'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href='/'
          className='bg-secondary text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors'
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
