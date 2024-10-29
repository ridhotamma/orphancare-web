import React, { useState, useEffect } from 'react';
import { CloudUpload, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DocumentType } from '@/types/document-type';

interface AddDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newDocument: NewDocument;
  setNewDocument: React.Dispatch<React.SetStateAction<NewDocument>>;
  onAddDocument: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  documentTypes: DocumentType[];
  loading: boolean;
  submitting: boolean;
}

type NewDocument = {
  url: string;
  name: string;
  documentTypeId: string;
};

export const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({
  isOpen,
  onClose,
  newDocument,
  setNewDocument,
  onAddDocument,
  fileInputRef,
  onFileChange,
  documentTypes,
  loading,
  submitting
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    if (newDocument.url && fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      setIsImage(file.type.startsWith('image/'));

      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [newDocument.url]);

  const renderPreview = () => {
    if (loading) {
      return <Loader2 className='mr-2 h-10 w-10 animate-spin' />;
    }

    if (!newDocument.url) {
      return (
        <div className='text-center'>
          <CloudUpload className='mx-auto h-12 w-12 text-gray-400' />
          <p className='mt-2 text-sm text-gray-600'>Click to upload a file</p>
        </div>
      );
    }

    if (isImage && previewUrl) {
      return (
        <div className='relative w-full h-full'>
          <img
            src={previewUrl}
            alt='Preview'
            className='absolute inset-0 w-full h-full object-contain'
          />
          <p className='absolute bottom-2 left-0 right-0 text-xs text-gray-500 text-center'>
            Click to change file
          </p>
        </div>
      );
    }

    return (
      <div className='text-center'>
        <FileText className='mx-auto h-12 w-12 text-gray-400' />
        <p className='mt-2 text-sm text-gray-600'>
          {fileInputRef.current?.files?.[0]?.name || 'Document uploaded'}
        </p>
        <p className='text-xs text-gray-500 mt-1'>Click to change file</p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold'>
            Add New Document
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-6 py-4'>
          <div
            className='w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors overflow-hidden'
            onClick={() => fileInputRef.current?.click()}
          >
            {renderPreview()}
          </div>
          <Input
            type='file'
            accept='image/*,.pdf'
            onChange={onFileChange}
            className='hidden'
            ref={fileInputRef}
          />
          <div className='space-y-2'>
            <Label htmlFor='document-name' className='text-sm font-medium'>
              Document Name
            </Label>
            <Input
              id='document-name'
              value={newDocument.name}
              onChange={(e) =>
                setNewDocument((prev) => ({ ...prev, name: e.target.value }))
              }
              className='w-full'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='document-type' className='text-sm font-medium'>
              Document Type
            </Label>
            <Select
              onValueChange={(value) =>
                setNewDocument((prev) => ({ ...prev, documentTypeId: value }))
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select document type' />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex justify-end space-x-2 pt-4'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={submitting} onClick={onAddDocument}>
            Add Document
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentDialog;
