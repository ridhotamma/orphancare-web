import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import authReducer from '@/app/lib/redux/auth/authSlice';
import documentReducer from '@/app/lib/redux/document/documentSlice';
import userReducer from '@/app/lib/redux/user/userSlice';
import profileReducer from '@/app/lib/redux/profile/profileSlice';
import cookieStorage from '@/app/lib/storage/cookies';

const persistConfig = {
  key: 'root',
  storage: cookieStorage,
  whitelist: ['auth'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    documents: documentReducer,
    user: userReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
