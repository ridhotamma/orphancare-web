import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FileIcon,
  FileTextIcon,
  Filter,
  ImageIcon,
  Plus,
  Search,
  Eye,
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
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import FullscreenDocumentPreview from './document-preview';
import { Document } from '@/types/document';
import FullScreenAddDocumentDialog from './fullscreen-add-dialog';

interface DocumentIconProps {
  type: string | undefined;
}

const DocumentIcon: React.FC<DocumentIconProps> = ({ type }) => {
  switch (type) {
    case 'application/pdf':
      return <FileTextIcon className='h-8 w-8 text-red-500' />;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <FileTextIcon className='h-8 w-8 text-blue-500' />;
    case 'image/jpeg':
      return <ImageIcon className='h-8 w-8 text-green-500' />;
    default:
      return <FileIcon className='h-8 w-8 text-gray-500 dark:text-gray-200' />;
  }
};

const DocumentList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc
      .name!.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterCategory === 'all' ||
      doc.documentType.name!.toLowerCase() === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className='mb-8 space-y-4'>
        <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
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
                <DropdownMenuLabel>Filter Documents</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <DropdownMenuRadioItem value='all'>All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='video'>
                    Video
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='pdf'>PDF</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='image'>
                    Image
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className='mr-2 h-4 w-4' /> Add Documents
            </Button>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {filteredDocuments.map((doc) => (
          <Card
            key={doc.id}
            className='hover:shadow-lg transition-shadow duration-300 flex flex-col'
          >
            <CardHeader className='flex'>
              <DocumentIcon type={doc.documentType.type} />
              <CardTitle className='text-lg font-semibold line-clamp-2 max-w-full'>
                {doc.name}
              </CardTitle>
            </CardHeader>
            <CardContent className='flex-grow flex flex-col items-start justify-end'>
              <div className='flex items-center space-x-2 mb-4'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage
                    src={doc.owner?.profile?.profilePicture}
                    alt={doc.owner?.profile?.fullName}
                  />
                  <AvatarFallback>
                    {doc.owner?.profile
                      ?.fullName!.split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span className='text-sm text-gray-600 dark:text-gray-200'>
                  {doc.owner?.profile?.fullName}
                </span>
              </div>
              <Badge variant='secondary' className='mb-2'>
                {doc.documentType.name}
              </Badge>
              <div className='text-sm text-gray-500 dark:text-gray-200 space-y-1'>
                <p>Created: {format(doc.createdAt, 'dd MMM yyyy HH:mm')}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setSelectedDocument(doc as Document)}
                variant='outline'
                className='w-full'
              >
                <Eye className='mr-2 h-4 w-4' /> View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {selectedDocument && (
        <FullscreenDocumentPreview
          document={selectedDocument}
          onDelete={() => {}}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      <FullScreenAddDocumentDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
};

export default DocumentList;
