import React, { useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
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

interface FullscreenDocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullScreenAddDocumentDialog = ({
  isOpen,
  onClose,
}: FullscreenDocumentPreviewProps) => {
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setImage(e.target?.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setFileName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, documentType, image });
    onClose();
  };

  const handleBeforeClose = () => {
    setName('');
    setFileName('');
    setImage(null);
    setDocumentType('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[800px] h-[600px] flex flex-col p-0'>
        <div className='flex h-full'>
          {/* Left side - Image preview */}
          <div className='w-1/2 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-6 relative'>
            {image ? (
              <div className='relative w-full h-full flex items-center justify-center'>
                <Image
                  src={image}
                  alt='Document preview'
                  className='max-w-full max-h-full object-contain'
                  layout='fill'
                />
              </div>
            ) : (
              <div className='text-center'>
                <Upload className='mx-auto h-12 w-12 text-gray-400' />
                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                  Upload an image to preview
                </p>
              </div>
            )}
            {image && (
              <Button
                variant='destructive'
                className='absolute bottom-6 left-6 right-6'
                onClick={handleRemoveImage}
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
                    <SelectItem value='video'>Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='image'>Upload Image</Label>
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
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageUpload}
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

export default FullScreenAddDocumentDialog;
