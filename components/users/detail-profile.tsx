import React, { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import AutocompleteSelect from '../ui/autocomplete-select';
import { requests } from '@/lib/api';
import { BedRoom } from '@/types/bedroom';

type AutocompleteItem = {
  value: string;
  label: string;
};

type AddressState = {
  province: AutocompleteItem | null;
  regency: AutocompleteItem | null;
  district: AutocompleteItem | null;
  village: AutocompleteItem | null;
};

type DetailProfileProps = {
  data?: Profile;
};

export const DetailProfile: React.FC<DetailProfileProps> = ({
  data,
}: DetailProfileProps) => {
  const { toast } = useToast();
  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [provinces, setProvinces] = useState<AutocompleteItem[]>([]);
  const [regencies, setRegencies] = useState<AutocompleteItem[]>([]);
  const [districts, setDistricts] = useState<AutocompleteItem[]>([]);
  const [villages, setVillages] = useState<AutocompleteItem[]>([]);
  const [bedRooms, setBedrooms] = useState([]);

  const [userAddress, setUserAddress] = useState<AddressState>({
    province: null,
    regency: null,
    district: null,
    village: null,
  });

  const [guardianAddress, setGuardianAddress] = useState<AddressState>({
    province: null,
    regency: null,
    district: null,
    village: null,
  });

  const [profile, setProfile] = useState<Profile | null>(data as Profile);

  const handleSaveProfile = async () => {
    try {
      setIsEditProfile(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getRegencies = async (provinceId: string) => {
    setLoadingAddress(true);
    try {
      const data = await requests({
        url: `/address/provinces/${provinceId}/regencies`,
      });
      const result = data.map((item: Record<string, any>) => ({
        value: item.id,
        label: item.name,
      }));
      setRegencies(result);
    } catch (error: any) {
      toast({
        title: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingAddress(false);
    }
  };

  const getDistricts = async (regencyId: string) => {
    setLoadingAddress(true);
    try {
      const data = await requests({
        url: `/address/regencies/${regencyId}/districts`,
      });
      const result = data.map((item: Record<string, any>) => ({
        value: item.id,
        label: item.name,
      }));
      setDistricts(result);
    } catch (error: any) {
      toast({
        title: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingAddress(false);
    }
  };

  const getVillages = async (districtId: string) => {
    setLoadingAddress(true);
    try {
      const data = await requests({
        url: `/address/districts/${districtId}/villages`,
      });
      const result = data.map((item: Record<string, any>) => ({
        value: item.id,
        label: item.name,
      }));
      setVillages(result);
    } catch (error: any) {
      toast({
        title: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingAddress(false);
    }
  };

  useEffect(() => {
    const getBedRooms = async () => {
      try {
        const data = await requests({
          url: '/admin/bedrooms/dropdown',
          params: {
            perPage: 50,
          },
        });
        setBedrooms(data);
      } catch (error: any) {
        toast({
          title: error.message,
          variant: 'destructive',
        });
      }
    };

    const getProvinces = async () => {
      try {
        const data = await requests({
          url: '/address/provinces',
        });
        const result = data.map((item: Record<string, any>) => ({
          value: item.id,
          label: item.name,
        }));
        setProvinces(result);
      } catch (error: any) {
        toast({
          title: error.message,
          variant: 'destructive',
        });
      }
    };

    getProvinces();
    getBedRooms();
  }, [toast]);

  useEffect(() => {
    setUserAddress((prev) => ({
      ...prev,
      province: {
        label: data?.address?.provinceDetail?.name || '',
        value: data?.address?.provinceDetail?.id || '',
      },
      regency: {
        label: data?.address?.regencyDetail?.name || '',
        value: data?.address?.regencyDetail?.id || '',
      },
      district: {
        label: data?.address?.districtDetail?.name || '',
        value: data?.address?.districtDetail?.id || '',
      },
      village: {
        label: data?.address?.villageDetail?.name || '',
        value: data?.address?.villageDetail?.id || '',
      },
    }));

    setGuardianAddress((prev) => ({
      ...prev,
      province: {
        label: data?.guardian?.address?.provinceDetail?.name || '',
        value: data?.guardian?.address?.provinceDetail?.id || '',
      },
      regency: {
        label: data?.guardian?.address?.regencyDetail?.name || '',
        value: data?.guardian?.address?.regencyDetail?.id || '',
      },
      district: {
        label: data?.guardian?.address?.districtDetail?.name || '',
        value: data?.guardian?.address?.districtDetail?.id || '',
      },
      village: {
        label: data?.guardian?.address?.villageDetail?.name || '',
        value: data?.guardian?.address?.villageDetail?.id || '',
      },
    }));

    console.log({ userAddress, guardianAddress })
  }, [data]);

  const handleAddressChange = (
    addressType: 'user' | 'guardian',
    field: keyof AddressState,
    value: AutocompleteItem | null
  ) => {
    if (addressType === 'user') {
      setUserAddress((prev) => ({ ...prev, [field]: value }));
      setProfile((prev) => ({
        ...prev!,
        address: {
          ...prev?.address,
          [field]: value?.label || '',
        },
      }));
    } else {
      setGuardianAddress((prev) => ({ ...prev, [field]: value }));
      setProfile((prev) => ({
        ...prev!,
        guardian: {
          ...prev?.guardian!,
          address: {
            ...prev?.guardian!.address,
            [field]: value?.label || '',
          },
        },
      }));
    }
  };

  const handleProfilePictureChange = (url: string) => {
    setProfile({ ...profile!, profilePicture: url });
  };

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

  const renderEditableAddress = (
    addressType: 'user' | 'guardian',
    addressState: AddressState
  ) => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div>
        <Label htmlFor='street'>Street</Label>
        <Input
          id='street'
          value={
            addressType === 'user'
              ? profile?.address?.street
              : profile?.guardian?.address?.street
          }
          onChange={(e) => {
            if (addressType === 'user') {
              setProfile((prev) => ({
                ...prev!,
                address: { ...prev?.address, street: e.target.value },
              }));
            } else {
              setProfile((prev) => ({
                ...prev!,
                guardian: {
                  ...prev?.guardian!,
                  address: {
                    ...prev?.guardian!.address,
                    street: e.target.value,
                  },
                },
              }));
            }
          }}
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label>Province</Label>
        <AutocompleteSelect
          items={provinces}
          value={addressState.province}
          onChange={(item) => {
            handleAddressChange(addressType, 'province', item);
            if (item?.value) {
              getRegencies(item.value);
            }
          }}
          isLoading={loadingAddress}
          searchPlaceholder='Select Province...'
          placeholder='Select Province'
          className='w-full'
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label>Regency</Label>
        <AutocompleteSelect
          items={regencies}
          value={addressState.regency}
          onChange={(item) => {
            handleAddressChange(addressType, 'regency', item);
            if (item?.value) {
              getDistricts(item.value);
            }
          }}
          isLoading={loadingAddress}
          searchPlaceholder='Select Regency...'
          placeholder='Select Regency'
          className='w-full'
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label>District</Label>
        <AutocompleteSelect
          items={districts}
          value={addressState.district}
          onChange={(item) => {
            handleAddressChange(addressType, 'district', item);
            if (item?.value) {
              getVillages(item.value);
            }
          }}
          isLoading={loadingAddress}
          searchPlaceholder='Select District...'
          placeholder='Select District'
          className='w-full'
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label>Village</Label>
        <AutocompleteSelect
          items={villages}
          value={addressState.village}
          onChange={(item) => {
            handleAddressChange(addressType, 'village', item);
          }}
          isLoading={loadingAddress}
          searchPlaceholder='Select Village...'
          placeholder='Select Village'
          className='w-full'
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label htmlFor='postalCode'>Postal Code</Label>
        <Input
          id='postalCode'
          value={
            addressType === 'user'
              ? profile?.address?.postalCode
              : profile?.guardian?.address?.postalCode
          }
          onChange={(e) => {
            if (addressType === 'user') {
              setProfile((prev) => ({
                ...prev!,
                address: { ...prev?.address, postalCode: e.target.value },
              }));
            } else {
              setProfile((prev) => ({
                ...prev!,
                guardian: {
                  ...prev?.guardian!,
                  address: {
                    ...prev?.guardian!.address,
                    postalCode: e.target.value,
                  },
                },
              }));
            }
          }}
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
                currentImageUrl={profile?.profilePicture}
              />
            </div>
            <div>
              <Label htmlFor='fullName'>Full Name</Label>
              <Input
                id='fullName'
                value={profile?.fullName || ''}
                onChange={(e) =>
                  setProfile({ ...profile!, fullName: e.target.value })
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='birthday'>Birthday</Label>
              <Input
                id='birthday'
                type='date'
                value={profile?.birthday || ''}
                onChange={(e) =>
                  setProfile({ ...profile!, birthday: e.target.value })
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='bio'>Bio</Label>
              <Textarea
                id='bio'
                value={profile?.bio || ''}
                onChange={(e) =>
                  setProfile({ ...profile!, bio: e.target.value })
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='joinDate'>Join Date</Label>
              <Input
                id='joinDate'
                type='date'
                value={profile?.joinDate || ''}
                onChange={(e) =>
                  setProfile({ ...profile!, joinDate: e.target.value })
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
                value={profile?.phoneNumber || ''}
                onChange={(value) =>
                  setProfile({ ...profile!, phoneNumber: value || '' })
                }
                inputComponent={Input}
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='gender'>Gender</Label>
              <Select
                disabled={!isEditProfile}
                value={profile?.gender}
                onValueChange={(value) =>
                  setProfile({ ...profile!, gender: value as Gender })
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
                value={profile?.bedRoom?.id}
                onValueChange={(value) =>
                  setProfile({
                    ...profile!,
                    bedRoom: { ...profile?.bedRoom!, id: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select bedroom' />
                </SelectTrigger>
                <SelectContent>
                  {bedRooms?.map((bedRoom: BedRoom) => (
                    <SelectItem key={bedRoom.id} value={bedRoom.id}>
                      {bedRoom.name}
                    </SelectItem>
                  ))}
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
                  checked={profile?.careTaker || false}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile!, careTaker: checked as boolean })
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
                  checked={profile?.alumni || false}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile!, alumni: checked as boolean })
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
              renderEditableAddress('user', userAddress)
            ) : (
              <div>
                <Label>Address</Label>
                <p>{renderAddress(profile?.address)}</p>
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
                  value={profile?.guardian?.fullName || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile!,
                      guardian: {
                        ...profile?.guardian!,
                        fullName: e.target.value,
                      },
                    })
                  }
                  disabled={!isEditProfile}
                />
              </div>
              <div>
                <Label htmlFor='guardianPhoneNumber'>
                  Guardian Phone Number
                </Label>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry='ID'
                  value={profile?.guardian?.phoneNumber || ''}
                  onChange={(value) =>
                    setProfile({
                      ...profile!,
                      guardian: {
                        ...profile?.guardian!,
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
              renderEditableAddress('guardian', guardianAddress)
            ) : (
              <div>
                <Label>Address</Label>
                <p>{renderAddress(profile?.guardian?.address)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default DetailProfile;
