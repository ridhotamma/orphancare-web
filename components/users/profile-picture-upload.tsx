'use client';

import React, { useState, useRef } from 'react';
import { TabItem } from '@/components/layout/tab-layout';
import TabLayout from '@/components/layout/tab-layout';
import { usePageTitle } from '@/hooks/use-page-title';
import {
  User,
  UserCircle,
  File,
  Edit2,
  Save,
  Eye,
  X,
  Camera,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Define types
type Credentials = {
  id: string;
  email: string;
  username: string;
  active: boolean;
};

type Address = {
  street: string | null;
  urbanVillage: string | null;
  subdistrict: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
};

type BedRoomType = {
  id: string;
  name: string;
  type: string;
};

type BedRoom = {
  id: string;
  name: string;
  bedRoomTypeId: string;
  bedRoomType: BedRoomType;
};

type Profile = {
  profilePicture: string | null;
  birthday: string | null;
  joinDate: string | null;
  leaveDate: string | null;
  bio: string | null;
  fullName: string;
  address: Address;
  bedRoomId: string;
  bedRoom: BedRoom;
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE';
  careTaker: boolean;
};

type DocumentType = {
  id: string;
  name: string;
  type: string;
  mandatory: boolean;
};

type Document = {
  id: string;
  name: string;
  url: string;
  documentType: DocumentType;
  createdAt: string;
};

type Documents = {
  data: Document[];
  meta: {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [credentials, setCredentials] = useState<Credentials>({
    id: '9f993f52-2835-4d27-97a5-2a39101ef727',
    email: 'fahrulroji@gmail.com',
    username: 'kakoji',
    active: true,
  });

  const [profile, setProfile] = useState<Profile>({
    profilePicture: null,
    birthday: null,
    joinDate: null,
    leaveDate: null,
    bio: null,
    fullName: 'Agung Raksasa',
    address: {
      street: null,
      urbanVillage: null,
      subdistrict: null,
      city: null,
      province: null,
      postalCode: null,
    },
    bedRoomId: '4dd52fdf-9a0e-4615-8aa3-f15be49f54ea',
    bedRoom: {
      id: '4dd52fdf-9a0e-4615-8aa3-f15be49f54ea',
      name: 'FATIMAH',
      bedRoomTypeId: '52ecb46a-860c-42e0-aa75-a5e77b50b5c1',
      bedRoomType: {
        id: '52ecb46a-860c-42e0-aa75-a5e77b50b5c1',
        name: 'Kamar Pengasuh Perempuan',
        type: 'BEDROOM_CARETAKER_FEMALE',
      },
    },
    phoneNumber: '+62123123123',
    gender: 'MALE',
    careTaker: true,
  });

  const [documents, setDocuments] = useState<Documents>({
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
        createdAt: '2024-07-04T22:13:21.762154',
      },
      // ... other documents
    ],
    meta: {
      currentPage: 0,
      perPage: 10,
      total: 4,
      totalPages: 1,
    },
  });

  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState<boolean>(false);
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

  const handleAddDocument = () => {
    // Implement document addition logic here
    console.log('Adding document:', newDocument);
    // After adding, close the modal and reset the form
    setIsAddDocumentModalOpen(false);
    setNewDocument({ file: null, name: '', type: '' });
    toast({
      title: 'Document added',
      description:
        'Your new document has been successfully uploaded and added.',
    });
  };

  const PasswordChangeModal: React.FC = () => (
    <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='new-password'>New Password</Label>
            <Input
              id='new-password'
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='confirm-password'>Confirm New Password</Label>
            <Input
              id='confirm-password'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const AddDocumentModal: React.FC = () => (
    <Dialog
      open={isAddDocumentModalOpen}
      onOpenChange={setIsAddDocumentModalOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='flex flex-col items-center space-y-4'>
            <div
              className='w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer'
              onClick={() => fileInputRef.current?.click()}
            >
              {newDocument.file ? (
                <p>{newDocument.file.name}</p>
              ) : (
                <div className='text-center'>
                  <Camera className='mx-auto h-8 w-8 text-gray-400' />
                  <p className='mt-1 text-sm text-gray-600'>
                    Click to upload a file
                  </p>
                </div>
              )}
            </div>
            <Input
              type='file'
              accept='image/*,.pdf'
              onChange={handleFileChange}
              className='hidden'
              ref={fileInputRef}
            />
          </div>
          <div>
            <Label htmlFor='document-name'>Document Name</Label>
            <Input
              id='document-name'
              value={newDocument.name}
              onChange={(e) =>
                setNewDocument((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor='document-type'>Document Type</Label>
            <Select
              onValueChange={(value) =>
                setNewDocument((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select document type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='pdf'>PDF Document</SelectItem>
                <SelectItem value='image'>Image</SelectItem>
                {/* Add more document types as needed */}
              </SelectContent>
            </Select>
          </div>
          <div className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              onClick={() => setIsAddDocumentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddDocument}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const CredentialsTab: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          Credentials
          {!isEditCredentials && (
            <Button onClick={() => setIsEditCredentials(true)}>
              <Edit2 className='h-4 w-4 mr-2' /> Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              disabled={!isEditCredentials}
            />
          </div>
          <div>
            <Label htmlFor='username'>Username</Label>
            <Input
              id='username'
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              disabled={!isEditCredentials}
            />
          </div>
          <div>
            <Label>Active</Label>
            <p>{credentials.active ? 'Yes' : 'No'}</p>
          </div>
          {!isEditCredentials && (
            <Button onClick={() => setIsPasswordModalOpen(true)}>
              Change Password
            </Button>
          )}
        </div>
      </CardContent>
      {isEditCredentials && (
        <CardFooter className='justify-end space-x-2'>
          <Button variant='outline' onClick={() => setIsEditCredentials(false)}>
            <X className='h-4 w-4 mr-2' /> Cancel
          </Button>
          <Button onClick={handleSaveCredentials}>
            <Save className='h-4 w-4 mr-2' /> Save
          </Button>
        </CardFooter>
      )}
      <PasswordChangeModal />
    </Card>
  );

  const ProfileTab: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          Profile
          {!isEditProfile && (
            <Button onClick={() => setIsEditProfile(true)}>
              <Edit2 className='h-4 w-4 mr-2' /> Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='fullName'>Full Name</Label>
            <Input
              id='fullName'
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
              disabled={!isEditProfile}
            />
          </div>
          <div>
            <Label htmlFor='phoneNumber'>Phone Number</Label>
            <Input
              id='phoneNumber'
              value={profile.phoneNumber}
              onChange={(e) =>
                setProfile({ ...profile, phoneNumber: e.target.value })
              }
              disabled={!isEditProfile}
            />
          </div>
          <div>
            <Label>Gender</Label>
            <p>{profile.gender}</p>
          </div>
          <div>
            <Label>Bedroom</Label>
            <p>{profile.bedRoom.name}</p>
          </div>
        </div>
      </CardContent>
      {isEditProfile && (
        <CardFooter className='justify-end space-x-2'>
          <Button variant='outline' onClick={() => setIsEditProfile(false)}>
            <X className='h-4 w-4 mr-2' /> Cancel
          </Button>
          <Button onClick={handleSaveProfile}>
            <Save className='h-4 w-4 mr-2' /> Save
          </Button>
        </CardFooter>
      )}
    </Card>
  );
const DocumentsTab: React.FC = () => (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Documents</h2>
        <Button onClick={() => setIsAddDocumentModalOpen(true)}>
          <Upload className='mr-2 h-4 w-4' /> Add Document
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {documents.data.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle>{doc.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <File className='h-16 w-16 mx-auto mb-2' />
              <p>Type: {doc.documentType.name}</p>
              <p>Created: {format(new Date(doc.createdAt), 'PP')}</p>
            </CardContent>
            <CardFooter>
              <Button className='w-full'>
                <Eye className='mr-2 h-4 w-4' /> Preview
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <AddDocumentModal />
    </div>
  );

  const tabItems: TabItem[] = [
    {
      id: 'credentials',
      label: 'Credentials',
      content: <CredentialsTab />,
      icon: <User className='h-5 w-5' />,
    },
    {
      id: 'profile',
      label: 'Profile',
      content: <ProfileTab />,
      icon: <UserCircle className='h-5 w-5' />,
    },
    {
      id: 'documents',
      label: 'Documents',
      content: <DocumentsTab />,
      icon: <File className='h-5 w-5' />,
    },
  ];

  return (
    <TabLayout tabs={tabItems} defaultTab='credentials' urlParamName='tab' />
  );
};

export default UserDetailPage;