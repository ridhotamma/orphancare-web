'use client';

import UserDetailPage from '@/components/users/user-detail';
import { usePageTitle } from '@/hooks/use-page-title';

const ChildDetailPage = ({ params }: { params: { id: string } }) => {
  usePageTitle('Child Detail');

  return <UserDetailPage isCareTaker={false} userId={params.id} />;
};

export default ChildDetailPage;
