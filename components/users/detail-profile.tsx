import React from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { Profile } from '@/types/profile';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DetailProfileProps {
  profile: Profile;
  isEditProfile: boolean;
  setIsEditProfile: (value: boolean) => void;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  handleSaveProfile: () => void;
}

export const DetailProfile: React.FC<DetailProfileProps> = ({
  profile,
  isEditProfile,
  setIsEditProfile,
  setProfile,
  handleSaveProfile,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className='flex justify-between items-center'>
        Profile
        {!isEditProfile && (
          <Button onClick={() => setIsEditProfile(true)}>
            <Edit2 className='h-4 w-4 mr-2' /> Edit
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='space-y-4'>
        <div>
          <Label htmlFor='fullName'>Full Name</Label>
          <Input
            id='fullName'
            value={profile.fullName}
            onChange={(e) =>
              setProfile({ ...profile, fullName: e.target.value })
            }
            disabled={!isEditProfile}
          />
        </div>
        <div>
          <Label htmlFor='phoneNumber'>Phone Number</Label>
          <Input
            id='phoneNumber'
            value={profile.phoneNumber}
            onChange={(e) =>
              setProfile({ ...profile, phoneNumber: e.target.value })
            }
            disabled={!isEditProfile}
          />
        </div>
        <div>
          <Label>Gender</Label>
          <p>{profile.gender}</p>
        </div>
        <div>
          <Label>Bedroom</Label>
          <p>{profile?.bedRoom?.name}</p>
        </div>
      </div>
    </CardContent>
    {isEditProfile && (
      <CardFooter className='justify-end space-x-2'>
        <Button variant='outline' onClick={() => setIsEditProfile(false)}>
          <X className='h-4 w-4 mr-2' /> Cancel
        </Button>
        <Button onClick={handleSaveProfile}>
          <Save className='h-4 w-4 mr-2' /> Save
        </Button>
      </CardFooter>
    )}
  </Card>
);
