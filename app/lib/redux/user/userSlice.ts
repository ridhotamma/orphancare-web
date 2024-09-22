import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/app/types/user';
import { RootState } from '../store';

interface UserState {
  currentUser: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  status: 'idle',
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  'users/fetchCurrentUser',
  async () => {
    // Replace this with your actual API call
    const response = await fetch('/api/users/me');
    return response.json();
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData: Partial<User>) => {
    // Replace this with your actual API call
    const response = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = 'succeeded';
          state.currentUser = action.payload;
        }
      )
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
