import React from 'react';
import { usePageTitle } from '@/hooks/use-page-title';
import TabLayout, { TabItem } from '@/components/layout/tab-layout';
import { File, User, UserCircle } from 'lucide-react';
import { DetailDocuments } from '@/components/users/detail-documents';
import { DetailProfile } from '@/components/users/detail-profile';
import { DetailCredentials } from '@/components/users/detail-credentials';

const UserDetailPage: React.FC = () => {
  usePageTitle('User Details');

  const tabItems: TabItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      content: <DetailProfile />,
      icon: <UserCircle className='h-5 w-5' />,
    },
    {
      id: 'documents',
      label: 'Documents',
      content: <DetailDocuments />,
      icon: <File className='h-5 w-5' />,
    },
    {
      id: 'credentials',
      label: 'Credentials',
      content: <DetailCredentials />,
      icon: <User className='h-5 w-5' />,
    },
  ];

  return <TabLayout tabs={tabItems} defaultTab='profile' urlParamName='tab' />;
};

export default UserDetailPage;