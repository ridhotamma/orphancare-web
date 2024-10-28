'use client';

import UserDetailPage from '@/components/users/user-detail';
import { usePageTitle } from '@/hooks/use-page-title';
import useCurrentUser from '@/stores/current-user';

const MyProfilePage = () => {
  usePageTitle('My Profile');

  const { userDetail } = useCurrentUser();

  return (
    <UserDetailPage
      isCareTaker={userDetail?.profile?.careTaker as boolean}
      userId={userDetail?.id as string}
    />
  );
};

export default MyProfilePage;
