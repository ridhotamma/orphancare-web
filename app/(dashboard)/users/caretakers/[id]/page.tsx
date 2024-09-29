'use client'

import UserDetailPage from '@/components/users/profile-picture-upload';
import { usePageTitle } from '@/hooks/use-page-title';

const CareTakerDetailPage = () => {
  usePageTitle('Caretaker Details')
  return <UserDetailPage />;
};

export default CareTakerDetailPage;
