'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  LogOut,
  Settings2,
  Sun,
  Moon,
  X,
  MoreVertical,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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

// You'll need to create this file with your menu items
import menuItems from '@/constants/menu-map';

type Theme = 'light' | 'dark' | 'system';

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
          <DialogTitle>Choose a theme</DialogTitle>
          <DialogDescription>
            Select your preferred theme option.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a theme' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='light'>
                <div className='flex items-center'>
                  <Sun className='mr-2 h-4 w-4' />
                  Light
                </div>
              </SelectItem>
              <SelectItem value='dark'>
                <div className='flex items-center'>
                  <Moon className='mr-2 h-4 w-4' />
                  Dark
                </div>
              </SelectItem>
              <SelectItem value='system'>
                <div className='flex items-center'>
                  <Sun className='mr-2 h-4 w-4 dark:hidden' />
                  <Moon className='mr-2 h-4 w-4 hidden dark:inline' />
                  System
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme() as {
    theme: Theme | undefined;
    setTheme: (theme: Theme) => void;
  };

  const user = {
    name: 'John Doe',
    role: 'Administrator',
    avatarUrl: 'https://randomuser.me/api/portraits/women/90.jpg',
  };

  const currentPageTitle = useMemo(() => {
    const currentMenuItem = menuItems.find((item) => item.href === pathname);
    return currentMenuItem ? currentMenuItem.title : 'Dashboard';
  }, [pathname]);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const SidebarContent = () => (
    <div className='flex flex-col h-full w-full bg-primary dark:bg-blue-950 text-white'>
      <div className='flex items-center justify-between h-20 px-4'>
        <h1 className='text-2xl font-bold tracking-wider'>Orphancare</h1>
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden text-white'
          onClick={() => setSidebarOpen(false)}
        >
          <X className='h-6 w-6' />
        </Button>
      </div>
      <nav className='flex-grow mt-8'>
        <ul className='space-y-2 px-4'>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-white bg-opacity-20 text-white shadow-md'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className='mr-3 h-5 w-5' />
                <span className='font-medium'>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className='p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-t-3xl mt-auto'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <Avatar className='mr-3'>
              <AvatarImage src={user.avatarUrl} alt='User avatar' />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className='font-semibold text-lg'>{user.name}</p>
              <p className='text-sm text-blue-100'>{user.role}</p>
            </div>
          </div>
          <Button variant='ghost' size='icon' className='text-white'>
            <Settings2 className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar for larger screens */}
      <aside className='hidden lg:block w-64 bg-primary dark:bg-blue-800 text-white shadow-xl'>
        <SidebarContent />
      </aside>

      {/* Custom sidebar for smaller screens */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ease-in-out ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className='absolute inset-0 bg-gray-600 bg-opacity-75'
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div
          className={`absolute inset-y-0 left-0 w-screen transition-transform duration-300 ease-in-out transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='shadow-sm z-10 bg-white dark:bg-slate-900'>
          <div className='flex items-center justify-between h-20 px-6'>
            <div className='flex items-center'>
              <Button
                variant='ghost'
                size='icon'
                className='lg:hidden'
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className='h-6 w-6' />
              </Button>
              <h2 className='text-2xl font-semibold text-text ml-4 lg:ml-0'>
                {currentPageTitle}
              </h2>
            </div>

            {/* Desktop version */}
            <div className='hidden lg:flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setThemeDialogOpen(true)}
              >
                <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                <span className='sr-only'>Toggle theme</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='ghost'
                    className='flex items-center text-gray-600 hover:text-primary transition-colors duration-200 dark:bg-slate-200 dark:hover:bg-slate-400 dark:hover:text-white'
                  >
                    <LogOut className='h-5 w-5 mr-2' />
                    <span className='font-medium'>Logout</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will end your current session. You&apos;ll
                      need to log in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Mobile version */}
            <div className='lg:hidden'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <MoreVertical className='h-5 w-5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setThemeDialogOpen(true)}>
                    <Sun className='h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                    <Moon className='absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                    <span>Theme Settings</span>
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <LogOut className='h-4 w-4 mr-2' />
                        Logout
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to logout?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will end your current session. You&apos;ll
                          need to log in again to access your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>
                          Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-background'>
          <div className='container mx-auto px-6 py-8'>{children}</div>
        </main>
      </div>

      {/* Theme Settings Dialog */}
      <ThemeSettingsDialog
        open={themeDialogOpen}
        onOpenChange={setThemeDialogOpen}
        theme={theme || 'system'}
        setTheme={setTheme}
      />
    </div>
  );
};

export default DashboardLayout;
