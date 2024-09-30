import React, { useState } from 'react';
import { Trash2, Upload, FileText } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

interface HorizontalAddDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const HorizontalAddDocumentDialog = ({
  isOpen,
  onClose,
}: HorizontalAddDocumentDialogProps) => {
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);

      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName('');
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, documentType, file });
    onClose();
  };

  const handleBeforeClose = () => {
    setName('');
    setFileName('');
    setFile(null);
    setPreview(null);
    setDocumentType('');
    onClose();
  };

  const renderPreview = () => {
    if (preview) {
      return (
        <div className='relative w-full h-full flex items-center justify-center'>
          <Image
            src={preview}
            alt='Document preview'
            className='max-w-full max-h-full object-contain'
            layout='fill'
          />
        </div>
      );
    } else if (file) {
      return (
        <div className='flex flex-col items-center justify-center'>
          <FileText className='h-24 w-24 text-gray-400' />
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            {file.name}
          </p>
        </div>
      );
    } else {
      return (
        <div className='text-center'>
          <Upload className='mx-auto h-12 w-12 text-gray-400' />
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            Upload a document to preview
          </p>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[800px] h-[600px] flex flex-col p-0'>
        <div className='flex h-full'>
          {/* Left side - File preview */}
          <div className='w-1/2 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-6 relative'>
            {renderPreview()}
            {file && (
              <Button
                variant='destructive'
                className='absolute bottom-6 left-6 right-6'
                onClick={handleRemoveFile}
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Remove
              </Button>
            )}
          </div>

          {/* Right side - Form */}
          <div className='w-1/2 p-6 flex flex-col'>
            <h2 className='text-2xl font-bold mb-6'>Add New Document</h2>
            <form onSubmit={handleSubmit} className='space-y-6 flex-grow'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Document Name</Label>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Enter document name'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='documentType'>Document Type</Label>
                <Select
                  value={documentType}
                  onValueChange={setDocumentType}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select document type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='pdf'>PDF</SelectItem>
                    <SelectItem value='image'>Image</SelectItem>
                    <SelectItem value='document'>Document</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='file'>Upload File</Label>
                <div className='flex items-center space-x-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() =>
                      document.getElementById('file-upload')?.click()
                    }
                  >
                    Choose file
                  </Button>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {fileName || 'No file chosen'}
                  </span>
                  <input
                    id='file-upload'
                    name='file-upload'
                    type='file'
                    accept='.pdf,.doc,.docx,.txt,image/*'
                    className='hidden'
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </form>
            <div className='flex justify-end space-x-4 mt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={handleBeforeClose}
              >
                Cancel
              </Button>
              <Button type='submit' onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HorizontalAddDocumentDialog;
