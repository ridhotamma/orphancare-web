import React, { useState, useRef } from 'react';
import { File, Eye, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Document } from '@/types/document';
import { AddDocumentDialog } from '@/components/users/add-document-dialog';
import { useToast } from '@/hooks/use-toast';
import EmptyContainer from '@/components/container/empty-container';
import EmptyImage from '@/images/not-found-document.png';
import Image from 'next/image';

type Documents = {
  data: Document[];
  meta: {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

type NewDocument = {
  file: File | null;
  name: string;
  type: string;
};

export const DetailDocuments: React.FC = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Documents>({
    data: [],
    meta: {
      currentPage: 0,
      perPage: 10,
      total: 4,
      totalPages: 1,
    },
  });
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<NewDocument>({
    file: null,
    name: '',
    type: '',
  });
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
      const url = '';

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
      };

      setDocuments((prevDocs) => ({
        ...prevDocs,
        data: [newDoc, ...prevDocs.data],
        meta: {
          ...prevDocs.meta,
          total: prevDocs.meta.total + 1,
        },
      }));

      setIsAddDocumentModalOpen(false);
      setNewDocument({ file: null, name: '', type: '' });

      toast({
        title: 'Document added',
        description: 'Your new document has been successfully uploaded and added.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='container mx-auto px-0 lg:px-20'>
      <div className='flex justify-end items-center mb-8'>
        <Button
          onClick={() => setIsAddDocumentModalOpen(true)}
          className='bg-blue-600 hover:bg-blue-700'
        >
          <Plus className='mr-2 h-4 w-4' /> Add Document
        </Button>
      </div>
      {documents.data.length === 0 ? (
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
          {documents.data.map((doc) => (
            <Card
              key={doc.id}
              className='overflow-hidden transition-all duration-300 hover:shadow-lg'
            >
              <CardHeader className='bg-gray-100 dark:bg-gray-800 p-4'>
                <CardTitle className='text-lg font-semibold truncate'>
                  {doc.name}
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4'>
                <div className='flex items-center justify-center h-32 bg-gray-200 dark:bg-gray-800 rounded-md mb-4'>
                  <File className='h-16 w-16 text-gray-400 dark:text-white' />
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-50 mb-1'>
                  Type: {doc.documentType.name}
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-50'>
                  Created: {format(new Date(doc.createdAt), 'PP')}
                </p>
              </CardContent>
              <CardFooter className='bg-gray-50 dark:bg-gray-800 p-4'>
                <Button variant={'secondary'} className='w-full'>
                  <Eye className='mr-2 h-4 w-4' /> Preview
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <AddDocumentDialog
        isAddDocumentDialogOpen={isAddDocumentModalOpen}
        setIsAddDocumentDialogOpen={setIsAddDocumentModalOpen}
        newDocument={newDocument}
        setNewDocument={setNewDocument}
        handleAddDocument={handleAddDocument}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
      />
    </div>
  );
};