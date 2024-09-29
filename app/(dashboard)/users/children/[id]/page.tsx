'use client'

import UserDetailPage from '@/components/users/user-detail';
import { usePageTitle } from '@/hooks/use-page-title';

const ChildDetailPage = () => {
  usePageTitle('Child Detail')
  
  return <UserDetailPage />;
};

export default ChildDetailPage;
