import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyContainerProps {
  icon?: LucideIcon;
  image?: React.ReactNode;
  text: string;
}

const EmptyContainerIcon: React.FC<{ icon: LucideIcon }> = ({ icon: Icon }) => (
  <div className='mb-4'>
    <Icon className='w-12 h-12 text-gray-400' />
  </div>
);

const EmptyContainerImage: React.FC<{ image: React.ReactNode }> = ({
  image,
}) => <div className='mb-4'>{image}</div>;

const EmptyContainerText: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <p className='text-lg text-gray-500'>{children}</p>;

const EmptyContainer: React.FC<EmptyContainerProps> = ({
  icon,
  image,
  text,
}) => {
  return (
    <div className='flex flex-col items-center justify-center p-8 min-h-80 rounded-lg'>
      {icon && <EmptyContainerIcon icon={icon} />}
      {image && <EmptyContainerImage image={image} />}
      <EmptyContainerText>{text}</EmptyContainerText>
    </div>
  );
};

export default EmptyContainer;
