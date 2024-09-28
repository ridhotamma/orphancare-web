import { useHeader } from '@/context/header-context';
import { useEffect } from 'react';


export const usePageTitle = (title: string) => {
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    setHeaderTitle(title);

    return () => setHeaderTitle('Dashboard')
  }, [setHeaderTitle, title]);
};
