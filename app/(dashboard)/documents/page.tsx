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
import { useSearchParams } from 'next/navigation';
import useCurrentUser from '@/stores/current-user';

const DocumentsPage = () => {
  usePageTitle('Documents');

  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [metaData, setMetaData] = useState({});

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { userDetail } = useCurrentUser();

  const currentTab = searchParams.get('tab');

  useEffect(() => {
    const fetchDocumentData = async (
      searchTerm: string = '',
      params: Record<string, any> = {}
    ) => {
      try {
        setLoading(true);

        const ownerId = currentTab === 'your-documents' ? userDetail?.id : null;

        const response = await requests({
          url: '/public/users/all-documents',
          params: {
            name: searchTerm,
            ownerId,
            ...params,
          },
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
  }, [toast, currentTab, userDetail]);

  const handleSearch = (searchTerm: string) => {
    const fetchDocumentData = async () => {
      try {
        setLoading(true);
        const ownerId = currentTab === 'your-documents' ? userDetail?.id : null;

        const response = await requests({
          url: '/public/users/all-documents',
          params: {
            name: searchTerm,
            ownerId,
          },
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
  };

  const tabItems: TabItem[] = [
    {
      id: 'your-documents',
      label: 'Your Documents',
      content: (
        <DocumentList
          documents={documents}
          metaData={metaData}
          onSearch={handleSearch}
        />
      ),
      icon: <BookLock className='h-5 w-5' />,
    },
    {
      id: 'all-documents',
      label: 'All User Documents',
      content: (
        <DocumentList
          documents={documents}
          metaData={metaData}
          onSearch={handleSearch}
        />
      ),
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
