import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PasswordChangeDialogProps {
  isPasswordModalOpen: boolean;
  setIsPasswordModalOpen: (value: boolean) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  handleChangePassword: () => void;
}

export const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({
  isPasswordModalOpen,
  setIsPasswordModalOpen,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleChangePassword,
}) => (
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