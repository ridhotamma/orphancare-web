import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MenuItem } from '@/constants/menu-map';
import { User } from '@/types/user';

interface SidebarProps {
  menuItems: MenuItem[];
  user: Partial<User>;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, user, onClose }) => {
  const pathname = usePathname();

  return (
    <div className='flex flex-col h-full w-full bg-primary dark:bg-blue-950 text-white'>
      <div className='flex items-center justify-between h-20 px-4'>
        <h1 className='text-2xl font-bold tracking-wider'>Orphancare</h1>
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden text-white'
          onClick={onClose}
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
                  pathname.includes(item.href)
                    ? 'bg-white bg-opacity-20 text-white shadow-md'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={onClose}
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
              <AvatarImage
                src={user.profile?.profilePicture}
                alt='User avatar'
              />
              <AvatarFallback>
                {user.profile?.fullName!.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='font-semibold text-lg'>{user.profile?.fullName}</p>
              <p className='text-sm text-blue-100'>Administrator</p>
            </div>
          </div>
          <Button variant='ghost' size='icon' className='text-white'>
            <Settings2 className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
