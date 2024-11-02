'use client';

import UserList from '@/components/users/user-list';
import { usePageTitle } from '@/hooks/use-page-title';

const CareTakerPage = () => {
  usePageTitle('Data Pengasuh');

  return <UserList isCareTaker={true} />;
};

export default CareTakerPage;
