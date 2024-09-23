'use client'

import { TabItem } from '@/components/layout/TabLayout';
import TabLayout from '@/components/layout/TabLayout';
import { BookLock, File } from 'lucide-react';

const DocumentsPage = () => {
  const tabItems: TabItem[] = [
    {
      label: 'Your Documents',
      content: <div>Your Documents</div>,
      icon: <BookLock className='h-5 w-5' />,
    },
    {
      label: 'User Documents',
      content: <div>User Documents</div>,
      icon: <File className='h-5 w-5' />,
    },
  ];

  return <TabLayout tabs={tabItems} defaultTab='Your Documents' />;
};

export default DocumentsPage;
