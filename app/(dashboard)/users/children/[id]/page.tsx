'use client'

import LoadingContainer from '@/components/container/loading-container';
import UserForm from '@/components/users/user-form';
import { useState } from 'react';

const DetailChildDataPage = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContainer loading={loading}>
      <UserForm careTakerForm={false} />
    </LoadingContainer>
  );
};

export default DetailChildDataPage;
