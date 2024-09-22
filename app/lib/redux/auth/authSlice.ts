import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { requests } from '@/app/lib/axios';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    const response = await requests({
      url: '/login',
      method: 'POST',
      data: credentials,
    });
    return response.token;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await requests({
    url: '/logout',
    method: 'POST',
  });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
      });
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
