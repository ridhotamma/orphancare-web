import {
  LucideIcon,
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Bed,
  Package,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'orphan-children',
    label: 'Orphan Children',
    href: '/users/children',
    icon: Users,
  },
  {
    id: 'caretakers',
    label: 'Care Takers',
    href: '/users/caretakers',
    icon: UserCog,
  },
  { id: 'documents', label: 'Documents', href: '/documents', icon: FileText },
  { id: 'bedrooms', label: 'Bedrooms', href: '/bedrooms', icon: Bed },
  {
    id: 'inventories',
    label: 'Inventories',
    href: '/inventories',
    icon: Package,
  },
];

export default menuItems;
