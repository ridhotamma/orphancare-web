import React from 'react';
import { File, Eye, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Document } from '@/types/document';

type Documents = {
  data: Document[];
  meta: {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

interface DetailDocumentsProps {
  documents: Documents;
  setIsAddDocumentModalOpen: (value: boolean) => void;
}

export const DetailDocuments: React.FC<DetailDocumentsProps> = ({
  documents,
  setIsAddDocumentModalOpen,
}) => (
  <div>
    <div className='flex justify-between items-center mb-4'>
      <h2 className='text-2xl font-bold'>Documents</h2>
      <Button onClick={() => setIsAddDocumentModalOpen(true)}>
        <Upload className='mr-2 h-4 w-4' /> Add Document
      </Button>
    </div>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {documents.data.map((doc) => (
        <Card key={doc.id}>
          <CardHeader>
            <CardTitle>{doc.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <File className='h-16 w-16 mx-auto mb-2' />
            <p>Type: {doc.documentType.name}</p>
            <p>Created: {format(new Date(doc.createdAt), 'PP')}</p>
          </CardContent>
          <CardFooter>
            <Button className='w-full'>
              <Eye className='mr-2 h-4 w-4' /> Preview
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);
