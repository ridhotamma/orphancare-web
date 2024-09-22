import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store';
import {
  selectProfile,
  selectProfileStatus,
  selectProfileError,
  fetchProfile,
  updateProfile,
  clearProfile,
} from './profileSlice';
import { Profile } from '@/app/types/profile';

export const useProfile = () => useSelector(selectProfile);
export const useProfileStatus = () => useSelector(selectProfileStatus);
export const useProfileError = () => useSelector(selectProfileError);

export const useFetchProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  return () => dispatch(fetchProfile());
};

export const useUpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (profileData: Partial<Profile>) =>
    dispatch(updateProfile(profileData));
};

export const useClearProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  return () => dispatch(clearProfile());
};
