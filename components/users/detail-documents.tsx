import React, { useState, useRef } from 'react';
import {
  File,
  Eye,
  Plus,
  Download,
  MoreVertical,
  Trash2,
  Search,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Document } from '@/types/document';
import { AddDocumentDialog } from '@/components/documents/add-document-dialog';
import { useToast } from '@/hooks/use-toast';
import EmptyContainer from '@/components/container/empty-container';
import EmptyImage from '@/images/not-found-document.png';
import Image from 'next/image';
import { mockDocuments } from '@/data/mockup/document-mockup';
import { Input } from '@/components/ui/input';
import FullscreenDocumentPreview from '@/components/documents/document-preview';

// Utility function to check document type based on URL
const getDocumentType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp'].includes(extension!)) return 'image';
  if (extension === 'gif') return 'gif';
  if (extension === 'pdf') return 'pdf';
  return 'unknown';
};

// File preview component
const FilePreview: React.FC<{ url: string }> = ({ url }) => {
  const type = getDocumentType(url);

  if (!url) return <div className='text-center p-4'>Preview not available</div>;

  switch (type) {
    case 'image':
    case 'gif':
      return (
        <Image
          src={url}
          alt='Document preview'
          width={200}
          height={200}
          className='object-cover w-full h-40'
        />
      );
    case 'pdf':
      return (
        <object data={url} type='application/pdf' width='100%' height='160'>
          <p>PDF preview not available</p>
        </object>
      );
    default:
      return <div className='text-center p-4'>Preview not available</div>;
  }
};

type NewDocument = {
  file: File | null;
  name: string;
  type: string;
};

type DetailDocumentsProps = {
  data?: Document[] | null;
};

export const DetailDocuments: React.FC<DetailDocumentsProps> = ({
  data,
}: DetailDocumentsProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newDocument, setNewDocument] = useState<NewDocument>({
    file: null,
    name: '',
    type: '',
  });
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  const handleSearchDocuments = (value: string) => {
    setSearchQuery(value);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewDocument((prev) => ({ ...prev, file }));
    }
  };

  const handleAddDocument = async () => {
    if (!newDocument.file || !newDocument.name || !newDocument.type) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields and select a file.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const url = URL.createObjectURL(newDocument.file);

      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        name: newDocument.name,
        url: url,
        documentType: {
          id: `type-${Date.now()}`,
          name: newDocument.type === 'pdf' ? 'PDF Document' : 'Image',
          type: newDocument.type === 'pdf' ? 'DOCUMENT_PDF' : 'DOCUMENT_IMAGE',
          mandatory: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: {
          id: 'current-user',
          email: 'current@example.com',
          profile: {
            fullName: 'Current User',
            profilePicture: 'https://i.pravatar.cc/150?u=current-user',
          },
        },
      };

      setDocuments((prevDocs) => [newDoc, ...prevDocs]);

      setIsAddDocumentModalOpen(false);
      setNewDocument({ file: null, name: '', type: '' });

      toast({
        title: 'Document added',
        description:
          'Your new document has been successfully uploaded and added.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT_PDF':
        return <File className='h-20 w-20 text-red-500' />;
      case 'DOCUMENT_IMAGE':
        return <File className='h-20 w-20 text-green-500' />;
      default:
        return <File className='h-20 w-20 text-gray-500' />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'DOCUMENT_PDF':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'DOCUMENT_IMAGE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <Input
            type='text'
            placeholder='Search Documents'
            className='pl-10'
            value={searchQuery}
            onChange={(e) => handleSearchDocuments(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setIsAddDocumentModalOpen(true)}
          className='bg-blue-600 hover:bg-blue-700'
        >
          <Plus className='mr-2 h-4 w-4' /> Add Document
        </Button>
      </div>
      {documents.length === 0 ? (
        <EmptyContainer
          image={
            <Image
              src={EmptyImage}
              width={300}
              height={300}
              alt='empty image'
            />
          }
          text="You haven't added any documents yet. Click 'Add Document' to get started."
        />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {documents.map((doc) => (
            <Card
              key={doc.id}
              className='overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col'
            >
              <CardHeader className='p-4 flex flex-col items-center'>
                <div className='flex items-center justify-center h-40 w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg'>
                  <FilePreview url={doc.url as string} />
                </div>
              </CardHeader>
              <CardContent className='px-4 flex flex-col items-center flex-grow'>
                <Badge
                  className={`mb-2 flex-grow-0 ${getTypeBadgeColor(
                    doc.documentType.type!
                  )}`}
                >
                  {doc.documentType.name}
                </Badge>
                <h2 className='flex-grow ext-lg font-semibold text-center mb-2 line-clamp-2'>
                  {doc.name}
                </h2>
                <p className='flex-grow-0 text-sm text-gray-600 dark:text-gray-300'>
                  Created: {format(new Date(doc.createdAt), 'PP')}
                </p>
              </CardContent>
              <CardFooter className='bg-gray-50 dark:bg-gray-800 p-4 flex justify-between'>
                <Button
                  onClick={() => setSelectedDocument(doc)}
                  variant='outline'
                  size='sm'
                >
                  <Eye className='mr-2 h-4 w-4' /> Preview
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm'>
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Download className='mr-2 h-4 w-4' /> Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className='mr-2 h-4 w-4' /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <AddDocumentDialog
        isOpen={isAddDocumentModalOpen}
        onClose={() => setIsAddDocumentModalOpen(false)}
        newDocument={newDocument}
        setNewDocument={setNewDocument}
        onAddDocument={handleAddDocument}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
      />

      {selectedDocument && (
        <FullscreenDocumentPreview
          document={selectedDocument}
          onClose={() => {
            setSelectedDocument(null);
          }}
          onDelete={() => {}}
        />
      )}
    </div>
  );
};
