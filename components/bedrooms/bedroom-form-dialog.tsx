import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { BedRoomType, MultiSelectItem } from '@/types/bedroom-type';

interface Bedroom {
  id?: string;
  name: string;
  bedRoomTypeId: string;
  profiles: string[];
}

type AbsoluteBedroomFormProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (bedroom: Bedroom) => void;
  bedRoomTypes: BedRoomType[];
  users: MultiSelectItem[];
  initialBedroom?: Bedroom;
};

const AbsoluteBedroomForm: React.FC<AbsoluteBedroomFormProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  bedRoomTypes,
  users,
  initialBedroom,
}) => {
  const [bedroom, setBedroom] = useState<Bedroom>({
    name: '',
    bedRoomTypeId: '',
    profiles: [],
  });

  useEffect(() => {
    if (isOpen && initialBedroom) {
      setBedroom(initialBedroom);
    } else if (!isOpen) {
      setBedroom({ name: '', bedRoomTypeId: '', profiles: [] });
    }
  }, [isOpen, initialBedroom]);

  const handleSubmit = () => {
    onSubmit(bedroom);
    onOpenChange(false);
  };

  const isEditMode = !!initialBedroom;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/70 z-40'
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50'>
        {/* Header */}
        <div className='p-6 border-b border-gray-200 dark:border-gray-800'>
          <h2 className='text-2xl font-bold'>
            {isEditMode ? 'Edit Bedroom' : 'Add New Bedroom'}
          </h2>
        </div>

        {/* Content */}
        <div className='p-6 max-h-[calc(90vh-200px)] overflow-y-auto'>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='name' className='text-sm font-medium'>
                Bedroom Name
              </Label>
              <Input
                id='name'
                value={bedroom.name}
                onChange={(e) =>
                  setBedroom({ ...bedroom, name: e.target.value })
                }
                className='w-full'
                placeholder='Enter bedroom name'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='type' className='text-sm font-medium'>
                Bedroom Type
              </Label>
              <Select
                value={bedroom.bedRoomTypeId}
                onValueChange={(value) =>
                  setBedroom({ ...bedroom, bedRoomTypeId: value })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select bedroom type' />
                </SelectTrigger>
                <SelectContent>
                  {bedRoomTypes.map((type, index) => (
                    <SelectItem key={index} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='profiles' className='text-sm font-medium'>
                Occupants
              </Label>
              <MultiSelect
                options={users}
                value={bedroom.profiles}
                onValueChange={(value) =>
                  setBedroom({ ...bedroom, profiles: value })
                }
                placeholder='Select Occupants'
                variant='default'
                className='w-full'
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditMode ? 'Update Bedroom' : 'Add Bedroom'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AbsoluteBedroomForm;
