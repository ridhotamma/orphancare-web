'use client'

import { requests } from '@/app/lib/axios';

const UsersPage = () => {
  const handleClickButton = async () => {
    console.log('button clicked');
    try {
      const response = await requests({
        url: '/users',
      });
      console.log({ response });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className='bg-primary h-screen w-full grid place-content-center'>
      <h1 className='text-white text-4xl capitalize mb-4'>hello world</h1>
      <button
        onClick={handleClickButton}
        className='p-2 bg-secondary text-white rounded-md hover:opacity-70'
      >
        Fetch Data
      </button>
    </div>
  );
};

export default UsersPage;
