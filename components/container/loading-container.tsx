import React from 'react';
import { Loader2 } from 'lucide-react';

type LoadingContainerProps = {
  children: React.ReactNode;
  loading: boolean;
  fullScreen?: boolean;
};

const LoadingContainer: React.FC<LoadingContainerProps> = ({
  loading,
  children,
  fullScreen = true,
}) => {
  if (!loading) return <>{children}</>;

  const containerClasses = fullScreen
    ? 'h-screen w-full'
    : 'h-full w-full min-h-80';

  return (
    <div
      className={`${containerClasses} flex gap-4 justify-center items-center`}
    >
      <Loader2 className='h-6 w-6 animate-spin text-primary' />
      <span className='text-sm text-muted-foreground'>Loading...</span>
    </div>
  );
};

export default LoadingContainer;
