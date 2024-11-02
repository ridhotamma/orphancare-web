import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { format } from 'date-fns';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import ProfilePictureUpload from '@/components/users/profile-picture-upload';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { GuardianType } from '@/types/guardian-type';
import { BedRoom } from '@/types/bedroom';
import { RoleType } from '@/types/enums';
import AutocompleteSelect from '../ui/autocomplete-select';
import { OrphanType } from '@/types/user';

const addressSchema = z.object({
  street: z.string().optional(),
  village: z.string().optional(),
  regency: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
});

const formSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[^\s]+$/, 'Username cannot contain spaces'),
  password: z
    .string({
      message: 'Password is required',
    })
    .min(6)
    .regex(
      /^(?=.*[A-Z])(?=.*\d).*$/,
      'Password must contain at least one uppercase letter and one number'
    ),
  email: z.string().email(),
  fullName: z.string().min(2),
  gender: z.enum(['MALE', 'FEMALE']),
  birthday: z.string(),
  bedRoomId: z.string().uuid(),
  profilePicture: z.string().url().optional(),
  joinDate: z.string(),
  phoneNumber: z.string().optional(),
  bio: z.string().max(500).optional(),
  alumni: z.boolean().optional(),
  active: z.boolean().optional(),
  admin: z.boolean().optional(),
  guardianFullName: z.string().min(2).optional(),
  guardianTypeId: z.string().uuid().optional(),
  guardianPhoneNumber: z.string().optional(),
  address: addressSchema.optional(),
  guardianAddress: addressSchema.optional(),
  kkNumber: z
    .string()
    .length(16, { message: 'KK Number must be exactly 16 digits' })
    .optional(),
  nikNumber: z
    .string()
    .length(16, { message: 'NIK must be exactly 16 digits' })
    .optional(),
  orphanStatus: z
    .enum(
      [
        OrphanType.FATHERLESS,
        OrphanType.MOTHERLESS,
        OrphanType.BOTH_DECEASED,
        OrphanType.POOR,
      ],
      {
        required_error: 'Please select an orphan status',
      }
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

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

type UserFormProps<T extends Partial<FormValues>> = {
  initialData?: T;
  careTakerForm: boolean;
  editMode?: boolean;
};

const UserForm = <T extends Partial<FormValues>>({
  initialData,
  careTakerForm,
  editMode,
}: UserFormProps<T>) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      birthday: initialData?.birthday
        ? format(new Date(initialData.birthday), 'yyyy-MM-dd')
        : '',
      joinDate: initialData?.joinDate
        ? format(new Date(initialData.joinDate), 'yyyy-MM-dd')
        : '',
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [bedRooms, setBedrooms] = useState([]);
  const [guardianTypes, setGuardianTypes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [useChildAddress, setUseChildAddress] = useState(false);

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

  const orphanStatusOptions = [
    { value: OrphanType.FATHERLESS, label: 'Yatim' },
    { value: OrphanType.MOTHERLESS, label: 'Piatu' },
    { value: OrphanType.BOTH_DECEASED, label: 'Yatim Piatu' },
    { value: OrphanType.POOR, label: 'Dhuafa' },
  ] as const;

  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const handleProfilePictureChange = (url: string) => {
    form.setValue('profilePicture', url);
  };

  const handleAddressChange = (
    addressType: 'user' | 'guardian',
    field: keyof AddressState,
    value: AutocompleteItem | null
  ) => {
    if (addressType === 'user') {
      switch (field) {
        case 'province':
          setUserAddress((prev) => ({
            ...prev,
            province: value,
            regency: null,
            district: null,
            village: null,
          }));
          form.setValue('address.regency', '');
          form.setValue('address.district', '');
          form.setValue('address.village', '');
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
          form.setValue('address.district', '');
          form.setValue('address.village', '');
          setDistricts([]);
          setVillages([]);
          break;
        case 'district':
          setUserAddress((prev) => ({
            ...prev,
            district: value,
            village: null,
          }));
          form.setValue('address.village', '');
          setVillages([]);
          break;
        case 'village':
          setUserAddress((prev) => ({
            ...prev,
            village: value,
          }));
          break;
      }

      if (useChildAddress) {
        switch (field) {
          case 'province':
            setGuardianAddress((prev) => ({
              ...prev,
              province: value,
              regency: null,
              district: null,
              village: null,
            }));
            form.setValue('guardianAddress.regency', '');
            form.setValue('guardianAddress.district', '');
            form.setValue('guardianAddress.village', '');
            break;
          case 'regency':
            setGuardianAddress((prev) => ({
              ...prev,
              regency: value,
              district: null,
              village: null,
            }));
            form.setValue('guardianAddress.district', '');
            form.setValue('guardianAddress.village', '');
            break;
          case 'district':
            setGuardianAddress((prev) => ({
              ...prev,
              district: value,
              village: null,
            }));
            form.setValue('guardianAddress.village', '');
            break;
          case 'village':
            setGuardianAddress((prev) => ({
              ...prev,
              village: value,
            }));
            break;
        }
      }
    } else {
      switch (field) {
        case 'province':
          setGuardianAddress((prev) => ({
            ...prev,
            province: value,
            regency: null,
            district: null,
            village: null,
          }));
          form.setValue('guardianAddress.regency', '');
          form.setValue('guardianAddress.district', '');
          form.setValue('guardianAddress.village', '');
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
          form.setValue('guardianAddress.district', '');
          form.setValue('guardianAddress.village', '');
          setDistricts([]);
          setVillages([]);
          break;
        case 'district':
          setGuardianAddress((prev) => ({
            ...prev,
            district: value,
            village: null,
          }));
          form.setValue('guardianAddress.village', '');
          setVillages([]);
          break;
        case 'village':
          setGuardianAddress((prev) => ({
            ...prev,
            village: value,
          }));
          break;
      }
    }
  };

  const handleUseChildAddressChange = (checked: boolean) => {
    setUseChildAddress(checked);
    if (checked) {
      setGuardianAddress(userAddress);
      const userAddressValues = form.getValues('address');
      form.setValue('guardianAddress', userAddressValues);
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

    getBedRooms();
    getGuardianTypes();
    getProvinces();
  }, [toast]);

  const onSubmit = async (data: FormValues) => {
    console.log('on submit');
    setSubmitting(true);

    try {
      let url = '/admin/users';

      if (editMode) {
        url += `/${params.id}`;
      }

      const roles = [RoleType.USER];

      if (data.admin) {
        roles.push(RoleType.ADMIN);
      }

      const payloadData = {
        ...data,
        roles: roles,
        careTaker: careTakerForm,
        guardianTypeId: data.guardianTypeId,
        address: {
          ...data.address,
          provinceDetail: {
            id: userAddress.province?.value,
            name: userAddress.province?.label,
          },
          regencyDetail: {
            id: userAddress.regency?.value,
            name: userAddress.regency?.label,
          },
          districtDetail: {
            id: userAddress.district?.value,
            name: userAddress.district?.label,
          },
          villageDetail: {
            id: userAddress.village?.value,
            name: userAddress.village?.label,
          },
        },
        guardian: data.guardianFullName && {
          fullName: data.guardianFullName,
          address: {
            ...data.guardianAddress,
            provinceDetail: {
              id: guardianAddress.province?.value,
              name: guardianAddress.province?.label,
            },
            regencyDetail: {
              id: guardianAddress.regency?.value,
              name: guardianAddress.regency?.label,
            },
            districtDetail: {
              id: guardianAddress.district?.value,
              name: guardianAddress.district?.label,
            },
            villageDetail: {
              id: guardianAddress.village?.value,
              name: guardianAddress.village?.label,
            },
          },
          phoneNumber: data.guardianPhoneNumber,
        },
      };

      await requests({
        url,
        method: 'POST',
        data: payloadData,
      });

      router.push(`/users${careTakerForm ? '/caretakers' : '/children'}`);
      toast({
        title: `${careTakerForm ? 'Caretaker' : 'Child'} successfully added!`,
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
      setSubmitting(false);
    }
  };

  const renderAddressFields = (
    prefix: 'address' | 'guardianAddress',
    addressState: AddressState,
    addressType: 'user' | 'guardian'
  ) => (
    <>
      <FormField
        control={form.control}
        name={`${prefix}.street`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat Jalan</FormLabel>
            <FormControl>
              <Input
                placeholder='Alamat Jalan'
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  if (useChildAddress && addressType === 'user') {
                    form.setValue('guardianAddress.street', e.target.value);
                  }
                }}
                disabled={addressType === 'guardian' && useChildAddress}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.province`}
        render={() => (
          <FormItem>
            <FormLabel>Provinsi</FormLabel>
            <FormControl>
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
                disabled={addressType === 'guardian' && useChildAddress}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.regency`}
        render={() => (
          <FormItem>
            <FormLabel>Kabupaten/Kota</FormLabel>
            <FormControl>
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
                disabled={addressType === 'guardian' && useChildAddress}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.district`}
        render={() => (
          <FormItem>
            <FormLabel>Kecamatan</FormLabel>
            <FormControl>
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
                disabled={addressType === 'guardian' && useChildAddress}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.village`}
        render={() => (
          <FormItem>
            <FormLabel>Desa/Kelurahan</FormLabel>
            <FormControl>
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
                disabled={addressType === 'guardian' && useChildAddress}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.postalCode`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kode Pos</FormLabel>
            <FormControl>
              <Input
                placeholder='Kode Pos'
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  if (useChildAddress && addressType === 'user') {
                    form.setValue('guardianAddress.postalCode', e.target.value);
                  }
                }}
                disabled={addressType === 'guardian' && useChildAddress}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <div className='container mx-auto px-0 lg:px-20'>
      <div className='flex items-center mb-6'>
        <Button variant='link' className='p-0' asChild>
          <Link href={careTakerForm ? '/users/caretakers' : '/users/children'}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Kembali ke Daftar {careTakerForm ? 'Pengasuh' : 'Anak'}
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Data Akun</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kata Sandi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Kata Sandi'
                        type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='email@contoh.com'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Profil</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <FormField
                control={form.control}
                name='profilePicture'
                render={() => (
                  <FormItem>
                    <FormLabel>Foto Profil</FormLabel>
                    <FormControl>
                      <ProfilePictureUpload
                        onImageUrlChange={handleProfilePictureChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder='Nama Lengkap' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih jenis kelamin' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='MALE'>Laki-laki</SelectItem>
                        <SelectItem value='FEMALE'>Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!careTakerForm && (
                <>
                  <FormField
                    control={form.control}
                    name='kkNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor KK</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Masukkan 16 digit Nomor KK'
                            {...field}
                            maxLength={16}
                            pattern='\d*'
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^\d]/g,
                                ''
                              );
                              if (value.length <= 16) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='nikNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIK</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Masukkan 16 digit NIK'
                            {...field}
                            maxLength={16}
                            pattern='\d*'
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^\d]/g,
                                ''
                              );
                              if (value.length <= 16) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='orphanStatus'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Anak</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Pilih status anak' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {orphanStatusOptions.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name='birthday'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        className='w-full px-3 py-2 rounded-md focus:outline-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={() => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Controller
                        name='phoneNumber'
                        control={form.control}
                        render={({ field }) => (
                          <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry='ID'
                            placeholder='Masukkan nomor telepon'
                            inputComponent={Input}
                            {...field}
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografi</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Deskripsi biografi' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bedRoomId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kamar</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih kamar' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bedRooms?.map((bedRoom: BedRoom) => (
                          <SelectItem key={bedRoom.id} value={bedRoom.id}>
                            {bedRoom.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='joinDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Bergabung</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        className='w-full px-3 py-2 rounded-md focus:outline-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Status Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <FormField
                  control={form.control}
                  name='admin'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Admin</FormLabel>
                        <FormDescription>
                          Apakah pengguna ini Admin?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='alumni'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Alumni</FormLabel>
                        <FormDescription>
                          Apakah pengguna ini alumni?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='active'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Aktif</FormLabel>
                        <FormDescription>
                          Apakah akun pengguna ini aktif?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Alamat Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {renderAddressFields('address', userAddress, 'user')}
              </div>
            </CardContent>
          </Card>

          {!careTakerForm && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl'>Informasi Wali</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='guardianFullName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap Wali</FormLabel>
                          <FormControl>
                            <Input placeholder='Nama Lengkap Wali' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='guardianTypeId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Wali</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Pilih jenis wali' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {guardianTypes?.map(
                                (guardianType: GuardianType) => (
                                  <SelectItem
                                    key={guardianType.id}
                                    value={guardianType.id}
                                  >
                                    {guardianType.name}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='guardianPhoneNumber'
                      render={() => (
                        <FormItem>
                          <FormLabel>Nomor Telepon Wali</FormLabel>
                          <FormControl>
                            <Controller
                              name='guardianPhoneNumber'
                              control={form.control}
                              render={({ field }) => (
                                <PhoneInput
                                  international
                                  countryCallingCodeEditable={false}
                                  defaultCountry='ID'
                                  placeholder='Masukkan nomor telepon wali'
                                  inputComponent={Input}
                                  {...field}
                                />
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-xl'>Alamat Wali</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='mb-6 flex items-center space-x-2'>
                    <Switch
                      checked={useChildAddress}
                      onCheckedChange={handleUseChildAddressChange}
                    />
                    <FormLabel className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                      Gunakan alamat yang sama dengan anak
                    </FormLabel>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {renderAddressFields(
                      'guardianAddress',
                      guardianAddress,
                      'guardian'
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Button
            onClick={() => onSubmit}
            className='w-full md:w-auto'
            type='submit'
          >
            {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {submitting ? 'Mohon Tunggu..' : 'Simpan'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
