'use client';

import BedRoomDetail from '@/components/bedrooms/detail-bedroom';
import LoadingContainer from '@/components/container/loading-container';
import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import { BedRoom } from '@/types/bedroom';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';

interface Payload {
  id?: string;
  name: string;
  bedRoomTypeId: string;
  profiles: string[];
}

const BedRoomDetailPage = ({ params }: { params: { id: string } }) => {
  usePageTitle('Bedroom Detail');

  const [loading, setLoading] = useState(false);
  const [bedroomDetails, setBedroomDetails] = useState<BedRoom | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  const handleEditBedroom = async (payload: Payload) => {
    setLoading(true);
    try {
      await requests({
        url: `/admin/bedrooms/${params.id}`,
        method: 'PUT',
        data: payload,
        params: {
          page: 0,
          perPage: 50,
        },
      });

      getBedroomDetails();
      toast({
        title: 'Bedroom Updated',
        description: 'The bedroom details have been successfully saved',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: error.error,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getBedroomDetails = async () => {
    setLoading(true);
    try {
      const response = await requests({
        url: `/admin/bedrooms/${params.id}`,
        method: 'GET',
        params: {
          page: 0,
          perPage: 50,
        },
      });

      setBedroomDetails(response);
    } catch (error: any) {
      toast({
        title: error.error,
        content: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await requests({
        url: '/admin/users',
        method: 'GET',
        params: {
          page: 0,
          perPage: 150,
        },
      });

      setUsers(response.data);
    } catch (error: any) {
      toast({
        title: error.error,
        content: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBedroomDetails();
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadingContainer loading={loading}>
      <BedRoomDetail
        bedRoom={bedroomDetails}
        onEdit={handleEditBedroom}
        users={users}
      />
    </LoadingContainer>
  );
};

export default BedRoomDetailPage;
