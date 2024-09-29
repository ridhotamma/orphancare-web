'use client'

import UserDetailPage from '@/components/users/user-detail';
import { usePageTitle } from '@/hooks/use-page-title';

const CareTakerDetailPage = () => {
  usePageTitle('Caretaker Details')
  return <UserDetailPage />;
};

export default CareTakerDetailPage;
