import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  X,
  Download,
  ChevronLeft,
  Info,
  Trash2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Document } from '@/types/document';

interface FullscreenDocumentPreviewProps {
  document: Document;
  onClose: () => void;
  onDelete: () => void;
}

const FullscreenDocumentPreview = ({
  document,
  onClose,
  onDelete,
}: FullscreenDocumentPreviewProps) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDownloadErrorDialogOpen, setIsDownloadErrorDialogOpen] =
    useState(false);
  const [downloadErrorMessage, setDownloadErrorMessage] = useState('');
  const [isDownloadSuccessDialogOpen, setIsDownloadSuccessDialogOpen] =
    useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const renderDocumentPreview = () => {
    switch (document.documentType.type) {
      case 'application/pdf':
        return (
          <iframe
            src={document.url}
            title={document.name}
            className='w-full h-full border-0'
          />
        );
      case 'image/jpeg':
      case 'image/png':
        return (
          <div className='relative w-full h-full'>
            <Image
              src={document.url!}
              alt={document.name!}
              className='object-contain rounded-lg'
              fill={true}
            />
          </div>
        );
      default:
        return (
          <div className='flex flex-col items-center justify-center h-full'>
            <FileIcon className='h-24 w-24 text-gray-400' />
            <p className='mt-4 text-lg text-gray-600'>Preview not available</p>
          </div>
        );
    }
  };

  const getDocumentIcon = () => {
    switch (document.documentType.type) {
      case 'application/pdf':
        return <FileTextIcon className='h-6 min-w-6 text-red-500' />;
      case 'image/jpeg':
      case 'image/png':
        return <ImageIcon className='h-6 min-w-6 text-green-500' />;
      default:
        return <FileIcon className='h-6 min-w-6 text-gray-500' />;
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(false);
    onDelete();
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsDownloadSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error downloading file:', error);
      setDownloadErrorMessage(
        'Failed to download the file. Please try again later.'
      );
      setIsDownloadErrorDialogOpen(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
      <div className='relative bg-white dark:bg-gray-900 w-full h-full flex flex-col md:flex-row rounded-lg overflow-hidden shadow-2xl'>
        {/* Close Preview Button */}
        {!isInfoVisible && (
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='absolute top-4 right-4 z-20 bg-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full'
          >
            <X className='h-6 w-6' />
          </Button>
        )}

        {/* Document Preview */}
        <div
          className={`relative flex-1 p-4 md:p-6 overflow-auto ${
            isInfoVisible ? 'hidden md:block' : 'block'
          }`}
        >
          {renderDocumentPreview()}
        </div>

        {/* Info Toggle Button (visible on mobile and tablet) */}
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden absolute bottom-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-full shadow-md'
          onClick={() => setIsInfoVisible(!isInfoVisible)}
        >
          {isInfoVisible ? (
            <ChevronLeft className='h-6 w-6' />
          ) : (
            <Info className='h-6 w-6' />
          )}
        </Button>

        {/* Document Info */}
        <div
          className={`absolute inset-0 md:relative md:w-1/3 bg-white dark:bg-gray-900 border-t md:border-l border-gray-200 dark:border-gray-700 overflow-y-auto transition-all duration-300 ease-in-out ${
            isInfoVisible
              ? 'translate-x-0'
              : 'translate-x-full md:translate-x-0'
          }`}
        >
          <div className='sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 md:p-6 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                {getDocumentIcon()}
                <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                  {document.name}
                </h2>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsInfoVisible(false)}
                className='md:hidden hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full'
              >
                <X className='h-6 w-6' />
              </Button>
            </div>
            <Badge variant='secondary' className='mt-2'>
              {document.documentType.name}
            </Badge>
          </div>

          <div className='p-4 md:p-6 space-y-6'>
            <div>
              <h3 className='font-semibold mb-3 text-gray-700 dark:text-gray-300'>
                Owner
              </h3>
              <div className='flex items-center space-x-3'>
                <Avatar className='h-10 w-10 md:h-12 md:w-12'>
                  <AvatarImage
                    src={document?.owner?.profile?.profilePicture}
                    alt={document?.owner?.profile?.fullName}
                  />
                  <AvatarFallback className='text-base md:text-lg'>
                    {document?.owner?.profile?.fullName ??
                      ''
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium text-gray-900 dark:text-gray-100'>
                    {document?.owner?.profile?.fullName}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {document?.owner?.email}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h3 className='font-semibold mb-1 text-gray-700 dark:text-gray-300'>
                  Created
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {format(new Date(document.createdAt), 'PPpp')}
                </p>
              </div>
              <div>
                <h3 className='font-semibold mb-1 text-gray-700 dark:text-gray-300'>
                  Updated
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {format(new Date(document.updatedAt), 'PPpp')}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2 flex-wrap md:flex-nowrap'>
              <Button
                variant='outline'
                className='w-full'
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Download className='mr-2 h-4 w-4' />
                )}
                Download
              </Button>
              <Button
                variant='destructive'
                className='w-full'
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className='mr-2 h-4 w-4' /> Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              document &quot;{document.name}&quot; and remove it from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDownloadErrorDialogOpen}
        onOpenChange={setIsDownloadErrorDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <AlertCircle className='h-5 w-5 text-red-500' />
              Download Error
            </AlertDialogTitle>
            <AlertDialogDescription>
              {downloadErrorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setIsDownloadErrorDialogOpen(false)}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDownloadSuccessDialogOpen}
        onOpenChange={setIsDownloadSuccessDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <Download className='h-5 w-5 text-green-500' />
              Download Successful
            </AlertDialogTitle>
            <AlertDialogDescription>
              The file &quot;{document.name}&quot; has been successfully
              downloaded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setIsDownloadSuccessDialogOpen(false)}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FullscreenDocumentPreview;
