import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  occupants: string[];
}

type BedroomFormDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (bedroom: Bedroom) => void;
  bedRoomTypes: BedRoomType[];
  users: MultiSelectItem[];
  initialBedroom?: Bedroom;
};

const BedroomFormDialog: React.FC<BedroomFormDialogProps> = ({
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
    occupants: [],
  });

  useEffect(() => {
    if (isOpen && initialBedroom) {
      setBedroom(initialBedroom);
    } else if (!isOpen) {
      setBedroom({ name: '', bedRoomTypeId: '', occupants: [] });
    }
  }, [isOpen, initialBedroom]);

  const handleSubmit = () => {
    onSubmit(bedroom);
    onOpenChange(false);
  };

  const isEditMode = !!initialBedroom;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {isEditMode ? 'Edit Bedroom' : 'Add New Bedroom'}
          </DialogTitle>
        </DialogHeader>
        <div className='mt-6 space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name' className='text-sm font-medium'>
              Bedroom Name
            </Label>
            <Input
              id='name'
              value={bedroom.name}
              onChange={(e) => setBedroom({ ...bedroom, name: e.target.value })}
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
                {bedRoomTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='occupants' className='text-sm font-medium'>
              Occupants
            </Label>
            <MultiSelect
              options={users}
              value={bedroom.occupants}
              onValueChange={(value) =>
                setBedroom({ ...bedroom, occupants: value })
              }
              placeholder='Select Occupants'
              variant='default'
              className='w-full'
            />
          </div>
        </div>
        <DialogFooter className='mt-6'>
          <Button onClick={handleSubmit} className='w-full sm:w-auto'>
            {isEditMode ? 'Update Bedroom' : 'Add Bedroom'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BedroomFormDialog;
