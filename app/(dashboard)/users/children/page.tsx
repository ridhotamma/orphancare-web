'use client';

import UserList from '@/components/users/user-list';
import { usePageTitle } from '@/hooks/use-page-title';

const ChildrenPage = () => {
  usePageTitle('Children Data');

  return <UserList isCareTaker={false} />;
};

export default ChildrenPage;
