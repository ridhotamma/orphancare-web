import React from 'react';
import { Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface AddDocumentDialogProps {
  isAddDocumentDialogOpen: boolean;
  setIsAddDocumentDialogOpen: (value: boolean) => void;
  newDocument: NewDocument;
  setNewDocument: React.Dispatch<React.SetStateAction<NewDocument>>;
  handleAddDocument: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

type NewDocument = {
  file: File | null;
  name: string;
  type: string;
};

export const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({
  isAddDocumentDialogOpen,
  setIsAddDocumentDialogOpen,
  newDocument,
  setNewDocument,
  handleAddDocument,
  fileInputRef,
  handleFileChange,
}) => (
  <Dialog
    open={isAddDocumentDialogOpen}
    onOpenChange={setIsAddDocumentDialogOpen}
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Document</DialogTitle>
      </DialogHeader>
      <div className='space-y-4'>
        <div className='flex flex-col items-center space-y-4'>
          <div
            className='w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer'
            onClick={() => fileInputRef.current?.click()}
          >
            {newDocument.file ? (
              <p>{newDocument.file.name}</p>
            ) : (
              <div className='text-center'>
                <Camera className='mx-auto h-8 w-8 text-gray-400' />
                <p className='mt-1 text-sm text-gray-600'>
                  Click to upload a file
                </p>
              </div>
            )}
          </div>
          <Input
            type='file'
            accept='image/*,.pdf'
            onChange={handleFileChange}
            className='hidden'
            ref={fileInputRef}
          />
        </div>
        <div>
          <Label htmlFor='document-name'>Document Name</Label>
          <Input
            id='document-name'
            value={newDocument.name}
            onChange={(e) =>
              setNewDocument((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor='document-type'>Document Type</Label>
          <Select
            onValueChange={(value) =>
              setNewDocument((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select document type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='pdf'>PDF Document</SelectItem>
              <SelectItem value='image'>Image</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex justify-end space-x-2'>
          <Button
            variant='outline'
            onClick={() => setIsAddDocumentDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleAddDocument}>Submit</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
