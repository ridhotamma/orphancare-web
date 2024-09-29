'use client'

import UserDetailPage from '@/components/users/profile-picture-upload';
import { usePageTitle } from '@/hooks/use-page-title';

const ChildDetailPage = () => {
  usePageTitle('Child Detail')
  return <UserDetailPage />;
};

export default ChildDetailPage;
