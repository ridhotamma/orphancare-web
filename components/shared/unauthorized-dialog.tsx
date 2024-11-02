'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/provider/auth-provider';

export const UnauthorizedDialog: React.FC = () => {
  const { isUnauthorized, setUnauthorized, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AlertDialog open={isUnauthorized} onOpenChange={setUnauthorized}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sesi Berakhir</AlertDialogTitle>
          <AlertDialogDescription>
            Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleLogout}>Keluar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
