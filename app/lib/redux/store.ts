import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/app/lib/redux/auth/authSlice';
import documentReducer from '@/app/lib/redux/document/documentSlice';
import userReducer from '@/app/lib/redux/user/userSlice';
import profileReducer from '@/app/lib/redux/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: documentReducer,
    user: userReducer,
    profile: profileReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
