/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useRef, useEffect, Dispatch } from 'react';
import {
  File,
  Eye,
  Plus,
  Download,
  MoreVertical,
  Trash2,
  Search,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Document } from '@/types/document';
import { AddDocumentDialog } from '@/components/documents/add-document-dialog';
import { useToast } from '@/hooks/use-toast';
import EmptyContainer from '@/components/container/empty-container';
import EmptyImage from '@/images/not-found-document.png';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import FullscreenDocumentPreview from '@/components/documents/document-preview';
import { requests } from '@/lib/api';
import { DocumentType } from '@/types/document-type';
import LoadingContainer from '@/components/container/loading-container';
import { useDebounce } from '@/hooks/use-debounce';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';

// Fungsi utilitas untuk memeriksa tipe dokumen berdasarkan URL
const getDocumentType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(extension!))
    return 'image';
  if (extension === 'gif') return 'gif';
  if (extension === 'pdf') return 'pdf';
  return 'unknown';
};

// Komponen pratinjau file
const FilePreview: React.FC<{ url: string }> = ({ url }) => {
  const [hasError, setHasError] = React.useState(false);
  const type = getDocumentType(url);

  const FallbackPreview = () => (
    <div className='h-40 w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800'>
      <File className='h-12 w-12 text-gray-400 mb-2' />
      <p className='text-sm text-gray-500 dark:text-gray-400'>
        Pratinjau tidak tersedia
      </p>
    </div>
  );

  if (!url || hasError) {
    return <FallbackPreview />;
  }

  switch (type) {
    case 'image':
    case 'gif':
      return (
        <div className='relative h-40 w-full'>
          <Image
            src={url}
            alt='Pratinjau dokumen'
            fill
            className='object-cover'
            onError={() => setHasError(true)}
          />
        </div>
      );
    default:
      return <FallbackPreview />;
  }
};

type NewDocument = {
  url: string;
  name: string;
  documentTypeId: string;
};

type DetailDocumentsProps = {
  data?: Document[] | null;
  loading: boolean;
  setLoading: Dispatch<React.SetStateAction<boolean>>;
  onSearch: (searchTerm: string) => void;
  onRefresh: () => void;
  userId: string;
};

export const DetailDocuments: React.FC<DetailDocumentsProps> = ({
  data: documents,
  loading,
  setLoading,
  onSearch,
  onRefresh,
  userId,
}: DetailDocumentsProps) => {
  const { toast } = useToast();
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToBeDeleted, setDocumentToBeDeleted] =
    useState<Document | null>(null);
  const [newDocument, setNewDocument] = useState<NewDocument>({
    url: '',
    name: '',
    documentTypeId: '',
  });
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  const handleSearchDocuments = async (value: string) => {
    setSearchQuery(value);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCloseDialog = () => {
    setIsAddDocumentModalOpen(false);
    setNewDocument({
      url: '',
      name: '',
      documentTypeId: '',
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast({
        title: 'Gagal mengunggah file',
        description: 'Periksa izin perangkat Anda untuk melanjutkan',
        variant: 'destructive',
      });
    }

    try {
      setLoadingUpload(true);

      const data = new FormData();
      data.append('file', file!);

      const response = await requests({
        url: '/public/files/upload',
        method: 'POST',
        data,
      });

      if (response.url) {
        setNewDocument((prev) => ({
          ...prev,
          url: response.url,
          name: file?.name as string,
        }));
      }
    } catch (error: any) {
      toast({
        title: 'Terjadi kesalahan',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      setLoadingDelete(true);
      await requests({
        url: `/public/users/documents/${documentToBeDeleted?.id}`,
        method: 'DELETE',
      });
      toast({
        title: 'Berhasil Dihapus',
        description: `${documentToBeDeleted?.name} berhasil dihapus`,
        variant: 'success',
      });
      onRefresh();
    } catch (error: any) {
      toast({
        title: 'Tidak dapat menghapus dokumen',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingDelete(false);
      setSelectedDocument(null);
      setDocumentToBeDeleted(null);
    }
  };

  const handleOpenDeleteDialog = (document: Document) => {
    setDocumentToBeDeleted(document);
    setIsDeleteDialogOpen(true);
  };

  const handleDownloadDocument = (document: Document) => {
    window.location.href = document?.url as string;
  };

  const handleAddDocument = async () => {
    try {
      setLoadingSubmit(true);

      await requests({
        url: `/public/users/${userId}/documents`,
        method: 'POST',
        data: newDocument,
      });

      setIsAddDocumentModalOpen(false);
      setNewDocument({ url: '', name: '', documentTypeId: '' });
      onRefresh();

      toast({
        title: 'Dokumen ditambahkan',
        description:
          'Dokumen baru Anda telah berhasil diunggah dan ditambahkan.',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    const getDocumentTypes = async () => {
      try {
        setLoading(true);
        const data = await requests({
          url: '/admin/document-types',
          method: 'GET',
        });
        setDocumentTypes(data);
      } catch (error: any) {
        toast({
          title: 'Terjadi kesalahan',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    getDocumentTypes();
  }, [setLoading, toast]);

  const debounceSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (debounceSearch) {
      onSearch(searchQuery);
    } else if (!debounceSearch && isMounted) {
      onRefresh();
    }
    setIsMounted(true);
  }, [debounceSearch]);

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'DOCUMENT_PDF':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'DOCUMENT_IMAGE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className='container mx-auto px-0 lg:px-20'>
      <div className='flex justify-between items-center mb-8'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <Input
            type='text'
            placeholder='Cari Dokumen'
            className='pl-10'
            value={searchQuery}
            onChange={(e) => handleSearchDocuments(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setIsAddDocumentModalOpen(true)}
          className='bg-blue-600 hover:bg-blue-700'
        >
          <Plus className='mr-2 h-4 w-4' /> Tambah Dokumen
        </Button>
      </div>
      {documents?.length === 0 ? (
        <EmptyContainer
          image={
            <Image
              src={EmptyImage}
              width={300}
              height={300}
              alt='gambar kosong'
            />
          }
          text="Anda belum menambahkan dokumen apapun. Klik 'Tambah Dokumen' untuk memulai."
        />
      ) : (
        <LoadingContainer loading={loading}>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10'>
            {documents?.map((doc) => (
              <Card
                key={doc.id}
                className='overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col'
              >
                <CardHeader className='p-4 flex flex-col items-center'>
                  <div className='flex items-center justify-center h-40 w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg'>
                    <FilePreview url={doc.url as string} />
                  </div>
                </CardHeader>
                <CardContent className='px-4 flex flex-col items-center flex-grow'>
                  <Badge
                    className={`mb-2 flex-grow-0 ${getTypeBadgeColor(
                      doc.documentType.type!
                    )}`}
                  >
                    {doc.documentType.name}
                  </Badge>
                  <h2 className='flex-grow ext-lg font-semibold text-center mb-2 line-clamp-2'>
                    {doc.name}
                  </h2>
                  <p className='flex-grow-0 text-sm text-gray-600 dark:text-gray-300'>
                    Dibuat: {format(new Date(doc.createdAt), 'PP')}
                  </p>
                </CardContent>
                <CardFooter className='bg-gray-50 dark:bg-gray-800 p-4 flex justify-between'>
                  <Button
                    onClick={() => setSelectedDocument(doc)}
                    variant='outline'
                    size='sm'
                  >
                    <Eye className='mr-2 h-4 w-4' /> Pratinjau
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleDownloadDocument(doc)}
                      >
                        <Download className='mr-2 h-4 w-4' /> Unduh
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenDeleteDialog(doc)}
                      >
                        <Trash2 className='mr-2 h-4 w-4' /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        </LoadingContainer>
      )}
      <AddDocumentDialog
        isOpen={isAddDocumentModalOpen}
        onClose={handleCloseDialog}
        newDocument={newDocument}
        setNewDocument={setNewDocument}
        onAddDocument={handleAddDocument}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        documentTypes={documentTypes}
        loading={loadingUpload}
        submitting={loadingSubmit}
      />

      {/* Dialog Hapus */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus dokumen
              &quot;{documentToBeDeleted?.name}&quot; secara permanen dan
              menghapusnya dari server kami.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingDelete}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loadingDelete}
              onClick={handleDeleteDocument}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedDocument && (
        <FullscreenDocumentPreview
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDelete={() => {
            setDocumentToBeDeleted(selectedDocument);
            handleDeleteDocument();
          }}
        />
      )}
    </div>
  );
};
