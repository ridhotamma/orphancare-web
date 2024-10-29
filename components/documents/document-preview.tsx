import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  FileSpreadsheetIcon,
  FileTypeIcon,
  X,
  ChevronLeft,
  Info,
  Trash2,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
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

const getFileTypeFromUrl = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'avif':
      return `image/${extension}`;
    case 'xls':
    case 'xlsx':
      return 'application/vnd.ms-excel';
    case 'doc':
    case 'docx':
      return 'application/msword';
    default:
      return 'unknown';
  }
};

const FallbackPreview: React.FC<{
  icon: React.ReactNode;
  message: string;
  subMessage?: string;
}> = ({ icon, message, subMessage }) => (
  <div className='flex flex-col items-center justify-center h-full p-6 text-center'>
    <div className='mb-4 text-gray-400'>{icon}</div>
    <p className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-2'>
      {message}
    </p>
    {subMessage && (
      <p className='text-sm text-gray-500 dark:text-gray-400'>{subMessage}</p>
    )}
  </div>
);

const FullscreenDocumentPreview: React.FC<FullscreenDocumentPreviewProps> = ({
  document,
  onClose,
  onDelete,
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [fileType, setFileType] = useState<string>('unknown');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setFileType(getFileTypeFromUrl(document.url as string));
    setHasError(false);
  }, [document.url]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(document.url as string);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  const renderDocumentPreview = () => {
    if (!document.url || hasError) {
      return (
        <FallbackPreview
          icon={<FileIcon className='h-24 w-24' />}
          message='Preview not available'
          subMessage='The document could not be loaded'
        />
      );
    }

    switch (fileType) {
      case 'image/gif':
        return (
          <div className='relative w-full h-full'>
            <Image
              src={document.url}
              alt={document.name as string}
              className='object-contain rounded-lg'
              fill={true}
              onError={() => setHasError(true)}
            />
          </div>
        );
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
      case 'image/bmp':
      case 'image/webp':
      case 'image/avif':
        return (
          <div className='relative w-full h-full'>
            <Image
              src={document.url as string}
              alt={document.name as string}
              className='object-contain rounded-lg'
              fill={true}
              onError={() => setHasError(true)}
            />
          </div>
        );
      case 'application/pdf':
        return (
          <div
            className='smallpdf-widget h-full w-full'
            data-pdf-url={document.url}
          ></div>
        );
      case 'application/vnd.ms-excel':
        return (
          <FallbackPreview
            icon={<FileSpreadsheetIcon className='h-24 w-24' />}
            message='Excel document preview not available'
            subMessage='Please download the file to view its contents'
          />
        );
      case 'application/msword':
        return (
          <FallbackPreview
            icon={<FileTypeIcon className='h-24 w-24' />}
            message='Word document preview not available'
            subMessage='Please download the file to view its contents'
          />
        );
      default:
        return (
          <FallbackPreview
            icon={<FileIcon className='h-24 w-24' />}
            message='Preview not available'
            subMessage='This file type is not supported for preview'
          />
        );
    }
  };

  const getDocumentIcon = () => {
    switch (fileType) {
      case 'image/gif':
      case 'image/jpeg':
      case 'image/png':
      case 'image/bmp':
      case 'image/webp':
        return <ImageIcon className='h-6 min-w-6 text-green-500' />;
      case 'application/pdf':
        return <FileTextIcon className='h-6 min-w-6 text-red-500' />;
      case 'application/vnd.ms-excel':
        return <FileSpreadsheetIcon className='h-6 min-w-6 text-green-700' />;
      case 'application/msword':
        return <FileTypeIcon className='h-6 min-w-6 text-blue-600' />;
      default:
        return <FileIcon className='h-6 min-w-6 text-gray-500' />;
    }
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
      <div className='relative bg-white dark:bg-gray-900 w-full h-full flex flex-col md:flex-row rounded-lg overflow-hidden shadow-2xl'>
        {/* Document Preview Header */}
        <div className='absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 z-20 p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {getDocumentIcon()}
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 truncate'>
              {document.name}
            </h2>
            <Badge variant='secondary'>{document.documentType.name}</Badge>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full'
          >
            <X className='h-6 w-6' />
          </Button>
        </div>

        {/* Document Preview */}
        <div
          className={`relative flex-1 pt-20 md:pt-24 p-4 md:p-6 overflow-auto ${
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
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                Document Details
              </h3>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsInfoVisible(false)}
                className='md:hidden hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full'
              >
                <X className='h-6 w-6' />
              </Button>
            </div>
          </div>

          <div className='p-4 md:p-6 space-y-6'>
            <div>
              <h3 className='font-semibold mb-3 text-gray-700 dark:text-gray-300'>
                Owner
              </h3>
              <div className='flex items-center space-x-3'>
                <Avatar className='h-10 w-10 md:h-12 md:w-12'>
                  <AvatarImage
                    src={document?.owner?.profilePicture}
                    alt={document?.owner?.fullName}
                  />
                  <AvatarFallback className='text-base md:text-lg'>
                    {document.owner?.fullName?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium text-gray-900 dark:text-gray-100'>
                    {document?.owner?.fullName}
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
                  {format(new Date(document.createdAt), 'PPpp')}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2 flex-wrap md:flex-nowrap'>
              <Button
                variant='outline'
                className='w-full'
                onClick={handleShare}
              >
                <Share2 className='mr-2 h-4 w-4' />
                Share document
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

      {/* Share Dialog */}
      <AlertDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <Share2 className='h-5 w-5 text-blue-500' />
              Share Document
            </AlertDialogTitle>
            <AlertDialogDescription>
              Copy the link below to share this document
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex items-center space-x-2 my-4'>
            <div className='relative flex-1'>
              <Input value={document.url} readOnly className='pr-10' />
              <Button
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-full'
                onClick={handleCopyUrl}
              >
                {isCopied ? (
                  <Check className='h-4 w-4 text-green-500' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
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
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FullscreenDocumentPreview;
