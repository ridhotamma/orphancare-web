import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import cookieStorage from '@/lib/storage/cookies';

type AuthContextType = {
  isUnauthorized: boolean;
  setUnauthorized: (value: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isUnauthorized, setUnauthorized] = useState(false);
  const router = useRouter();

  const logout = useCallback(() => {
    cookieStorage.removeItem('authToken');
    router.push('/auth/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ isUnauthorized, setUnauthorized, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
