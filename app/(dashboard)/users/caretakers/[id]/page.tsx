'use client';

import UserDetailPage from '@/components/users/user-detail';
import { usePageTitle } from '@/hooks/use-page-title';

const CareTakerDetailPage = ({ params }: { params: { id: string } }) => {
  usePageTitle('Caretaker Details');
  return <UserDetailPage isCareTaker={true} userId={params.id} />;
};

export default CareTakerDetailPage;
