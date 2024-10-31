/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LucideIcon,
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Bed,
  Package,
  CalendarDays,
  Gift,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  title: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'orphan-children',
    label: 'Children',
    title: 'Children Data',
    href: '/users/children',
    icon: Users,
  },
  {
    id: 'caretakers',
    label: 'Caretakers',
    title: 'Caretakers Data',
    href: '/users/caretakers',
    icon: UserCog,
  },
  {
    id: 'documents',
    label: 'Documents',
    title: 'Manage Document',
    href: '/documents',
    icon: FileText,
  },
  {
    id: 'bedrooms',
    label: 'Bed Rooms',
    title: 'Bed Room Data',
    href: '/bedrooms',
    icon: Bed,
  },
  // {
  //   id: 'inventories',
  //   label: 'Inventories',
  //   title: 'Manage Inventories',
  //   href: '/inventories',
  //   icon: Package,
  // },
  // {
  //   id: 'events',
  //   label: 'Events',
  //   title: 'Events',
  //   href: '/events',
  //   icon: CalendarDays,
  // },
  // {
  //   id: 'donations',
  //   label: 'Donations',
  //   title: 'Donations',
  //   href: '/donations',
  //   icon: Gift,
  // },
];

export default menuItems;
