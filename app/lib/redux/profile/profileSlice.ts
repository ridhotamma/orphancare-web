import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '@/app/types/profile';
import { RootState } from '@/app/lib/redux/store';

interface ProfileState {
  profile: Profile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  status: 'idle',
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    // Replace this with your actual API call
    const response = await fetch('/api/profile');
    return response.json();
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: Partial<Profile>) => {
    // Replace this with your actual API call
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    return response.json();
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.status = 'succeeded';
          state.profile = action.payload;
        }
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.profile = action.payload;
        }
      );
  },
});

export const { clearProfile } = profileSlice.actions;

export const selectProfile = (state: RootState) => state.profile.profile;
export const selectProfileStatus = (state: RootState) => state.profile.status;
export const selectProfileError = (state: RootState) => state.profile.error;

export default profileSlice.reducer;
