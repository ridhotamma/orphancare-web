'use client'

import DocumentList from '@/components/documents/document-list';
import { TabItem } from '@/components/layout/tab-layout';
import TabLayout from '@/components/layout/tab-layout';
import { BookLock, File } from 'lucide-react';

const DocumentsPage = () => {
  const tabItems: TabItem[] = [
    {
      label: 'Your Documents',
      content: <DocumentList/>,
      icon: <BookLock className='h-5 w-5' />,
    },
    {
      label: 'User Documents',
      content: <DocumentList/>,
      icon: <File className='h-5 w-5' />,
    },
  ];

  return <TabLayout tabs={tabItems} defaultTab='Your Documents' />;
};

export default DocumentsPage;
