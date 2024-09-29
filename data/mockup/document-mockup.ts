import { Document } from '@/types/document';

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Project Proposal Lorem Ipsum Doler Sit Amet',
    url: 'https://example.com/project-proposal.pdf',
    owner: {
      id: 'user1',
      email: 'john@example.com',
      profile: {
        fullName: 'John Doe',
        profilePicture: 'https://i.pravatar.cc/150?u=user5',
      },
    },
    documentType: {
      id: 'pdf',
      name: 'PDF',
      type: 'application/pdf',
    },
    createdAt: new Date('2024-09-20T10:00:00Z').toLocaleDateString(),
    updatedAt: new Date('2024-09-21T14:30:00Z').toLocaleDateString(),
  },
  {
    id: '2',
    name: 'Meeting Notes Lorem Ipsum Doler Sit Amet',
    url: 'https://example.com/meeting-notes.docx',
    owner: {
      id: 'user2',
      email: 'jane@example.com',
      profile: {
        fullName: 'John Doe',
        profilePicture: 'https://i.pravatar.cc/150?u=user5',
      },
    },
    documentType: {
      id: 'docx',
      name: 'Word Document',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    createdAt: new Date('2024-09-22T09:15:00Z').toLocaleDateString(),
    updatedAt: new Date('2024-09-22T09:15:00Z').toLocaleDateString(),
  },
  {
    id: '3',
    name: 'Product Image Lorem Ipsum Doler Sit Amet',
    url: 'https://example.com/product-image.jpg',
    owner: {
      id: 'user3',
      email: 'alice@example.com',
      profile: {
        fullName: 'John Doe',
        profilePicture: 'https://i.pravatar.cc/150?u=user5',
      },
    },
    documentType: {
      id: 'jpg',
      name: 'JPEG Image',
      type: 'image/jpeg',
    },
    createdAt: new Date('2024-09-23T11:45:00Z').toLocaleDateString(),
    updatedAt: new Date('2024-09-24T08:20:00Z').toLocaleDateString(),
  },
];
