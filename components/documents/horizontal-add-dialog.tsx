import React, { useEffect, useState } from 'react';
import { Trash2, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import { DocumentType } from '@/types/document-type';
import { User } from '@/types/user';
import AutocompleteSelect from '../ui/autocomplete-select';

interface AbsoluteDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type SelectItem = {
  value: string;
  label: string;
};

const AbsoluteDocumentDialog = ({
  isOpen,
  onClose,
}: AbsoluteDocumentDialogProps) => {
  const [name, setName] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<SelectItem | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [selectedUser, setSelectedUser] = useState<SelectItem | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(false);
  const [userList, setUserList] = useState<SelectItem[]>([]);
  const [documentTypes, setDocumentTypes] = useState<SelectItem[]>([]);

  const dialogRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    console.log({
      name,
      documentType: selectedDocumentType?.value,
      file,
      user: selectedUser?.value,
    });
    onClose();
  };

  const handleBeforeClose = () => {
    setName('');
    setFileName('');
    setFile(null);
    setPreview(null);
    setSelectedDocumentType(null);
    setSelectedUser(null);
    onClose();
  };

  const handleUserSearch = async (searchTerm: string) => {
    try {
      setLoadingUsers(true);
      const response = await requests({
        url: '/admin/users',
        method: 'GET',
        params: {
          search: searchTerm,
        },
      });

      setUserList(
        response.data.map((user: User) => ({
          value: user.id,
          label: user.profile?.fullName,
        }))
      );
    } catch (error: any) {
      if (error.status !== 404) {
        toast({
          title: 'Something went wrong',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      setLoadingDocumentTypes(true);
      const data = await requests({
        url: '/admin/document-types',
        method: 'GET',
      });

      setDocumentTypes(
        data.map((type: DocumentType) => ({
          value: type.id,
          label: type.name,
        }))
      );
    } catch (error: any) {
      toast({
        title: 'Something went wrong',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingDocumentTypes(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDocumentTypes();
      handleUserSearch('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/70 z-40'
        onClick={handleBeforeClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full lg:w-[70%] max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50 overflow-hidden'
      >
        <div className='flex flex-col md:flex-row h-full'>
          {/* Left side - File preview */}
          <div className='w-full h-[400px] md:h-[600px] md:w-1/2 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-6 relative'>
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
          <div className='w-full md:w-1/2 p-6 flex flex-col overflow-y-auto'>
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
                <AutocompleteSelect
                  items={documentTypes}
                  value={selectedDocumentType}
                  onChange={setSelectedDocumentType}
                  isLoading={loadingDocumentTypes}
                  searchPlaceholder='Search document type...'
                  placeholder='Select document type'
                  className='w-full'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='user'>Assign User</Label>
                <AutocompleteSelect
                  items={userList}
                  value={selectedUser}
                  onChange={setSelectedUser}
                  isLoading={loadingUsers}
                  searchPlaceholder='Search user...'
                  placeholder='Select user'
                  className='w-full'
                />
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
                  <span className='text-sm text-gray-500 dark:text-gray-400 truncate'>
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
      </div>
    </>
  );
};

export default AbsoluteDocumentDialog;
