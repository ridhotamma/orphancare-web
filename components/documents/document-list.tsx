/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  Plus,
  Search,
  Eye,
  Settings,
} from 'lucide-react';
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
import HorizontalAddDocumentDialog from './horizontal-add-dialog';
import { Document } from '@/types/document';

const getFileTypeFromUrl = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'avif':
      return `image/${extension}`;
    case 'xls':
    case 'xlsx':
      return 'application/vnd.ms-excel';
    case 'doc':
    case 'docx':
      return 'application/msword';
    default:
      return 'unknown';
  }
};

const DocumentIcon = ({ url }: { url: string }) => {
  const type = getFileTypeFromUrl(url);
  switch (type) {
    case 'application/pdf':
      return <FileTextIcon className='h-6 w-6 text-red-500' />;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <FileTextIcon className='h-6 w-6 text-blue-500' />;
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
    case 'image/webp':
    case 'image/avif':
      return <ImageIcon className='h-6 w-6 text-green-500' />;
    default:
      return <FileIcon className='h-6 w-6 text-gray-500 dark:text-gray-200' />;
  }
};

type DocumentListProps = {
  documents: Document[];
  metaData: Record<string, any>;
};

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  metaData,
}: DocumentListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
                  <Settings className='mr-2 h-4 w-4' />
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

      {/* Documents Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className='group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]'
            onClick={() => setSelectedDocument(doc)}
          >
            <CardHeader className='flex flex-row items-center gap-4 pb-2'>
              <DocumentIcon url={doc?.url as string} />
              <div className='flex-1 min-w-0'>
                <h3 className='font-medium text-sm line-clamp-1'>{doc.name}</h3>
                <p className='text-xs text-muted-foreground'>
                  {format(doc.createdAt, 'MMM d, yyyy')}
                </p>
              </div>
            </CardHeader>

            <CardContent className='pt-0'>
              <div className='flex items-center gap-2 mb-3'>
                <Avatar className='h-6 w-6'>
                  <AvatarImage
                    src={doc.owner?.profilePicture}
                    alt={doc.owner?.fullName}
                  />
                  <AvatarFallback className='text-xs'>
                    {doc.owner?.fullName?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className='text-xs text-muted-foreground truncate'>
                  {doc.owner?.fullName}
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <Badge variant='secondary' className='text-xs'>
                  {doc.documentType.name}
                </Badge>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <Eye className='h-4 w-4' />
                </Button>
              </div>
            </CardContent>
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

      <HorizontalAddDocumentDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
};

export default DocumentList;
