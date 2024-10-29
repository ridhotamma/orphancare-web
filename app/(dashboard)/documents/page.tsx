'use client';

import LoadingContainer from '@/components/container/loading-container';
import DocumentList from '@/components/documents/document-list';
import { TabItem } from '@/components/layout/tab-layout';
import TabLayout from '@/components/layout/tab-layout';
import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import { BookLock, File } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Document } from '@/types/document';

const DocumentsPage = () => {
  usePageTitle('Documents');

  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [metaData, setMetaData] = useState({});

  const { toast } = useToast();

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        setLoading(true);

        const response = await requests({
          url: '/public/users/all-documents',
          params: {},
        });

        setDocuments(response.data);
        setMetaData(response.meta);
      } catch (error: any) {
        toast({
          title: 'Error fetching user data',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentData();
  }, [toast]);

  const tabItems: TabItem[] = [
    {
      id: 'your-documents',
      label: 'Your Documents',
      content: <DocumentList documents={documents} metaData={metaData} />,
      icon: <BookLock className='h-5 w-5' />,
    },
    {
      id: 'user-documents',
      label: 'User Documents',
      content: <DocumentList documents={documents} metaData={metaData} />,
      icon: <File className='h-5 w-5' />,
    },
  ];

  return (
    <LoadingContainer loading={loading}>
      <TabLayout
        tabs={tabItems}
        defaultTab='your-documents'
        urlParamName='tab'
      />
    </LoadingContainer>
  );
};

export default DocumentsPage;
