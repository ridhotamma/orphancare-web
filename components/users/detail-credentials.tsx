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
import { Credentials, User } from '@/types/user';
import { RoleType } from '@/types/enums';
import { requests } from '@/lib/api';
import { useRouter } from 'next/navigation';

type DetailCredentialsProps = {
  data: Omit<User, 'profile'>;
  isCareTaker: boolean;
  onRefresh: () => void;
};

export const DetailCredentials: React.FC<DetailCredentialsProps> = ({
  data,
  isCareTaker,
  onRefresh,
}: DetailCredentialsProps) => {
  const { toast } = useToast();
  const [isEditCredentials, setIsEditCredentials] = useState(false);
  const [showInactiveAlert, setShowInactiveAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [credentials, setCredentials] = useState<
    Credentials & Omit<User, 'profile'>
  >({
    ...data,
    isAdmin: data?.roles?.includes(RoleType.ADMIN),
  } as Credentials & Omit<User, 'profile'>);

  const router = useRouter();

  const handleSaveCredentials = async () => {
    if (credentials?.superUser) {
      toast({
        title: 'Tidak Dapat Mengedit Super User',
        description: 'Hubungi Administrator untuk edit kredensial',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoadingAction(true);
      const roles = [RoleType.USER];
      if (credentials.isAdmin) {
        roles.push(RoleType.ADMIN);
      }
      await requests({
        url: `/admin/users/${credentials?.id}`,
        method: 'PUT',
        data: { ...credentials, roles },
      });
      setIsEditCredentials(false);
      toast({
        title: 'Kredensial diperbarui',
        description: 'Kredensial Anda telah berhasil diperbarui.',
        variant: 'success',
      });
      onRefresh();
    } catch (error: any) {
      const errorMessage =
        error.message ||
        Object.entries(error)
          .map((entry) => {
            const [key, value] = entry;
            const message = `${key}: ${value}`;
            return message;
          })
          .join(', ');

      toast({
        title: 'Terjadi kesalahan',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteConfirmation = () => {
    if (deleteConfirmEmail === credentials.email) {
      setShowDeleteAlert(false);
      handleDeleteUser();
    } else {
      toast({
        title: 'Terjadi Kesalahan',
        description: 'Alamat email tidak cocok. Penghapusan dibatalkan.',
        variant: 'destructive',
      });
    }
  };

  const handleChangePassword = async () => {
    if (credentials?.superUser) {
      toast({
        title: 'Tidak Dapat Mengubah Password Super User',
        description: 'Hubungi administrator untuk mengubah password',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoadingAction(true);
      await requests({
        url: `/admin/users/change-password`,
        method: 'PUT',
        data: {
          userId: credentials?.id,
          newPassword: newPassword,
        },
      });
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: 'Password diubah',
        description: 'Password Anda telah berhasil diubah.',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Terjadi kesalahan',
        description: error?.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingAction(false);
    }
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

  const handleDeleteUser = async () => {
    if (credentials?.superUser) {
      toast({
        title: 'Tidak Dapat Menghapus Super User',
        description: 'Hubungi Administrator untuk hapus akun',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoadingAction(true);
      await requests({
        url: `/admin/users/${credentials?.id}`,
        method: 'DELETE',
      });
      toast({
        title: 'Pengguna dihapus',
        description: 'Pengguna telah berhasil dihapus.',
        variant: 'success',
      });
      router.push(isCareTaker ? '/users/caretakers' : '/users/children');
    } catch (error: any) {
      toast({
        title: 'Terjadi kesalahan',
        description: error?.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const renderCredentialsForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Kredensial</CardTitle>
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
          <Label htmlFor='username'>Nama Pengguna</Label>
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
              <Label htmlFor='active'>Aktif</Label>
              <p className='text-xs text-gray-500'>
                Saat aktif, pengguna dapat masuk dan mengakses sistem.
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
                Admin memiliki akses penuh ke semua fitur dan dapat mengelola
                pengguna lain.
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
        <CardTitle className='text-xl'>Aksi Pengguna</CardTitle>
      </CardHeader>
      <CardContent className='flex items-center gap-4 flex-wrap'>
        <Button
          variant={'outline'}
          onClick={() => setIsPasswordModalOpen(true)}
        >
          <KeyRound className='h-4 w-4 mr-2' /> Ubah Password
        </Button>
        <Button variant={'outline'} onClick={() => setShowDeleteAlert(true)}>
          <Trash2 className='h-4 w-4 mr-2' /> Hapus Pengguna
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
              disabled={loadingAction}
            >
              <X className='h-4 w-4 mr-2' /> Batal
            </Button>
            <Button onClick={handleSaveCredentials} disabled={loadingAction}>
              <Save className='h-4 w-4 mr-2' /> Simpan
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
            <AlertDialogTitle>Peringatan Akun Tidak Aktif</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan mengatur akun ini menjadi tidak aktif. Pengguna yang
              tidak aktif tidak akan dapat masuk ke aplikasi. Apakah Anda yakin
              ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setCredentials({ ...credentials, active: false });
                setShowInactiveAlert(false);
              }}
            >
              Ya, lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              <div className='space-y-4'>
                <p>
                  Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini
                  tidak dapat dibatalkan. Silakan ketik alamat email pengguna
                  untuk mengkonfirmasi penghapusan.
                </p>
                <p>
                  <b>{credentials.email}</b>
                </p>
                <Input
                  placeholder='Masukkan alamat email pengguna'
                  value={deleteConfirmEmail}
                  onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmation}
              className='bg-red-600 hover:bg-red-700'
              disabled={
                deleteConfirmEmail !== credentials.email || loadingAction
              }
            >
              Ya, hapus pengguna
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
        isLoading={loadingAction}
      />
    </div>
  );
};
