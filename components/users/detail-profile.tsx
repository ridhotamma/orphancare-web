import React from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { Profile } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Address } from '@/types/address';
import { Gender } from '@/types/enums';
import ProfilePictureUpload from '@/components/users/profile-picture-upload';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Checkbox } from '@/components/ui/checkbox';

interface DetailProfileProps {
  profile: Profile;
  isEditProfile: boolean;
  setIsEditProfile: (value: boolean) => void;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  handleSaveProfile: () => void;
  guardianTypes?: Array<any>;
}

export const DetailProfile: React.FC<DetailProfileProps> = ({
  profile,
  isEditProfile,
  setIsEditProfile,
  setProfile,
  handleSaveProfile,
  guardianTypes,
}) => {
  const renderAddress = (address: Address | undefined) => {
    if (!address) return 'Not specified';
    const parts = [
      address.street,
      address.urbanVillage,
      address.subdistrict,
      address.city,
      address.province,
      address.postalCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  };

  const handleProfilePictureChange = (url: string) => {
    setProfile({ ...profile, profilePicture: url });
  };

  const renderEditableAddress = (
    address: Address | undefined,
    updateFunction: (newAddress: Address) => void
  ) => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div>
        <Label htmlFor='street'>Street</Label>
        <Input
          id='street'
          value={address?.street || ''}
          onChange={(e) =>
            updateFunction({ ...address, street: e.target.value })
          }
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label htmlFor='urbanVillage'>Urban Village</Label>
        <Input
          id='urbanVillage'
          value={address?.urbanVillage || ''}
          onChange={(e) =>
            updateFunction({ ...address, urbanVillage: e.target.value })
          }
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label htmlFor='subdistrict'>Subdistrict</Label>
        <Input
          id='subdistrict'
          value={address?.subdistrict || ''}
          onChange={(e) =>
            updateFunction({ ...address, subdistrict: e.target.value })
          }
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label htmlFor='city'>City</Label>
        <Input
          id='city'
          value={address?.city || ''}
          onChange={(e) => updateFunction({ ...address, city: e.target.value })}
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label htmlFor='province'>Province</Label>
        <Input
          id='province'
          value={address?.province || ''}
          onChange={(e) =>
            updateFunction({ ...address, province: e.target.value })
          }
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label htmlFor='postalCode'>Postal Code</Label>
        <Input
          id='postalCode'
          value={address?.postalCode || ''}
          onChange={(e) =>
            updateFunction({ ...address, postalCode: e.target.value })
          }
          disabled={!isEditProfile}
        />
      </div>
    </div>
  );

  return (
    <div className='container mx-auto px-0 lg:px-20'>
      <div className='flex items-center justify-end mb-6'>
        {isEditProfile ? (
          <div className='space-x-2'>
            <Button variant='outline' onClick={() => setIsEditProfile(false)}>
              <X className='h-4 w-4 mr-2' /> Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              <Save className='h-4 w-4 mr-2' /> Save
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditProfile(true)}>
            <Edit2 className='h-4 w-4 mr-2' /> Edit
          </Button>
        )}
      </div>

      <form className='space-y-8'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Profile</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div>
              <Label htmlFor='profilePicture'>Profile Picture</Label>
              <ProfilePictureUpload
                onImageUrlChange={handleProfilePictureChange}
                disabled={!isEditProfile}
                currentImageUrl={profile.profilePicture}
              />
            </div>
            <div>
              <Label htmlFor='fullName'>Full Name</Label>
              <Input
                id='fullName'
                value={profile.fullName || ''}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='birthday'>Birthday</Label>
              <Input
                id='birthday'
                type='date'
                value={profile.birthday || ''}
                onChange={(e) =>
                  setProfile({ ...profile, birthday: e.target.value })
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='bio'>Bio</Label>
              <Textarea
                id='bio'
                value={profile.bio || ''}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='joinDate'>Join Date</Label>
              <Input
                id='joinDate'
                type='date'
                value={profile.joinDate || ''}
                onChange={(e) =>
                  setProfile({ ...profile, joinDate: e.target.value })
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry='ID'
                value={profile.phoneNumber || ''}
                onChange={(value) =>
                  setProfile({ ...profile, phoneNumber: value || '' })
                }
                inputComponent={Input}
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='gender'>Gender</Label>
              <Select
                disabled={!isEditProfile}
                value={profile.gender}
                onValueChange={(value) =>
                  setProfile({ ...profile, gender: value as Gender })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select gender' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Gender.MALE}>Male</SelectItem>
                  <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='bedroom'>Bedroom</Label>
              <Select
                disabled={!isEditProfile}
                value={profile.bedRoomId}
                onValueChange={(value) =>
                  setProfile({ ...profile, bedRoomId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select bedroom' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={profile.bedRoom?.id || ''}>
                    {profile.bedRoom?.name}
                  </SelectItem>
                  {/* Add more bedrooms here */}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>User Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <Checkbox
                  id='caretaker'
                  checked={profile.careTaker || false}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile, careTaker: checked as boolean })
                  }
                  disabled={!isEditProfile}
                />
                <div className='space-y-1 leading-none'>
                  <Label htmlFor='caretaker'>Caretaker</Label>
                  <p className='text-sm text-gray-600'>
                    Is this user a Caretaker?
                  </p>
                </div>
              </div>
              <div className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <Checkbox
                  id='alumni'
                  checked={profile.alumni || false}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile, alumni: checked as boolean })
                  }
                  disabled={!isEditProfile}
                />
                <div className='space-y-1 leading-none'>
                  <Label htmlFor='alumni'>Alumni</Label>
                  <p className='text-sm text-gray-600'>
                    Is this user an alumnus?
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>User Address</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditProfile ? (
              renderEditableAddress(profile.address, (newAddress) =>
                setProfile({ ...profile, address: newAddress })
              )
            ) : (
              <div>
                <Label>Address</Label>
                <p>{renderAddress(profile.address)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Guardian Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='guardianFullName'>Guardian Full Name</Label>
                <Input
                  id='guardianFullName'
                  value={profile.guardian?.fullName || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      guardian: {
                        ...profile.guardian,
                        fullName: e.target.value,
                      },
                    })
                  }
                  disabled={!isEditProfile}
                />
              </div>
              <div>
                <Label htmlFor='guardianType'>Guardian Type</Label>
                <Select
                  disabled={!isEditProfile}
                  value={profile.guardian?.guardianType?.id || ''}
                  onValueChange={(value) =>
                    setProfile({
                      ...profile,
                      guardian: {
                        ...profile.guardian,
                        guardianType: {
                          id: value
                        },
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select guardian type' />
                  </SelectTrigger>
                  <SelectContent>
                    {guardianTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='guardianPhoneNumber'>
                  Guardian Phone Number
                </Label>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry='ID'
                  value={profile.guardian?.phoneNumber || ''}
                  onChange={(value) =>
                    setProfile({
                      ...profile,
                      guardian: {
                        ...profile.guardian,
                        phoneNumber: value || '',
                      },
                    })
                  }
                  inputComponent={Input}
                  disabled={!isEditProfile}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Guardian Address</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditProfile ? (
              renderEditableAddress(profile.guardian?.address, (newAddress) =>
                setProfile({
                  ...profile,
                  guardian: { ...profile.guardian, address: newAddress },
                })
              )
            ) : (
              <div>
                <Label>Address</Label>
                <p>{renderAddress(profile.guardian?.address)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
