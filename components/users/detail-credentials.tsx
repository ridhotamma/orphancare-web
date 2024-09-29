import React from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DetailCredentialsProps {
  credentials: Credentials;
  isEditCredentials: boolean;
  setIsEditCredentials: (value: boolean) => void;
  setCredentials: React.Dispatch<React.SetStateAction<Credentials>>;
  handleSaveCredentials: () => void;
  setIsPasswordModalOpen: (value: boolean) => void;
}

type Credentials = {
  id: string;
  email: string;
  username: string;
  active: boolean;
};

export const DetailCredentials: React.FC<DetailCredentialsProps> = ({
  credentials,
  isEditCredentials,
  setIsEditCredentials,
  setCredentials,
  handleSaveCredentials,
  setIsPasswordModalOpen,
}) => (
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
  </Card>
);