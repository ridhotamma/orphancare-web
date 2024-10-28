import { User } from '@/types/user';
import { create } from 'zustand';

interface CurrentUserStore {
  userDetail: Partial<User> | null;
  setCurrentUser: (user: User) => void;
}

const useCurrentUser = create<CurrentUserStore>((set) => ({
  userDetail: null,
  setCurrentUser: (data: User) => set(() => ({ userDetail: data })),
}));

export default useCurrentUser;
