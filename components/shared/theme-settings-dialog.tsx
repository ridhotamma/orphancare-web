'use client';

import React from 'react';
import { Sun, Moon, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Theme } from '@/types/themes';

interface ThemeSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSettingsDialog: React.FC<ThemeSettingsDialogProps> = ({
  open,
  onOpenChange,
  theme,
  setTheme,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pilih tema</DialogTitle>
          <DialogDescription>
            Pilih opsi tema yang Anda inginkan.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Pilih tema' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='light'>
                <div className='flex items-center'>
                  <Sun className='mr-2 h-4 w-4' />
                  Terang
                </div>
              </SelectItem>
              <SelectItem value='dark'>
                <div className='flex items-center'>
                  <Moon className='mr-2 h-4 w-4' />
                  Gelap
                </div>
              </SelectItem>
              <SelectItem value='system'>
                <div className='flex items-center'>
                  <MonitorSmartphone className='mr-2 h-4 w-4' />
                  Sistem
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSettingsDialog;
