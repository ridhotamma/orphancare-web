import React, { useState } from 'react';
import { Edit2, Save, X, Trash2, KeyRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PasswordChangeDialog } from '@/components/users/password-change-dialog';
import { useToast } from '@/hooks/use-toast';

interface DetailCredentialsProps {
  credentials: Credentials;
  setCredentials: React.Dispatch<React.SetStateAction<Credentials>>;
  handleDeleteUser: () => void;
}

type Credentials = {
  id: string;
  email: string;
  username: string;
  active: boolean;
};

export const DetailCredentials: React.FC<DetailCredentialsProps> = ({
  credentials,
  setCredentials,
  handleDeleteUser,
}) => {
  const { toast } = useToast();
  const [isEditCredentials, setIsEditCredentials] = useState(false);
  const [showInactiveAlert, setShowInactiveAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveCredentials = () => {
    setIsEditCredentials(false);
    toast({
      title: 'Credentials updated',
      description: 'Your credentials have been successfully updated.',
    });
  };

  const handleDeleteConfirmation = () => {
    if (deleteConfirmEmail === credentials.email) {
      setShowDeleteAlert(false);
      handleDeleteUser();
    } else {
      toast({
        title: 'Error',
        description: "Email address doesn't match. Deletion cancelled.",
        variant: 'destructive',
      });
    }
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

  const handleActiveChange = (checked: boolean) => {
    if (checked) {
      setShowInactiveAlert(true);
    }

    setCredentials({ ...credentials, active: checked });
  };

  const renderCredentialsForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Credentials</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
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
            onCheckedChange={handleActiveChange}
            disabled={!isEditCredentials}
          />
          <Label htmlFor='active'>Active</Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderUserActions = () => (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>User Actions</CardTitle>
      </CardHeader>
      <CardContent className='flex items-center gap-4 flex-wrap'>
        <Button
          variant={'outline'}
          onClick={() => setIsPasswordModalOpen(true)}
        >
          <KeyRound className='h-4 w-4 mr-2' /> Change Password
        </Button>
        <Button variant={'outline'} onClick={() => setShowDeleteAlert(true)}>
          <Trash2 className='h-4 w-4 mr-2' /> Delete User
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className='container mx-auto px-0 lg:px-20'>
      <div className='flex items-center justify-end mb-6'>
        {isEditCredentials ? (
          <div className='space-x-2'>
            <Button
              variant='outline'
              onClick={() => setIsEditCredentials(false)}
            >
              <X className='h-4 w-4 mr-2' /> Cancel
            </Button>
            <Button onClick={handleSaveCredentials}>
              <Save className='h-4 w-4 mr-2' /> Save
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditCredentials(true)}>
            <Edit2 className='h-4 w-4 mr-2' /> Edit
          </Button>
        )}
      </div>

      <div className='space-y-8'>
        {renderCredentialsForm()}
        {renderUserActions()}
      </div>

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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowInactiveAlert(false);
              }}
            >
              Yes, proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              <div className='space-y-4'>
                <p>
                  Are you sure you want to delete this user? This action cannot
                  be undone. Please type the user&apos;s email address to
                  confirm deletion.
                </p>

                <Input
                  placeholder="Enter user's email address"
                  value={deleteConfirmEmail}
                  onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmation}
              className='bg-red-600 hover:bg-red-700'
            >
              Yes, delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PasswordChangeDialog
        isPasswordModalOpen={isPasswordModalOpen}
        setIsPasswordModalOpen={setIsPasswordModalOpen}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleChangePassword={handleChangePassword}
      />
    </div>
  );
};
