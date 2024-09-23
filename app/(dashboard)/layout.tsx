// File: /dashboard/layout.tsx

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, LogOut, Settings2 } from 'lucide-react';
import menuItems from '@/app/constants/menu-map';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const user = {
    name: 'John Doe',
    role: 'Administrator',
    avatarUrl: 'https://randomuser.me/api/portraits/women/90.jpg',
  };

  const currentPageTitle = useMemo(() => {
    const currentMenuItem = menuItems.find((item) => item.href === pathname);
    return currentMenuItem ? currentMenuItem.label : 'Dashboard';
  }, [pathname]);

  return (
    <div className='flex h-screen bg-background'>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden'
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className='flex flex-col h-full'>
          <div className='flex items-center justify-between h-16 px-6'>
            <h1 className='text-2xl font-bold'>Orphancare</h1>
            <button onClick={toggleSidebar} className='lg:hidden'>
              <X className='h-6 w-6' />
            </button>
          </div>
          <nav className='flex-grow mt-8'>
            <ul className='space-y-2 px-6'>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center py-2 px-4 rounded transition-colors duration-200 ${
                      pathname === item.href
                        ? 'bg-blue-700 text-white'
                        : 'text-white hover:bg-blue-600'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className='mr-3 h-5 w-5' />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {/* Profile section */}
          <div className='p-4 bg-blue-600 hover:bg-blue-700 rounded-t-3xl cursor-pointer'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <Image
                  src={user.avatarUrl}
                  alt='User avatar'
                  className='w-10 h-10 rounded-full mr-3'
                  width={40}
                  height={40}
                />
                <div>
                  <p className='font-semibold'>{user.name}</p>
                  <p className='text-sm text-blue-200'>{user.role}</p>
                </div>
              </div>
              <div>
                <Settings2 width={20} height={20} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='bg-white shadow-sm'>
          <div className='flex items-center justify-between h-16 px-6'>
            <div className='flex items-center'>
              <button
                onClick={toggleSidebar}
                className='text-gray-500 focus:outline-none focus:text-gray-700 lg:hidden'
              >
                <Menu className='h-6 w-6' />
              </button>
              <h2 className='text-2xl font-semibold text-text ml-4 lg:ml-0'>
                {currentPageTitle}
              </h2>
            </div>
            {/* Logout button */}
            <button
              onClick={() => {
                /* Add logout logic here */
              }}
              className='flex items-center text-gray-500 hover:text-gray-700'
            >
              <LogOut className='h-5 w-5 mr-1' />
              <span>Logout</span>
            </button>
          </div>
        </header>
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-background'>
          <div className='container mx-auto px-6 py-8'>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
