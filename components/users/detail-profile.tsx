import React, { useState, useEffect } from 'react';
import 'react-phone-number-input/style.css';
import ProfilePictureUpload from '@/components/users/profile-picture-upload';
import PhoneInput from 'react-phone-number-input';
import AutocompleteSelect from '@/components/ui/autocomplete-select';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import { BedRoom } from '@/types/bedroom';
import { OrphanType, User } from '@/types/user';
import { Guardian } from '@/types/guardian';
import { GuardianType } from '@/types/guardian-type';

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
  credentials: Omit<User, 'profile'>;
  onRefresh: () => void;
};

export const DetailProfile: React.FC<DetailProfileProps> = ({
  data,
  credentials,
  onRefresh,
}: DetailProfileProps) => {
  const { toast } = useToast();
  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [provinces, setProvinces] = useState<AutocompleteItem[]>([]);
  const [regencies, setRegencies] = useState<AutocompleteItem[]>([]);
  const [districts, setDistricts] = useState<AutocompleteItem[]>([]);
  const [villages, setVillages] = useState<AutocompleteItem[]>([]);
  const [bedRooms, setBedrooms] = useState([]);
  const [guardianTypes, setGuardianTypes] = useState([]);

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

  const orphanStatusOptions = [
    { value: OrphanType.FATHERLESS, label: 'Yatim' },
    { value: OrphanType.MOTHERLESS, label: 'Piatu' },
    { value: OrphanType.BOTH_DECEASED, label: 'Yatim Piatu' },
    { value: OrphanType.POOR, label: 'Dhuafa' },
  ] as const;

  const handleSaveProfile = async () => {
    try {
      setLoadingSave(true);
      await requests({
        url: `/public/profiles/${credentials.id}`,
        method: 'PUT',
        data: {
          ...profile,
          bedRoomId: profile?.bedRoom?.id,
          address: {
            ...profile?.address,
            provinceDetail: {
              id: userAddress.province?.value,
              name: userAddress.province?.label,
            },
            districtDetail: {
              id: userAddress.district?.value,
              name: userAddress.district?.label,
            },
            regencyDetail: {
              id: userAddress.regency?.value,
              name: userAddress.regency?.label,
            },
            villageDetail: {
              id: userAddress.village?.value,
              name: userAddress.village?.label,
            },
          },
          guardian: profile?.guardian?.fullName
            ? {
                ...profile?.guardian,
                address: {
                  ...profile?.guardian?.address,
                  provinceDetail: {
                    id: guardianAddress.province?.value,
                    name: guardianAddress.province?.label,
                  },
                  districtDetail: {
                    id: guardianAddress.district?.value,
                    name: guardianAddress.district?.label,
                  },
                  regencyDetail: {
                    id: guardianAddress.regency?.value,
                    name: guardianAddress.regency?.label,
                  },
                  villageDetail: {
                    id: guardianAddress.village?.value,
                    name: guardianAddress.village?.label,
                  },
                },
              }
            : null,
        } as Profile,
      });
      onRefresh();
      setIsEditProfile(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        variant: 'success',
      });
    } catch (error: any) {
      const errorMessage =
        error.message ||
        Object.entries(error)
          .map((entry) => {
            const [key, value] = entry;
            const message = `${key}: ${value}`;
            return message;
          })
          .join(', ');
      toast({
        variant: 'destructive',
        title: errorMessage,
      });
    } finally {
      setLoadingSave(false);
    }
  };

  const getRegencies = async (provinceId: string) => {
    setLoadingAddress(true);
    try {
      const data = await requests({
        url: `/address/provinces/${provinceId}/regencies`,
      });
      const result = data?.map((item: Record<string, any>) => ({
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
      const result = data?.map((item: Record<string, any>) => ({
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
      const result = data?.map((item: Record<string, any>) => ({
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
    const getGuardianTypes = async () => {
      try {
        const data = await requests({
          url: '/admin/guardian-types',
        });
        setGuardianTypes(data);
      } catch (error: any) {
        toast({
          title: error.message,
          variant: 'destructive',
        });
      }
    };

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
        const result = data?.map((item: Record<string, any>) => ({
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
    getGuardianTypes();
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
  }, [data]);

  const handleAddressChange = (
    addressType: 'user' | 'guardian',
    field: keyof AddressState,
    value: AutocompleteItem | null
  ) => {
    if (addressType === 'user') {
      // Reset child fields based on which field changed
      switch (field) {
        case 'province':
          setUserAddress((prev) => ({
            ...prev,
            province: value,
            regency: null,
            district: null,
            village: null,
          }));
          setProfile((prev) => ({
            ...prev!,
            address: {
              ...prev?.address,
              province: value?.label || '',
              regency: '',
              district: '',
              village: '',
            },
          }));
          // Clear options
          setRegencies([]);
          setDistricts([]);
          setVillages([]);
          break;

        case 'regency':
          setUserAddress((prev) => ({
            ...prev,
            regency: value,
            district: null,
            village: null,
          }));
          setProfile((prev) => ({
            ...prev!,
            address: {
              ...prev?.address,
              regency: value?.label || '',
              district: '',
              village: '',
            },
          }));
          // Clear options
          setDistricts([]);
          setVillages([]);
          break;

        case 'district':
          setUserAddress((prev) => ({
            ...prev,
            district: value,
            village: null,
          }));
          setProfile((prev) => ({
            ...prev!,
            address: {
              ...prev?.address,
              district: value?.label || '',
              village: '',
            },
          }));
          // Clear options
          setVillages([]);
          break;

        case 'village':
          setUserAddress((prev) => ({
            ...prev,
            village: value,
          }));
          setProfile((prev) => ({
            ...prev!,
            address: {
              ...prev?.address,
              village: value?.label || '',
            },
          }));
          break;
      }
    } else {
      // Guardian address changes
      switch (field) {
        case 'province':
          setGuardianAddress((prev) => ({
            ...prev,
            province: value,
            regency: null,
            district: null,
            village: null,
          }));
          setProfile((prev) => ({
            ...prev!,
            guardian: {
              ...prev?.guardian,
              address: {
                ...prev?.guardian!.address,
                province: value?.label || '',
                regency: '',
                district: '',
                village: '',
              },
            } as Guardian,
          }));
          // Clear options
          setRegencies([]);
          setDistricts([]);
          setVillages([]);
          break;

        case 'regency':
          setGuardianAddress((prev) => ({
            ...prev,
            regency: value,
            district: null,
            village: null,
          }));
          setProfile((prev) => ({
            ...prev!,
            guardian: {
              ...prev?.guardian,
              address: {
                ...prev?.guardian!.address,
                regency: value?.label || '',
                district: '',
                village: '',
              },
            } as Guardian,
          }));
          // Clear options
          setDistricts([]);
          setVillages([]);
          break;

        case 'district':
          setGuardianAddress((prev) => ({
            ...prev,
            district: value,
            village: null,
          }));
          setProfile((prev) => ({
            ...prev!,
            guardian: {
              ...prev?.guardian,
              address: {
                ...prev?.guardian!.address,
                district: value?.label || '',
                village: '',
              },
            } as Guardian,
          }));
          // Clear options
          setVillages([]);
          break;

        case 'village':
          setGuardianAddress((prev) => ({
            ...prev,
            village: value,
          }));
          setProfile((prev) => ({
            ...prev!,
            guardian: {
              ...prev?.guardian,
              address: {
                ...prev?.guardian!.address,
                village: value?.label || '',
              },
            } as Guardian,
          }));
          break;
      }
    }
  };

  const handleProfilePictureChange = (url: string) => {
    setProfile((prev) => ({ ...prev, profilePicture: url } as Profile));
  };

  const renderAddress = (address: Address | undefined) => {
    if (!address) return 'Belum ditentukan';
    const parts = [
      address.street,
      address.village,
      address.district,
      address.regency,
      address.province,
      address.postalCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Belum ditentukan';
  };

  const renderEditableAddress = (
    addressType: 'user' | 'guardian',
    addressState: AddressState
  ) => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div>
        <Label htmlFor='street'>Jalan</Label>
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
                  ...prev?.guardian,
                  address: {
                    ...prev?.guardian!.address,
                    street: e.target.value,
                  },
                } as Guardian,
              }));
            }
          }}
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label>Provinsi</Label>
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
          searchPlaceholder='Pilih Provinsi...'
          placeholder='Pilih Provinsi'
          className='w-full'
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label>Kabupaten/Kota</Label>
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
          searchPlaceholder='Pilih Kabupaten/Kota...'
          placeholder='Pilih Kabupaten/Kota'
          className='w-full'
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label>Kecamatan</Label>
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
          searchPlaceholder='Pilih Kecamatan...'
          placeholder='Pilih Kecamatan'
          className='w-full'
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label>Desa/Kelurahan</Label>
        <AutocompleteSelect
          items={villages}
          value={addressState.village}
          onChange={(item) => {
            handleAddressChange(addressType, 'village', item);
          }}
          isLoading={loadingAddress}
          searchPlaceholder='Pilih Desa/Kelurahan...'
          placeholder='Pilih Desa/Kelurahan'
          className='w-full'
          disabled={!isEditProfile}
        />
      </div>
      <div>
        <Label htmlFor='postalCode'>Kode Pos</Label>
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
                  ...prev?.guardian,
                  address: {
                    ...prev?.guardian!.address,
                    postalCode: e.target.value,
                  },
                } as Guardian,
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
              <X className='h-4 w-4 mr-2' /> Batal
            </Button>
            <Button onClick={handleSaveProfile} disabled={loadingSave}>
              <Save className='h-4 w-4 mr-2' /> Simpan
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditProfile(true)}>
            <Edit2 className='h-4 w-4 mr-2' /> Ubah
          </Button>
        )}
      </div>

      <form className='space-y-8'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Profil</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div>
              <Label htmlFor='profilePicture'>Foto Profil</Label>
              <ProfilePictureUpload
                onImageUrlChange={handleProfilePictureChange}
                disabled={!isEditProfile}
                currentImageUrl={profile?.profilePicture}
              />
            </div>
            <div>
              <Label htmlFor='fullName'>Nama Lengkap</Label>
              <Input
                id='fullName'
                value={profile?.fullName || ''}
                onChange={(e) =>
                  setProfile(
                    (prev) => ({ ...prev, fullName: e.target.value } as Profile)
                  )
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='birthday'>Tanggal Lahir</Label>
              <Input
                id='birthday'
                type='date'
                value={profile?.birthday || ''}
                onChange={(e) =>
                  setProfile(
                    (prev) => ({ ...prev, birthday: e.target.value } as Profile)
                  )
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='bio'>Biografi</Label>
              <Textarea
                id='bio'
                value={profile?.bio || ''}
                onChange={(e) =>
                  setProfile(
                    (prev) => ({ ...prev, bio: e.target.value } as Profile)
                  )
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='joinDate'>Tanggal Bergabung</Label>
              <Input
                id='joinDate'
                type='date'
                value={profile?.joinDate || ''}
                onChange={(e) =>
                  setProfile(
                    (prev) => ({ ...prev, joinDate: e.target.value } as Profile)
                  )
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='joinDate'>Tanggal Keluar</Label>
              <Input
                id='leaveDate'
                type='date'
                value={profile?.leaveDate || ''}
                onChange={(e) =>
                  setProfile(
                    (prev) =>
                      ({ ...prev, leaveDate: e.target.value } as Profile)
                  )
                }
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='phoneNumber'>Nomor Telepon</Label>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry='ID'
                value={profile?.phoneNumber || ''}
                onChange={(value) =>
                  setProfile(
                    (prev) => ({ ...prev, phoneNumber: value || '' } as Profile)
                  )
                }
                inputComponent={Input}
                disabled={!isEditProfile}
              />
            </div>
            <div>
              <Label htmlFor='gender'>Jenis Kelamin</Label>
              <Select
                disabled={!isEditProfile}
                value={profile?.gender}
                onValueChange={(value) =>
                  setProfile(
                    (prev) => ({ ...prev, gender: value as Gender } as Profile)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Pilih jenis kelamin' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Gender.MALE}>Laki-laki</SelectItem>
                  <SelectItem value={Gender.FEMALE}>Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!data?.careTaker && (
              <>
                <div>
                  <Label htmlFor='kkNumber'>Nomor KK</Label>
                  <Input
                    id='kkNumber'
                    value={profile?.kkNumber || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      if (value.length <= 16) {
                        setProfile(
                          (prev) => ({ ...prev, kkNumber: value } as Profile)
                        );
                      }
                    }}
                    maxLength={16}
                    pattern='\d*'
                    disabled={!isEditProfile}
                  />
                </div>

                <div>
                  <Label htmlFor='nikNumber'>NIK</Label>
                  <Input
                    id='nikNumber'
                    value={profile?.nikNumber || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      if (value.length <= 16) {
                        setProfile(
                          (prev) => ({ ...prev, nikNumber: value } as Profile)
                        );
                      }
                    }}
                    maxLength={16}
                    pattern='\d*'
                    disabled={!isEditProfile}
                  />
                </div>

                <div>
                  <Label htmlFor='orphanStatus'>Status Anak</Label>
                  <Select
                    disabled={!isEditProfile}
                    value={profile?.orphanStatus}
                    onValueChange={(value) =>
                      setProfile(
                        (prev) =>
                          ({
                            ...prev,
                            orphanStatus: value as OrphanType,
                          } as Profile)
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih status anak' />
                    </SelectTrigger>
                    <SelectContent>
                      {orphanStatusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div>
              <Label htmlFor='bedroom'>Kamar</Label>
              <Select
                disabled={!isEditProfile}
                value={profile?.bedRoom?.id}
                onValueChange={(value) =>
                  setProfile(
                    (prev) =>
                      ({
                        ...prev,
                        bedRoom: bedRooms?.find(
                          (bedroom: BedRoom) => bedroom?.id === value
                        ),
                      } as Profile)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Pilih kamar' />
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
            <CardTitle className='text-xl'>Status Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <Checkbox
                  id='caretaker'
                  checked={profile?.careTaker || false}
                  onCheckedChange={(checked) =>
                    setProfile(
                      (prev) =>
                        ({
                          ...prev,
                          careTaker: checked as boolean,
                        } as Profile)
                    )
                  }
                  disabled={!isEditProfile}
                />
                <div className='space-y-1 leading-none'>
                  <Label htmlFor='caretaker'>Pengasuh</Label>
                  <p className='text-sm text-gray-600'>
                    Apakah pengguna ini Pengasuh?
                  </p>
                </div>
              </div>
              <div className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <Checkbox
                  id='alumni'
                  checked={profile?.alumni || false}
                  onCheckedChange={(checked) =>
                    setProfile(
                      (prev) =>
                        ({
                          ...prev,
                          alumni: checked as boolean,
                        } as Profile)
                    )
                  }
                  disabled={!isEditProfile}
                />
                <div className='space-y-1 leading-none'>
                  <Label htmlFor='alumni'>Alumni</Label>
                  <p className='text-sm text-gray-600'>
                    Apakah pengguna ini alumni?
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Alamat Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditProfile ? (
              renderEditableAddress('user', userAddress)
            ) : (
              <div>
                <Label>Alamat</Label>
                <p>{renderAddress(profile?.address)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {!data?.careTaker && (
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Informasi Wali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='guardianFullName'>Nama Lengkap Wali</Label>
                  <Input
                    id='guardianFullName'
                    value={profile?.guardian?.fullName || ''}
                    onChange={(e) =>
                      setProfile(
                        (prev) =>
                          ({
                            ...prev,
                            guardian: {
                              ...profile?.guardian,
                              fullName: e.target.value,
                            } as Guardian,
                          } as Profile)
                      )
                    }
                    disabled={!isEditProfile}
                  />
                </div>
                <div>
                  <Label htmlFor='guardianPhoneNumber'>
                    Nomor Telepon Wali
                  </Label>
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry='ID'
                    value={profile?.guardian?.phoneNumber || ''}
                    onChange={(value) =>
                      setProfile(
                        (prev) =>
                          ({
                            ...prev,
                            guardian: {
                              ...profile?.guardian,
                              phoneNumber: value || '',
                            } as Guardian,
                          } as Profile)
                      )
                    }
                    inputComponent={Input}
                    disabled={!isEditProfile}
                  />
                </div>
                <div>
                  <Label htmlFor='guardianType'>Jenis Wali</Label>
                  <Select
                    disabled={!isEditProfile}
                    value={profile?.guardianTypeId}
                    onValueChange={(value) =>
                      setProfile(
                        (prev) =>
                          ({
                            ...prev,
                            guardianTypeId: value,
                          } as Profile)
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih jenis wali' />
                    </SelectTrigger>
                    <SelectContent>
                      {guardianTypes.map((type: GuardianType) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!data?.careTaker && (
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Alamat Wali</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditProfile ? (
                renderEditableAddress('guardian', guardianAddress)
              ) : (
                <div>
                  <Label>Alamat</Label>
                  <p>{renderAddress(profile?.guardian?.address)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
};

export default DetailProfile;
