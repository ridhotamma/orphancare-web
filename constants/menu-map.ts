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
    label: 'Anak Asuh',
    title: 'Data Anak Asuh',
    href: '/users/children',
    icon: Users,
  },
  {
    id: 'caretakers',
    label: 'Pengasuh',
    title: 'Data Pengasuh',
    href: '/users/caretakers',
    icon: UserCog,
  },
  {
    id: 'documents',
    label: 'Dokumen',
    title: 'Kelola Dokumen',
    href: '/documents',
    icon: FileText,
  },
  {
    id: 'bedrooms',
    label: 'Kamar Tidur',
    title: 'Data Kamar Tidur',
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
  {
    id: 'events',
    label: 'Events',
    title: 'Events',
    href: '/events',
    icon: CalendarDays,
  },
  {
    id: 'donations',
    label: 'Donations',
    title: 'Donations',
    href: '/donations',
    icon: Gift,
  },
];

export default menuItems;
