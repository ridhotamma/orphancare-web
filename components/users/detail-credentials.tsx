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

type Credentials = {
  id: string;
  email: string;
  username: string;
  active: boolean;
  isAdmin: boolean;
};

export const DetailCredentials: React.FC = () => {
  const { toast } = useToast();
  const [isEditCredentials, setIsEditCredentials] = useState(false);
  const [showInactiveAlert, setShowInactiveAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credentials, setCredentials] = useState<Credentials>({
    id: '9f993f52-2835-4d27-97a5-2a39101ef727',
    email: 'fahrulroji@gmail.com',
    username: 'kakoji',
    active: true,
    isAdmin: false,
  });

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
    if (!checked) {
      setShowInactiveAlert(true);
    } else {
      setCredentials({ ...credentials, active: checked });
    }
  };

  const handleAdminChange = (checked: boolean) => {
    setCredentials({ ...credentials, isAdmin: checked });
  };

  const handleDeleteUser = () => {
    console.log('delete user');
    // Implement user deletion logic here
    toast({
      title: 'User deleted',
      description: 'The user has been successfully deleted.',
    });
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
        <div className='space-y-4'>
          <div className='flex items-center space-x-4 rounded-md border border-gray-200 dark:border-gray-800 p-4'>
            <Switch
              id='active'
              checked={credentials.active}
              onCheckedChange={handleActiveChange}
              disabled={!isEditCredentials}
            />
            <div>
              <Label htmlFor='active'>Active</Label>
              <p className='text-xs text-gray-500'>
                When active, the user can log in and access the system.
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-4 rounded-md border border-gray-200 dark:border-gray-800 p-4'>
            <Switch
              id='admin'
              checked={credentials.isAdmin}
              onCheckedChange={handleAdminChange}
              disabled={!isEditCredentials}
            />
            <div>
              <Label htmlFor='admin'>Admin</Label>
              <p className='text-xs text-gray-500'>
                Admins have full access to all features and can manage other
                users.
              </p>
            </div>
          </div>
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
                setCredentials({ ...credentials, active: false });
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
