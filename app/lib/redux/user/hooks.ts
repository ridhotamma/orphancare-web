import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store';
import {
  selectCurrentUser,
  selectUserStatus,
  selectUserError,
  fetchCurrentUser,
  updateUser,
  logout,
} from './userSlice';
import { User } from '@/app/types/user';

export const useCurrentUser = () => useSelector(selectCurrentUser);
export const useUserStatus = () => useSelector(selectUserStatus);
export const useUserError = () => useSelector(selectUserError);

export const useFetchCurrentUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  return () => dispatch(fetchCurrentUser());
};

export const useUpdateUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (userData: Partial<User>) => dispatch(updateUser(userData));
};

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  return () => dispatch(logout());
};
