/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  Plus,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import FullscreenDocumentPreview from './document-preview';
import HorizontalAddDocumentDialog from './horizontal-add-dialog';
import { Document } from '@/types/document';
import { useDebounce } from '@/hooks/use-debounce';
import LoadingContainer from '@/components/container/loading-container';
import EmptyContainer from '@/components/container/empty-container';
import Image from 'next/image';
import NotFoundImage from '@/images/not-found-document.png';
import { User } from '@/types/user';
import { DocumentType } from '@/types/document-type';
import AutocompleteSelect, {
  AutocompleteItem,
} from '@/components/ui/autocomplete-select';

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

const DocumentIcon = ({ url }: { url: string }) => {
  const type = getFileTypeFromUrl(url);
  switch (type) {
    case 'application/pdf':
      return <FileTextIcon className='h-6 w-6 text-red-500' />;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <FileTextIcon className='h-6 w-6 text-blue-500' />;
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
    case 'image/webp':
    case 'image/avif':
      return <ImageIcon className='h-6 w-6 text-green-500' />;
    default:
      return <FileIcon className='h-6 w-6 text-gray-500 dark:text-gray-200' />;
  }
};

type DocumentListProps = {
  documents: Document[];
  paginationMeta: Record<string, any>;
  onSearch: (searchTerm: string, params: Record<string, any>) => void;
  onDelete: (document: Document | null) => void;
  loading: boolean;
  users: User[];
  documentTypes: DocumentType[];
};

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  paginationMeta,
  onSearch,
  onDelete,
  loading,
  users,
  documentTypes,
}: DocumentListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<AutocompleteItem | null>(
    null
  );
  const [filterUser, setFilterUser] = useState<AutocompleteItem | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const debounceSearch = useDebounce(searchQuery, 400);

  const handleRefresh = () => {
    onSearch(debounceSearch, {
      ownerId: filterUser?.value === 'all' ? null : filterUser?.value,
      documentTypeId:
        filterCategory?.value === 'all' ? null : filterCategory?.value,
    });
  };

  useEffect(() => {
    handleRefresh();
  }, [debounceSearch, filterCategory, filterUser]);

  const handlePageChange = (page: number) => {
    setSearchQuery('');
    onSearch('', {
      page: page,
    });
  };

  return (
    <div>
      <div className='mb-8 space-y-4'>
        <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
          <div className='relative flex-grow'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Cari dokumen...'
              className='pl-10 min-w-56'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-4'>
            <AutocompleteSelect
              items={documentTypes as any}
              placeholder='Filter berdasarkan jenis'
              searchPlaceholder='Cari jenis dokumen...'
              onChange={(item: AutocompleteItem | null) =>
                setFilterCategory(item)
              }
              value={filterCategory}
              className='w-56'
            />
            <AutocompleteSelect
              items={users as any}
              placeholder='Filter berdasarkan pengguna'
              searchPlaceholder='Cari pengguna...'
              onChange={(item: AutocompleteItem | null) => setFilterUser(item)}
              value={filterUser}
              className='w-56'
            />
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className='mr-2 h-4 w-4' /> Tambah Dokumen
            </Button>
          </div>
        </div>
      </div>

      <LoadingContainer loading={loading}>
        {/* Grid Dokumen */}
        {documents.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className='group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]'
                onClick={() => setSelectedDocument(doc)}
              >
                <CardHeader className='flex flex-row items-center gap-4 pb-2'>
                  <DocumentIcon url={doc?.url as string} />
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-medium text-sm line-clamp-1'>
                      {doc.name}
                    </h3>
                    <p className='text-xs text-muted-foreground'>
                      {format(doc.createdAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className='pt-0'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Avatar className='h-6 w-6'>
                      <AvatarImage
                        src={doc.owner?.profilePicture}
                        alt={doc.owner?.fullName}
                        className='object-cover'
                      />
                      <AvatarFallback className='text-xs'>
                        {doc.owner?.fullName?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-xs text-muted-foreground truncate'>
                      {doc.owner?.fullName}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <Badge variant='secondary' className='text-xs'>
                      {doc.documentType.name}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyContainer
            image={
              <Image
                width={300}
                height={300}
                src={NotFoundImage}
                alt='dokumen tidak ditemukan'
              />
            }
            text='Dokumen tidak ditemukan'
          />
        )}

        {documents.length > 0 && (
          <div className='flex items-center justify-between px-2 py-4'>
            <div className='text-sm text-muted-foreground'>
              Menampilkan{' '}
              {paginationMeta.currentPage * paginationMeta.perPage + 1} sampai{' '}
              {Math.min(
                (paginationMeta.currentPage + 1) * paginationMeta.perPage,
                paginationMeta.total
              )}{' '}
              dari {paginationMeta.total} entri
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(0)}
                disabled={paginationMeta.currentPage === 0}
              >
                <ChevronsLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(paginationMeta.currentPage - 1)}
                disabled={paginationMeta.currentPage === 0}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <span className='text-sm'>
                Halaman {paginationMeta.currentPage + 1} dari{' '}
                {paginationMeta.totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(paginationMeta.currentPage + 1)}
                disabled={
                  paginationMeta.currentPage === paginationMeta.totalPages - 1
                }
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(paginationMeta.totalPages - 1)}
                disabled={
                  paginationMeta.currentPage === paginationMeta.totalPages - 1
                }
              >
                <ChevronsRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </LoadingContainer>

      {selectedDocument && (
        <FullscreenDocumentPreview
          document={selectedDocument}
          onDelete={() => {
            onDelete(selectedDocument);
            setSelectedDocument(null);
          }}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      <HorizontalAddDocumentDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
        }}
        onSuccess={() => {
          setSearchQuery('');
          setFilterCategory(null);
          setFilterUser(null);
          onSearch('', {});
        }}
      />
    </div>
  );
};

export default DocumentList;
