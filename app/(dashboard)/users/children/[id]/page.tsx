'use client';

import UserDetailPage from '@/components/users/user-detail';
import { usePageTitle } from '@/hooks/use-page-title';

const ChildDetailPage = ({ params }: { params: { id: string } }) => {
  usePageTitle('Detail Anak Asuh');

  return <UserDetailPage isCareTaker={false} userId={params.id} />;
};

export default ChildDetailPage;
