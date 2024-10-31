import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { requests } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureUploadProps {
  onImageUrlChange: (url: string) => void;
  disabled?: boolean;
  currentImageUrl?: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  onImageUrlChange,
  disabled = false,
  currentImageUrl = '',
}) => {
  const [imageUrl, setImageUrl] = useState<string>(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const { register } = useForm();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await requests({
        url: '/public/files/upload',
        method: 'POST',
        data: formData,
      });

      const uploadedImageUrl = data.url;

      setImageUrl(uploadedImageUrl);
      onImageUrlChange(uploadedImageUrl);
    } catch (error: any) {
      toast({
        title: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className='flex flex-col items-center space-y-4'>
      <Avatar className='w-32 h-32'>
        <AvatarImage className='object-cover' src={imageUrl} alt='Profile picture' />
        <AvatarFallback>
          <Camera className='w-12 h-12 text-gray-400' />
        </AvatarFallback>
      </Avatar>
      <div className='flex items-center space-x-2'>
        <Input
          type='file'
          accept='image/*'
          {...register('profilePicture')}
          onChange={handleFileChange}
          className='hidden'
          id='profilePictureInput'
          ref={fileInputRef}
          disabled={disabled}
        />
        <Button
          type='button'
          variant='outline'
          disabled={disabled || isUploading}
          onClick={handleUploadClick}
        >
          {isUploading ? 'Uploading...' : 'Upload Picture'}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;