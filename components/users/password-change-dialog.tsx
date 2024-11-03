import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasswordChangeDialogProps {
  isPasswordModalOpen: boolean;
  setIsPasswordModalOpen: (value: boolean) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  handleChangePassword: () => void;
  isLoading: boolean;
}

export const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({
  isPasswordModalOpen,
  setIsPasswordModalOpen,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleChangePassword,
  isLoading,
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password harus minimal 8 karakter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password harus mengandung minimal satu huruf kapital');
    }
    if (!/\d/.test(password)) {
      errors.push('Password harus mengandung minimal satu angka');
    }

    return errors;
  };

  const handleSubmit = () => {
    const validationErrors = validatePassword(newPassword);

    if (newPassword !== confirmPassword) {
      validationErrors.push('Password tidak cocok');
    }

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      handleChangePassword();
    }
  };

  return (
    <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ganti Password</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='new-password'>Password Baru</Label>
            <Input
              id='new-password'
              type='password'
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors([]);
              }}
              className={errors.length > 0 ? 'border-red-500' : ''}
            />
          </div>
          <div>
            <Label htmlFor='confirm-password'>Konfirmasi Password Baru</Label>
            <Input
              id='confirm-password'
              type='password'
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors([]);
              }}
              className={errors.length > 0 ? 'border-red-500' : ''}
            />
          </div>

          {errors.length > 0 && (
            <Alert variant='destructive'>
              <AlertDescription>
                <ul className='list-disc pl-4'>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !newPassword || !confirmPassword}
            className='w-full'
          >
            Ganti Password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
