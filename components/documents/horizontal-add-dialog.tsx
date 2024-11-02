import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Trash2, Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import { DocumentType } from '@/types/document-type';
import { User } from '@/types/user';
import AutocompleteSelect from '@/components/ui/autocomplete-select';
import AutocompleteSearch from '@/components/ui/autocomplete-search';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HorizontalAddDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type SelectItem = {
  value: string;
  label: string;
};

type DocumentPayload = {
  url: string;
  name: string;
  documentTypeId: string;
};

const HorizontalAddDocumentDialog = ({
  isOpen,
  onClose,
  onSuccess
}: HorizontalAddDocumentDialogProps) => {
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<SelectItem | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<SelectItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [documentPayload, setDocumentPayload] =
    useState<DocumentPayload | null>(null);

  const dialogRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const UserAutoComplete = AutocompleteSearch<User>;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoadingUpload(true);
      const selectedFile = e.target.files?.[0];
      const data = new FormData();

      data.append('file', selectedFile as File);

      if (selectedFile) {
        const response = await requests({
          url: '/public/files/upload',
          method: 'POST',
          data,
        });

        setFile(selectedFile as File);
        setDocumentPayload(
          (prev) => ({ ...prev, url: response.url } as DocumentPayload)
        );
      }
    } catch (error: any) {
      toast({
        title: 'Cannot upload document',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleRemoveFile = () => {
    setDocumentPayload((prev) => ({ ...prev, url: '' } as DocumentPayload));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      await requests({
        url: `/public/users/${selectedUser?.id}/documents`,
        method: 'POST',
        data: documentPayload,
      });
      toast({
        title: 'Document added',
        description:
          'Your new document has been successfully uploaded and added.',
        variant: 'success',
      });
      handleBeforeClose();
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Cannot submit document',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleBeforeClose = () => {
    setSelectedDocumentType(null);
    setSelectedUser(null);
    setDocumentPayload(null);
    setFile(null);
    onClose();
  };

  const handleUserSearch = async (searchTerm: string) => {
    try {
      const response = await requests({
        url: '/admin/users',
        method: 'GET',
        params: {
          search: searchTerm,
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.status !== 404) {
        toast({
          title: 'Something went wrong',
          description: error.message,
          variant: 'destructive',
        });
      }
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

  const isImageFile = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  };

  const renderPreview = () => {
    if (loadingUpload) {
      return (
        <div className='flex flex-col items-center justify-center'>
          <Loader2 className='h-12 w-12 animate-spin text-gray-400' />
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            Uploading document...
          </p>
        </div>
      );
    }

    if (documentPayload?.url) {
      if (isImageFile(documentPayload.url)) {
        return (
          <div className='relative w-full h-full flex items-center justify-center'>
            <Image
              src={documentPayload.url}
              alt='Document preview'
              className='max-w-full max-h-full object-contain'
              layout='fill'
            />
          </div>
        );
      }

      return (
        <div className='flex flex-col items-center justify-center'>
          <FileText className='h-12 w-12 text-gray-400' />
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            {file?.name}
          </p>
        </div>
      );
    }

    return (
      <div className='text-center'>
        <Upload className='mx-auto h-12 w-12 text-gray-400' />
        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
          Upload a document to preview
        </p>
      </div>
    );
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
        className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full lg:w-[70%] max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50 overflow-auto'
      >
        <div className='flex flex-col md:flex-row h-full'>
          {/* Left side - File preview */}
          <div className='w-full h-[400px] md:h-[600px] md:w-1/2 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-6 relative'>
            {renderPreview()}
            {documentPayload?.url && !loadingUpload && (
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
                  value={documentPayload?.name}
                  onChange={(e) =>
                    setDocumentPayload(
                      (prev) =>
                        ({ ...prev, name: e.target.value } as DocumentPayload)
                    )
                  }
                  placeholder='Enter document name'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='documentType'>Document Type</Label>
                <AutocompleteSelect
                  items={documentTypes}
                  value={selectedDocumentType}
                  onChange={(item) =>
                    setDocumentPayload(
                      (prev) =>
                        ({
                          ...prev,
                          documentTypeId: item?.value,
                        } as DocumentPayload)
                    )
                  }
                  isLoading={loadingDocumentTypes}
                  searchPlaceholder='Search document type...'
                  placeholder='Select document type'
                  className='w-full'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='user'>Assign User</Label>
                <UserAutoComplete
                  onSearch={handleUserSearch}
                  getId={(user) => user.id}
                  renderValue={(user) => user.profile?.fullName as string}
                  value={selectedUser}
                  onChange={(user) => setSelectedUser(user)}
                  className='w-full'
                  placeholder='Search users'
                  searchPlaceholder='Search users...'
                  emptyMessage='User not found'
                  renderItem={(user) => {
                    return (
                      <div className='flex items-center gap-4'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage
                            src={user.profile?.profilePicture}
                            alt={user.username}
                            className='object-cover'
                          />
                          <AvatarFallback>
                            {user.profile?.fullName?.[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                          <span>{user.profile?.fullName}</span>
                          <span className='text-gray-500 text-xs'>
                            {user.email}
                          </span>
                        </div>
                      </div>
                    );
                  }}
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
                    disabled={loadingUpload}
                  >
                    Choose file
                  </Button>
                  <span className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                    {file?.name || 'No file chosen'}
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
                disabled={loadingSubmit}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                onClick={handleSubmit}
                disabled={
                  loadingSubmit ||
                  !documentPayload?.name ||
                  !documentPayload.documentTypeId ||
                  !documentPayload.url
                }
              >
                {loadingSubmit ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Submitting
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HorizontalAddDocumentDialog;
