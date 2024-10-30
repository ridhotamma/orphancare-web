'use client'

import DocumentList from '@/components/documents/document-list';
import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import { useEffect, useState } from 'react';
import { Document } from '@/types/document';
import { DocumentType } from '@/types/document-type';
import { User } from '@/types/user';

const DocumentsPage = () => {
  usePageTitle('Documents');

  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [metaData, setMetaData] = useState({});

  const { toast } = useToast();

  const fetchDocumentData = async (
    searchTerm: string = '',
    params: Record<string, any> = {}
  ) => {
    try {
      setLoading(true);
      const response = await requests({
        url: '/public/users/all-documents',
        params: {
          name: searchTerm,
          perPage: 50,
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

  const fetchDocumentTypes = async () => {
    try {
      setLoading(true);
      const data = await requests({
        url: '/admin/document-types',
        method: 'GET',
      });

      setDocumentTypes([
        { id: 'all', label: 'All Documents' },
        ...data.map((type: DocumentType) => ({
          value: type.id,
          label: type.name,
        })),
      ]);
    } catch (error: any) {
      toast({
        title: 'Something went wrong',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserList = async () => {
    try {
      setLoading(true);
      const response = await requests({
        url: '/admin/users',
        method: 'GET',
        params: { perPage: 50 },
      });

      setUserList([
        { id: 'all', label: 'All Users' },
        ...response.data.map((user: User) => ({
          value: user.id,
          label: user.profile?.fullName,
        })),
      ]);
    } catch (error: any) {
      if (error.status !== 404) {
        toast({
          title: 'Something went wrong',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      fetchDocumentTypes();
      fetchUserList();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    fetchDocumentData();
  }, []);

  const handleSearch = (searchTerm: string, params: Record<string, any>) => {
    fetchDocumentData(searchTerm, params);
  };

  return (
    <DocumentList
      documents={documents}
      metaData={metaData}
      onSearch={handleSearch}
      loading={loading}
      users={userList}
      documentTypes={documentTypes}
    />
  );
};

export default DocumentsPage;
