import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FileIcon,
  FileTextIcon,
  Filter,
  ImageIcon,
  Plus,
  Search,
} from 'lucide-react';
import { mockDocuments } from '@/data/mockup/document-mockup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface DocumentIconProps {
  type: string | undefined;
}

const DocumentIcon: React.FC<DocumentIconProps> = ({ type }) => {
  switch (type) {
    case 'application/pdf':
      return <FileIcon className='h-4 w-4 text-red-500' />;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <FileTextIcon className='h-4 w-4 text-blue-500' />;
    case 'image/jpeg':
      return <ImageIcon className='h-4 w-4 text-green-500' />;
    default:
      return <FileIcon className='h-4 w-4 text-gray-500' />;
  }
};

const DocumentList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('video');

  return (
    <div className='py-10'>
      <div className='mb-6 space-y-4'>
        <div className='flex space-x-4'>
          <div className='relative flex-grow'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search documents...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Filter className='mr-2 h-4 w-4' />
                  Category
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>Filter Document</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <DropdownMenuRadioItem value='video'>
                    Video
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='pdf'>PDF</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='images'>
                    Images
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> Add Documents
            </Button>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockDocuments.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className='font-medium'>
                <div className='flex items-center space-x-2'>
                  <DocumentIcon type={doc.documentType.type} />
                  <span>{doc.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage
                      src={doc.owner.profile?.profilePicture}
                      alt={doc.owner.profile?.fullName}
                    />
                    <AvatarFallback>
                      {doc.owner.profile
                        ?.fullName!.split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{doc.owner.profile?.fullName}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant='secondary'>{doc.documentType.name}</Badge>
              </TableCell>
              <TableCell>{doc.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>{doc.updatedAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentList;
