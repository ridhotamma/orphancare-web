import { usePageTitle } from '@/hooks/use-page-title';
import { Gender } from '@/types/enums';
import { useState } from 'react';
import TabLayout, { TabItem } from '@/components/layout/tab-layout';
import { File, User, UserCircle } from 'lucide-react';
import { DetailDocuments } from '@/components/users/detail-documents';
import { DetailProfile } from '@/components/users/detail-profile';
import { DetailCredentials } from '@/components/users/detail-credentials';
import React from 'react';
import { Profile } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';

type Credentials = {
  id: string;
  email: string;
  username: string;
  active: boolean;
};

const UserDetailPage: React.FC = () => {
  usePageTitle('User Details');
  const { toast } = useToast();

  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);

  const [credentials, setCredentials] = useState<Credentials>({
    id: '9f993f52-2835-4d27-97a5-2a39101ef727',
    email: 'fahrulroji@gmail.com',
    username: 'kakoji',
    active: true,
  });

  const [profile, setProfile] = useState<Profile>({
    id: '52ecb46a-860c-42e0-aa75-a5e77b50b5c2',
    profilePicture: '',
    birthday: '',
    joinDate: '',
    leaveDate: '',
    bio: '',
    fullName: 'Agung Raksasa',
    address: {
      id: '',
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
      street: '',
      urbanVillage: '',
      subdistrict: '',
      city: '',
      province: '',
      postalCode: '',
    },
    bedRoom: {
      id: '4dd52fdf-9a0e-4615-8aa3-f15be49f54ea',
      name: 'FATIMAH',
      createdAt: new Date(),
      updatedAt: new Date(),
      bedRoomType: {
        id: '52ecb46a-860c-42e0-aa75-a5e77b50b5c1',
        name: 'Kamar Pengasuh Perempuan',
        type: 'BEDROOM_CARETAKER_FEMALE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    guardian: {
      id: '43027a4d-26a5-4ede-a841-c4ec9c4f5baa',
      fullName: 'Gatot Kaca',
      phoneNumber: '',
      address: {
        street: '',
        urbanVillage: '',
        subdistrict: '',
        city: '',
        province: '',
        postalCode: '',
      },
    },
    phoneNumber: '+62123123123',
    gender: Gender.MALE,
    careTaker: true,
  });

  const [documents, setDocuments] = useState<any>({
    data: [],
    meta: {
      currentPage: 0,
      perPage: 10,
      total: 4,
      totalPages: 1,
    },
  });

  const handleSaveProfile = () => {
    setIsEditProfile(false);
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated.',
    });
  };

  const handleDeleteUser = () => {
    console.log('delete');
    // Implement user deletion logic here
  };

  const tabItems: TabItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <DetailProfile
          profile={profile}
          isEditProfile={isEditProfile}
          setIsEditProfile={setIsEditProfile}
          setProfile={setProfile}
          handleSaveProfile={handleSaveProfile}
        />
      ),
      icon: <UserCircle className='h-5 w-5' />,
    },
    {
      id: 'documents',
      label: 'Documents',
      content: (
        <DetailDocuments documents={documents} setDocuments={setDocuments} />
      ),
      icon: <File className='h-5 w-5' />,
    },
    {
      id: 'credentials',
      label: 'Credentials',
      content: (
        <DetailCredentials
          credentials={credentials}
          setCredentials={setCredentials}
          handleDeleteUser={handleDeleteUser}
        />
      ),
      icon: <User className='h-5 w-5' />,
    },
  ];

  return <TabLayout tabs={tabItems} defaultTab='profile' urlParamName='tab' />;
};

export default UserDetailPage;
