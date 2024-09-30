import { User } from '@/types/user';
import { Document } from '@/types/document';
import { RoleType, Gender } from '@/types/enums';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    password: 'hashed_password',
    username: 'johndoe',
    roles: [RoleType.USER],
    profile: {
      id: '101',
      fullName: 'Bima Arviandi',
      profilePicture: 'https://i.pravatar.cc/150?u=john',
      birthday: new Date('1990-01-15').toLocaleDateString(),
      joinDate: new Date('2023-01-01').toLocaleDateString(),
      bio: 'Enthusiastic developer',
      phoneNumber: '+1234567890',
      gender: Gender.MALE,
    },
    active: true,
    documents: new Set([
      {
        id: 'd1',
        name: 'Resume.pdf',
        url: 'https://example.com/resume.pdf',
      } as Document,
      {
        id: 'd2',
        name: 'Project.doc',
        url: 'https://example.com/project.doc',
      } as Document,
    ]),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-06-15'),
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    password: 'hashed_password',
    username: 'janesmith',
    roles: [RoleType.ADMIN, RoleType.USER],
    profile: {
      id: '102',
      fullName: 'Willie Salim',
      profilePicture: 'https://i.pravatar.cc/150?u=jane',
      birthday: new Date('1988-07-22').toLocaleDateString(),
      joinDate: new Date('2022-11-15').toLocaleDateString(),
      bio: 'Experienced project manager',
      phoneNumber: '+1987654321',
      gender: Gender.FEMALE,
    },
    active: true,
    documents: new Set([
      {
        id: 'd3',
        name: 'Presentation.ppt',
        url: 'https://example.com/presentation.ppt',
      } as Document,
    ]),
    createdAt: new Date('2022-11-15'),
    updatedAt: new Date('2023-05-20'),
  },
  {
    id: '3',
    email: 'alex.johnson@example.com',
    password: 'hashed_password',
    username: 'alexj',
    roles: [RoleType.USER],
    profile: {
      id: '103',
      fullName: 'Syarif Hidayatullah',
      profilePicture: 'https://i.pravatar.cc/150?u=alex',
      birthday: new Date('1995-03-10').toLocaleDateString(),
      joinDate: new Date('2023-03-01').toLocaleDateString(),
      bio: 'Design enthusiast',
      phoneNumber: '+1122334455',
      gender: Gender.OTHER,
    },
    active: false,
    documents: new Set(),
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-04-12'),
  },
  {
    id: '4',
    email: 'emma.wilson@example.com',
    password: 'hashed_password',
    username: 'emmaw',
    roles: [RoleType.USER],
    profile: {
      id: '104',
      fullName: 'Emma Wilson',
      profilePicture: 'https://i.pravatar.cc/150?u=emma',
      birthday: new Date('1992-11-05').toLocaleDateString(),
      joinDate: new Date('2023-02-14').toLocaleDateString(),
      bio: 'Marketing specialist',
      phoneNumber: '+1555666777',
      gender: Gender.FEMALE,
    },
    active: true,
    documents: new Set([
      {
        id: 'd4',
        name: 'Marketing_Plan.pdf',
        url: 'https://example.com/marketing_plan.pdf',
      } as Document,
      {
        id: 'd5',
        name: 'Analytics.xlsx',
        url: 'https://example.com/analytics.xlsx',
      } as Document,
    ]),
    createdAt: new Date('2023-02-14'),
    updatedAt: new Date('2023-06-01'),
  },
  {
    id: '5',
    email: 'mike.brown@example.com',
    password: 'hashed_password',
    username: 'mikeb',
    roles: [RoleType.USER],
    profile: null,
    active: true,
    documents: new Set(),
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2023-05-01'),
  },
];

export default mockUsers;
