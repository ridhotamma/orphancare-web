import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
}) => {
  const [showInactiveAlert, setShowInactiveAlert] = useState(false);

  const handleSave = () => {
    if (!credentials.active) {
      setShowInactiveAlert(true);
    } else {
      handleSaveCredentials();
    }
  };

  return (
    <>
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
            <div className='flex items-center space-x-2'>
              <Switch
                id='active'
                checked={credentials.active}
                onCheckedChange={(checked) =>
                  setCredentials({ ...credentials, active: checked })
                }
                disabled={!isEditCredentials}
              />
              <Label htmlFor='active'>Active</Label>
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
            <Button
              variant='outline'
              onClick={() => setIsEditCredentials(false)}
            >
              <X className='h-4 w-4 mr-2' /> Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className='h-4 w-4 mr-2' /> Save
            </Button>
          </CardFooter>
        )}
      </Card>

      <AlertDialog open={showInactiveAlert} onOpenChange={setShowInactiveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inactive Account Warning</AlertDialogTitle>
            <AlertDialogDescription>
              You are setting this account to inactive. An inactive user will
              not be able to log in to the app. Are you sure you want to
              proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowInactiveAlert(false);
                handleSaveCredentials();
              }}
            >
              Yes, proceed
            </AlertDialogAction>
            <AlertDialogAction onClick={() => setShowInactiveAlert(false)}>
              Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
