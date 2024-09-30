'use client';

import UserDetailPage from '@/components/users/user-detail';
import { usePageTitle } from '@/hooks/use-page-title';

const ChildDetailPage = () => {
  usePageTitle('My Profile');

  return <UserDetailPage />;
};

export default ChildDetailPage;
