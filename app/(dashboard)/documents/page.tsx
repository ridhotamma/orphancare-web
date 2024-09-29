'use client';

import DocumentList from '@/components/documents/document-list';
import { TabItem } from '@/components/layout/tab-layout';
import TabLayout from '@/components/layout/tab-layout';
import { usePageTitle } from '@/hooks/use-page-title';
import { BookLock, File } from 'lucide-react';

const DocumentsPage = () => {
  usePageTitle('Documents');

  const tabItems: TabItem[] = [
    {
      id: 'your-documents',
      label: 'Your Documents',
      content: <DocumentList />,
      icon: <BookLock className='h-5 w-5' />,
    },
    {
      id: 'user-documents',
      label: 'User Documents',
      content: <DocumentList />,
      icon: <File className='h-5 w-5' />,
    },
  ];

  return (
    <TabLayout tabs={tabItems} defaultTab='your-documents' urlParamName='tab' />
  );
};

export default DocumentsPage;
