import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit2, Users } from 'lucide-react';
import { BedRoom } from '@/types/bedroom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BedroomFormDialog from '@/components/bedrooms/bedroom-form-dialog';
import { BedRoomType, MultiSelectItem } from '@/types/bedroom-type';
import { requests } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/user';

interface BedRoomDetailProps {
  bedRoom: BedRoom | null;
  onEdit: (bedroom: Payload) => void
  users: User[]
}

interface Payload {
  id?: string;
  name: string;
  bedRoomTypeId: string;
  profiles: string[];
}

const BedRoomDetail = ({ bedRoom, onEdit, users }: BedRoomDetailProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bedRoomTypes, setBedRoomTypes] = useState<BedRoomType[]>([]);

  const userDropdownList: MultiSelectItem[] = users
    .map((user) => ({
      id: user.id as string,
      label: user.profile?.fullName || '',
      value: user.profile?.id || '',
      avatarUrl: user.profile?.profilePicture || '',
    }))
    .filter((user) => user.label);

  const initialBedroom: Payload = {
    profiles: bedRoom?.profiles?.map((profile) => profile.id) || [],
    name: bedRoom?.name || '',
    bedRoomTypeId: bedRoom?.bedRoomType?.id || '',
  };

  const { toast } = useToast();

  useEffect(() => {
    const getBedRoomTypes = async () => {
      try {
        const data = await requests({
          url: '/admin/bedroom-types',
          method: 'GET',
        });

        setBedRoomTypes(data);
      } catch (error: any) {
        toast({
          title: error.error,
          content: error.message,
          variant: 'destructive',
        });
      }
    };

    getBedRoomTypes();
  }, [toast]);

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <Button variant='link' className='p-0' asChild>
          <Link href='/bedrooms'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to bedroom List
          </Link>
        </Button>

        <Button onClick={() => setIsDialogOpen(true)}>
          <Edit2 className='h-4 w-4 mr-2' />
          Edit Bedroom
        </Button>
      </div>

      <Card className='mb-8 shadow-lg'>
        <CardHeader className='bg-gray-50 dark:bg-gray-800'>
          <div className='flex justify-between items-center'>
            <CardTitle className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
              {bedRoom?.name}
            </CardTitle>
            <Badge variant='secondary' className='text-sm font-medium'>
              {bedRoom?.bedRoomType.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='flex items-center space-x-4 text-gray-600 dark:text-gray-100'>
            <Users className='h-5 w-5' />
            <span>{bedRoom?.profiles?.length || 0} Occupants</span>
          </div>
        </CardContent>
      </Card>

      <h2 className='text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200'>
        Occupants
      </h2>
      {!bedRoom?.profiles || bedRoom.profiles.length === 0 ? (
        <Card className='p-6 text-center bg-gray-50 dark:bg-gray-800'>
          <Users className='h-12 w-12 mx-auto mb-4 text-gray-400' />
          <h3 className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-2'>
            No Occupants
          </h3>
          <p className='text-gray-500 dark:text-gray-400 mb-4'>
            This room currently has no assigned occupants.
          </p>
          <Button
            variant='outline'
            onClick={() => setIsDialogOpen(true)}
            className='mx-auto'
          >
            <Users className='h-4 w-4 mr-2' />
            Assign Occupants
          </Button>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {bedRoom.profiles.map((profile, index) => (
            <Card
              key={index}
              className='flex items-center p-4 space-x-4 shadow-md hover:shadow-lg transition-shadow duration-300'
            >
              <Avatar className='h-12 w-12 border-2 border-gray-200'>
                <AvatarImage
                  src={profile.profilePicture}
                  alt={profile.fullName}
                />
                <AvatarFallback className='bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-100'>
                  {profile?.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className='font-semibold text-gray-800 dark:text-gray-100'>
                  {profile.fullName}
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  @{profile?.fullName?.toLowerCase().replace(' ', '_')}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
      <BedroomFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={(payload) => onEdit(payload)}
        bedRoomTypes={bedRoomTypes}
        users={userDropdownList}
        initialBedroom={initialBedroom}
      />
    </div>
  );
};

export default BedRoomDetail;
