import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { Gender } from '@/types/enums';
import { useRef, useState } from 'react';
import { AddDocumentDialog } from '@/components/users/add-document-dialog';
import { PasswordChangeDialog } from '@/components/users/password-change-dialog';
import TabLayout, { TabItem } from '@/components/layout/tab-layout';
import { Document } from '@/types/document';
import { File, User, UserCircle } from 'lucide-react';
import { DetailDocuments } from '@/components/users/detail-documents';
import { DetailProfile } from '@/components/users/detail-profile';
import { DetailCredentials } from '@/components/users/detail-credentials';
import React from 'react';
import { Profile } from '@/types/profile';

type Credentials = {
  id: string;
  email: string;
  username: string;
  active: boolean;
};

type NewDocument = {
  file: File | null;
  name: string;
  type: string;
};

const UserDetailPage: React.FC = () => {
  usePageTitle('User Details');
  const { toast } = useToast();

  const [isEditCredentials, setIsEditCredentials] = useState<boolean>(false);
  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

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
    data: [
      {
        id: '091619a0-1d63-4cc8-8542-98e5dd334599',
        name: 'AKTA KELAHIRAN',
        url: 'https://akagami-documents.nos.wjv-1.neo.id/a658c962-687a-43a1-baf9-07df57335054-profile-picture.jpeg',
        documentType: {
          id: 'df96c60d-59c2-4ed0-bc41-c2f31522485a',
          name: 'PDF Document',
          type: 'DOCUMENT_PDF',
          mandatory: false,
        },
        createdAt: new Date(),
      },
    ],
    meta: {
      currentPage: 0,
      perPage: 10,
      total: 4,
      totalPages: 1,
    },
  });

  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] =
    useState<boolean>(false);
  const [newDocument, setNewDocument] = useState<NewDocument>({
    file: null,
    name: '',
    type: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveCredentials = () => {
    // Implement save logic here
    setIsEditCredentials(false);
    toast({
      title: 'Credentials updated',
      description: 'Your credentials have been successfully updated.',
    });
  };

  const handleSaveProfile = () => {
    // Implement save logic here
    setIsEditProfile(false);
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated.',
    });
  };

  const handleChangePassword = () => {
    // Implement password change logic here
    setIsPasswordModalOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    toast({
      title: 'Password changed',
      description: 'Your password has been successfully changed.',
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewDocument((prev) => ({ ...prev, file }));
    }
  };

  const handleAddDocument = async () => {
    if (!newDocument.file || !newDocument.name || !newDocument.type) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields and select a file.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const url = '';

      const newDoc: Partial<Document> = {
        id: `doc-${Date.now()}`,
        name: newDocument.name,
        url: url,
        documentType: {
          id: `type-${Date.now()}`,
          name: newDocument.type === 'pdf' ? 'PDF Document' : 'Image',
          type: newDocument.type === 'pdf' ? 'DOCUMENT_PDF' : 'DOCUMENT_IMAGE',
          mandatory: false,
        },
        createdAt: new Date(),
      };

      // Update the documents state
      setDocuments((prevDocs: any) => ({
        ...prevDocs,
        data: [newDoc, ...prevDocs.data],
        meta: {
          ...prevDocs.meta,
          total: prevDocs.meta.total + 1,
        },
      }));

      // Close the modal and reset the form
      setIsAddDocumentModalOpen(false);
      setNewDocument({ file: null, name: '', type: '' });

      toast({
        title: 'Document added',
        description:
          'Your new document has been successfully uploaded and added.',
      });
    } catch (error: any) {
      toast({
        title: error.message,
        description:
          'There was an error adding the document. Please try again.',
        variant: 'destructive',
      });
    }
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
        <DetailDocuments
          documents={documents}
          setIsAddDocumentModalOpen={setIsAddDocumentModalOpen}
        />
      ),
      icon: <File className='h-5 w-5' />,
    },
    {
      id: 'credentials',
      label: 'Credentials',
      content: (
        <DetailCredentials
          credentials={credentials}
          isEditCredentials={isEditCredentials}
          setIsEditCredentials={setIsEditCredentials}
          setCredentials={setCredentials}
          handleSaveCredentials={handleSaveCredentials}
          setIsPasswordModalOpen={setIsPasswordModalOpen}
        />
      ),
      icon: <User className='h-5 w-5' />,
    },
  ];

  return (
    <>
      <TabLayout tabs={tabItems} defaultTab='profile' urlParamName='tab' />
      <AddDocumentDialog
        isAddDocumentDialogOpen={isAddDocumentModalOpen}
        setIsAddDocumentDialogOpen={setIsAddDocumentModalOpen}
        newDocument={newDocument}
        setNewDocument={setNewDocument}
        handleAddDocument={handleAddDocument}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
      />
      <PasswordChangeDialog
        isPasswordModalOpen={isPasswordModalOpen}
        setIsPasswordModalOpen={setIsPasswordModalOpen}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleChangePassword={handleChangePassword}
      />
    </>
  );
};

export default UserDetailPage;
