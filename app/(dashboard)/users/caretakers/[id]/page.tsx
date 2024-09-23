'use client';

import { notFound } from 'next/navigation'

const UsersPage = ({ params }: { params: { id: string } }) => {

  notFound()
  
  return (
    <div className='bg-primary h-screen w-full grid place-content-center'>
      <h1 className='text-white text-4xl capitalize mb-4'>
        user details {params.id}
      </h1>
    </div>
  );
};

export default UsersPage;
