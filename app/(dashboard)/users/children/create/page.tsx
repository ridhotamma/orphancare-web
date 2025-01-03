'use client';

import UserForm from '@/components/users/user-form';
import { usePageTitle } from '@/hooks/use-page-title';

const AddChildDataPage = () => {
  usePageTitle('Tambah Data Anak Asuh');

  return <UserForm careTakerForm={false} editMode={false} />;
};

export default AddChildDataPage;
