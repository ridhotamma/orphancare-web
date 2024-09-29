'use client';

import LoadingContainer from '@/components/container/loading-container';
import UserForm from '@/components/users/user-form';
import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import { useAuth } from '@/provider/auth-provider';
import { useEffect, useState } from 'react';

const DetailChildDataPage = ({ params }: { params: { id: string } }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState({});
  const { setUnauthorized } = useAuth();
  const { toast } = useToast();

  usePageTitle('Child Detail')

  const getUserDetail = async () => {
    setLoading(true);
    try {
      const data = await requests({
        url: `/admin/users/${params.id}`,
        method: 'GET',
      });
      setUserDetail(data);
      console.log({ data });
    } catch (error: any) {
      console.log({ error })
      if (error.status === 401) {
        setUnauthorized(true);
      } else {
        toast({
          title: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);
  
  return (
    <LoadingContainer loading={loading}>
      <UserForm careTakerForm={false} editMode={true} />
    </LoadingContainer>
  );
};

export default DetailChildDataPage;
