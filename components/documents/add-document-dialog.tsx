import React from 'react';
import { Camera } from 'lucide-react';
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

interface AddDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newDocument: NewDocument;
  setNewDocument: React.Dispatch<React.SetStateAction<NewDocument>>;
  onAddDocument: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

type NewDocument = {
  file: File | null;
  name: string;
  type: string;
};

export const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({
  isOpen,
  onClose,
  newDocument,
  setNewDocument,
  onAddDocument,
  fileInputRef,
  onFileChange,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle className='text-2xl font-semibold'>
          Add New Document
        </DialogTitle>
      </DialogHeader>
      <div className='space-y-6 py-4'>
        <div
          className='w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors'
          onClick={() => fileInputRef.current?.click()}
        >
          {newDocument.file ? (
            <div className='text-center'>
              <p className='text-sm font-medium'>{newDocument.file.name}</p>
              <p className='text-xs text-gray-500 mt-1'>Click to change file</p>
            </div>
          ) : (
            <div className='text-center'>
              <Camera className='mx-auto h-12 w-12 text-gray-400' />
              <p className='mt-2 text-sm text-gray-600'>
                Click to upload a file
              </p>
            </div>
          )}
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
              setNewDocument((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select document type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='pdf'>PDF Document</SelectItem>
              <SelectItem value='image'>Image</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='flex justify-end space-x-2 pt-4'>
        <Button variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onAddDocument}>Add Document</Button>
      </div>
    </DialogContent>
  </Dialog>
);
