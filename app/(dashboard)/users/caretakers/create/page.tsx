'use client'

import UserForm from '@/components/users/user-form';
import { usePageTitle } from '@/hooks/use-page-title';

const AddChildDataPage = () => {
  usePageTitle('Add Caretaker Data');

  return <UserForm careTakerForm={true} editMode={false} />;
};

export default AddChildDataPage;
