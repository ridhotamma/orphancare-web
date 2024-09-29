import { useHeader } from '@/provider/header-provider';
import { useEffect } from 'react';


export const usePageTitle = (title: string) => {
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    setHeaderTitle(title);

    return () => setHeaderTitle('')
  }, [setHeaderTitle, title]);
};
