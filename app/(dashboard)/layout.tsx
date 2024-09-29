'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Theme } from '@/types/themes';
import { User } from '@/types/user';
import ThemeSettingsDialog from '@/components/shared/theme-settings-dialog';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import menuItems from '@/constants/menu-map';
import cookieStorage from '@/lib/storage/cookies';
import { HeaderProvider, useHeader } from '@/provider/header-provider';
import { AuthProvider } from '@/provider/auth-provider';
import { UnauthorizedDialog } from '@/components/shared/unauthorized-dialog';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayoutContent: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);

  const { theme, setTheme } = useTheme() as {
    theme: Theme | undefined;
    setTheme: (value: string) => void;
  };

  const { headerTitle } = useHeader();

  const user: Partial<User> = {
    profile: {
      fullName: 'John Doe',
      profilePicture: 'https://randomuser.me/api/portraits/women/90.jpg',
    },
  };

  const router = useRouter();

  const handleLogout = () => {
    cookieStorage.removeItem('authToken');
    router.push('/auth/login');
  };

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar for larger screens */}
      <aside className='hidden lg:block w-64 bg-primary dark:bg-blue-800 text-white shadow-xl'>
        <Sidebar
          menuItems={menuItems}
          user={user}
          onClose={() => setSidebarOpen(false)}
        />
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
          <Sidebar
            menuItems={menuItems}
            user={user}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header
          currentPageTitle={headerTitle}
          theme={theme as Theme}
          setTheme={setTheme}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenThemeDialog={() => setThemeDialogOpen(true)}
          onLogout={handleLogout}
        />
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-background'>
          <div className='container mx-auto px-6 py-8'>{children}</div>
        </main>
      </div>

      {/* Unauthorized Dialog */}
      <UnauthorizedDialog />
      
      {/* Theme Settings Dialog */}
      <ThemeSettingsDialog
        open={themeDialogOpen}
        onOpenChange={setThemeDialogOpen}
        theme={(theme as Theme) || 'system'}
        setTheme={setTheme as (theme: Theme) => void}
      />
    </div>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <HeaderProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </HeaderProvider>
    </AuthProvider>
  );
};

export default DashboardLayout;
