'use client';

import UserList from '@/components/users/user-list';
import { usePageTitle } from '@/hooks/use-page-title';

const ChildrenPage = () => {
  usePageTitle('Data Anak Asuh');

  return <UserList isCareTaker={false} />;
};

export default ChildrenPage;
