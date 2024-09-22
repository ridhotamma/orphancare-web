import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store';
import {
  selectAllDocuments,
  selectDocumentStatus,
  selectDocumentError,
  fetchDocuments,
  addDocument,
} from './documentSlice';
import { Document } from '@/app/types/document';

export const useDocuments = () => useSelector(selectAllDocuments);
export const useDocumentStatus = () => useSelector(selectDocumentStatus);
export const useDocumentError = () => useSelector(selectDocumentError);

export const useFetchDocuments = () => {
  const dispatch = useDispatch<AppDispatch>();
  return () => dispatch(fetchDocuments());
};

export const useAddDocument = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (document: Omit<Document, 'id'>) => dispatch(addDocument(document));
};
