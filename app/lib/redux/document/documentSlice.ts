import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Document } from '@/app/types/document';
import { RootState } from '@/app/lib/redux/store';

interface DocumentState {
  documents: Document[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  status: 'idle',
  error: null,
};

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async () => {
    const response = await fetch('/api/documents');
    return response.json();
  }
);

export const addDocument = createAsyncThunk(
  'documents/addDocument',
  async (document: Omit<Document, 'id'>) => {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(document),
    });
    return response.json();
  }
);

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchDocuments.fulfilled,
        (state, action: PayloadAction<Document[]>) => {
          state.status = 'succeeded';
          state.documents = action.payload;
        }
      )
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch documents';
      })
      .addCase(
        addDocument.fulfilled,
        (state, action: PayloadAction<Document>) => {
          state.documents.push(action.payload);
        }
      );
  },
});

export const selectAllDocuments = (state: RootState) =>
  state.documents.documents;
export const selectDocumentStatus = (state: RootState) =>
  state.documents.status;
export const selectDocumentError = (state: RootState) => state.documents.error;

export default documentSlice.reducer;
