'use client';

import React from 'react';
import { Menu, LogOut, Sun, Moon, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Theme } from '@/types/themes';

interface HeaderProps {
  currentPageTitle: string;
  theme: Theme;
  setTheme: (value: string) => void;
  onOpenSidebar: () => void;
  onOpenThemeDialog: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentPageTitle,
  theme,
  setTheme,
  onOpenSidebar,
  onOpenThemeDialog,
  onLogout,
}) => {
  return (
    <header className='shadow-sm z-10 bg-white dark:bg-slate-900'>
      <div className='flex items-center justify-between h-20 px-6'>
        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden'
            onClick={onOpenSidebar}
          >
            <Menu className='h-6 w-6' />
          </Button>
          <h2 className='text-2xl font-semibold text-text ml-4 lg:ml-0 line-clamp-1'>
            {currentPageTitle}
          </h2>
        </div>

        {/* Versi Desktop */}
        <div className='hidden lg:flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                <span className='sr-only'>Ganti tema</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuLabel>Pengaturan Tema</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value='light'>
                  Terang
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='dark'>
                  Gelap
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='system'>
                  Sistem
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='ghost'
                className='flex items-center text-gray-600 hover:text-primary transition-colors duration-200 dark:bg-slate-200 dark:hover:bg-slate-400 dark:hover:text-white'
              >
                <LogOut className='h-5 w-5 mr-2' />
                <span className='font-medium'>Keluar</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah Anda yakin ingin keluar?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini akan mengakhiri sesi Anda saat ini. Anda perlu
                  masuk kembali untuk mengakses akun Anda.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={onLogout}>Keluar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Versi Mobile */}
        <div className='lg:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreVertical className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Pilihan</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onOpenThemeDialog}>
                <Sun className='h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                <Moon className='absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                <span>Pengaturan Tema</span>
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <LogOut className='h-4 w-4 mr-2' />
                    Keluar
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Apakah Anda yakin ingin keluar?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini akan mengakhiri sesi Anda saat ini. Anda
                      perlu masuk kembali untuk mengakses akun Anda.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={onLogout}>
                      Keluar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
