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
import { useAuth } from '@/provider/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { requests } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { GuardianType } from '@/types/guardian-type';
import { BedRoom } from '@/types/bedroom';
import { RoleType } from '@/types/enums';
import AutocompleteSelect from '../ui/autocomplete-select';

const addressSchema = z.object({
  street: z.string().optional(),
  village: z.string().optional(),
  regency: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
});

const formSchema = z.object({
  username: z.string().min(3).max(20),
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

  const { toast } = useToast();
  const { setUnauthorized } = useAuth();
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
      setUserAddress((prev) => ({ ...prev, [field]: value }));
      if (useChildAddress) {
        setGuardianAddress((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      setGuardianAddress((prev) => ({ ...prev, [field]: value }));
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
    const getGuardians = async () => {
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

    getBedRooms();
    getGuardians();
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
        address: {
          ...data.address,
          provinceDetail: {
            id: userAddress.province?.value,
            name: userAddress.province?.label,
          },
          regencyDetail: {
            id: userAddress.regency?.value,
            name: userAddress.regency?.label
          },
          districtDetail: {
            id: userAddress.district?.value,
            name: userAddress.district?.label
          },
          villageDetail: {
            id: userAddress.village?.value,
            name: userAddress.village?.label
          },
        },
        guardian: {
          fullName: data.guardianFullName,
          address: data.guardianAddress,
          phoneNumber: data.guardianPhoneNumber,
          guardianTypeId: data.guardianTypeId,
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
      if (error.status === 401) {
        setUnauthorized(true);
      } else {
        const errorMessage =
          error.message ||
          Object.entries(error)
            .map((entry) => {
              const [key, value] = entry;
              const message = `${key} ${value}`;
              return message;
            })
            .join(', ');
        toast({
          variant: 'destructive',
          title: errorMessage,
        });
      }
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
            <FormLabel>Street</FormLabel>
            <FormControl>
              <Input
                placeholder='Street'
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
            <FormLabel>Province</FormLabel>
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
                searchPlaceholder='Select Province...'
                placeholder='Select Province'
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
            <FormLabel>Regency</FormLabel>
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
                searchPlaceholder='Select Regency...'
                placeholder='Select Regency'
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
            <FormLabel>District</FormLabel>
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
                searchPlaceholder='Select District...'
                placeholder='Select District'
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
            <FormLabel>Village</FormLabel>
            <FormControl>
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
            <FormLabel>Postal Code</FormLabel>
            <FormControl>
              <Input
                placeholder='Postal Code'
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
            Back to {careTakerForm ? 'Caretaker' : 'Children'} List
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Credentials</CardTitle>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Password'
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
                        placeholder='email@example.com'
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
              <CardTitle className='text-xl'>Profile</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <FormField
                control={form.control}
                name='profilePicture'
                render={() => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
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
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Full Name' {...field} />
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
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select gender' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='MALE'>Male</SelectItem>
                        <SelectItem value='FEMALE'>Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='birthday'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthday</FormLabel>
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Controller
                        name='phoneNumber'
                        control={form.control}
                        render={({ field }) => (
                          <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry='ID'
                            placeholder='Enter phone number'
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
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Bio Description' {...field} />
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
                    <FormLabel>Bedroom</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select bedroom' />
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
                    <FormLabel>Join Date</FormLabel>
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
              <CardTitle className='text-xl'>User Status</CardTitle>
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
                          Is this user an Admin?
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
                          Is this user an alumnus?
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
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Is this user account active?
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
              <CardTitle className='text-xl'>User Address</CardTitle>
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
                  <CardTitle className='text-xl'>
                    Guardian Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='guardianFullName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guardian Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Guardian Full Name'
                              {...field}
                            />
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
                          <FormLabel>Guardian Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select guardian type' />
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
                          <FormLabel>Guardian Phone Number</FormLabel>
                          <FormControl>
                            <Controller
                              name='guardianPhoneNumber'
                              control={form.control}
                              render={({ field }) => (
                                <PhoneInput
                                  international
                                  countryCallingCodeEditable={false}
                                  defaultCountry='ID'
                                  placeholder='Enter guardian phone number'
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
                  <CardTitle className='text-xl'>Guardian Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='mb-6 flex items-center space-x-2'>
                    <Switch
                      checked={useChildAddress}
                      onCheckedChange={handleUseChildAddressChange}
                    />
                    <FormLabel className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                      Use same address as child
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
            {submitting ? 'Please Wait..' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
