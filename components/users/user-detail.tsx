import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TabLayout, { TabItem } from '@/components/layout/tab-layout';
import LoadingContainer from '../container/loading-container';
import { usePageTitle } from '@/hooks/use-page-title';
import { ArrowLeft, File, UserIcon, UserCircle } from 'lucide-react';
import { DetailDocuments } from '@/components/users/detail-documents';
import { DetailProfile } from '@/components/users/detail-profile';
import { DetailCredentials } from '@/components/users/detail-credentials';
import { Button } from '@/components/ui/button';
import { requests } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';
import { User } from '@/types/user';
import { Document } from '@/types/document';

type UserDetailProps = {
  isCareTaker: boolean;
  userId: string;
};

const UserDetailPage: React.FC<UserDetailProps> = ({
  isCareTaker,
  userId,
}: UserDetailProps) => {
  usePageTitle('User Details');
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [userCredential, setUserCredential] = useState<Omit<
    User,
    'profile'
  > | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userDocuments, setUserDocuments] = useState<Document[] | null>(null);
  const [loadingSearchDocument, setLoadingSearchDocument] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const [credentialsResult, { data: documentsResult }, profileResult] =
          await Promise.all([
            requests({
              url: `/admin/users/${userId}`,
            }),
            requests({
              url: `/public/users/${userId}/documents`,
            }),
            requests({
              url: `/public/profiles/${userId}`,
            }),
          ]);

        setUserCredential(credentialsResult);
        setUserDocuments(documentsResult);
        setUserProfile(profileResult);
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

    fetchUserData();
  }, [userId, toast]);

  const refreshUserDocuments = async () => {
    try {
      setLoadingSearchDocument(true);
      const response = await requests({
        url: `/public/users/${userId}/documents`,
      });
      setUserDocuments(response.data);
    } catch (error: any) {
      toast({
        title: 'Cannot refresh documents',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingSearchDocument(false);
    }
  };

  const onDocumentSearch = async (searchTerm: string) => {
    try {
      setLoadingSearchDocument(true);
      const response = await requests({
        url: `/public/users/${userId}/documents`,
        params: { name: searchTerm },
        method: 'GET',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to search documents',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingSearchDocument(false);
    }
  };

  const tabItems: TabItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <DetailProfile
          data={userProfile as Profile}
          credentials={userCredential as Omit<User, 'profile'>}
        />
      ),
      icon: <UserCircle className='h-5 w-5' />,
    },
    {
      id: 'documents',
      label: 'Documents',
      content: (
        <DetailDocuments
          data={userDocuments as Document[]}
          loading={loadingSearchDocument}
          setLoading={setLoadingSearchDocument}
          onSearch={onDocumentSearch}
          userId={userId}
          onRefresh={refreshUserDocuments}
        />
      ),
      icon: <File className='h-5 w-5' />,
    },
    {
      id: 'credentials',
      label: 'Credentials',
      content: (
        <DetailCredentials
          data={userCredential as Omit<User, 'profile'>}
          isCareTaker={isCareTaker}
        />
      ),
      icon: <UserIcon className='h-5 w-5' />,
    },
  ];

  return (
    <LoadingContainer loading={loading} fullScreen>
      <div className='flex items-center mb-6'>
        <Button variant='link' className='p-0' asChild>
          <Link href={isCareTaker ? '/users/caretakers' : '/users/children'}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to {isCareTaker ? 'Caretaker' : 'Children'} List
          </Link>
        </Button>
      </div>
      <TabLayout tabs={tabItems} defaultTab='profile' urlParamName='tab' />
    </LoadingContainer>
  );
};

export default UserDetailPage;
