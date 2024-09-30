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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Inventory } from '@/types/inventory';
import { InventoryType } from '@/types/inventory-type';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  inventoryTypeId: z.string().uuid('Invalid inventory type'),
});

type FormData = z.infer<typeof schema>;

interface InventoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  inventory?: Inventory;
  inventoryTypes: InventoryType[];
}

const InventoryFormDialog: React.FC<InventoryFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  inventory,
  inventoryTypes,
}) => {
  const [title, setTitle] = useState('Add New Inventory Item');
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      quantity: 0,
      inventoryTypeId: '',
    },
  });

  useEffect(() => {
    if (inventory) {
      setTitle('Edit Inventory Item');
      reset({
        name: inventory.name,
        quantity: inventory.quantity,
        inventoryTypeId: inventory.inventoryType.id,
      });
    } else {
      setTitle('Add New Inventory Item');
      reset({
        name: '',
        quantity: 0,
        inventoryTypeId: '',
      });
    }
  }, [inventory, reset]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input id='name' placeholder='Enter item name' {...field} />
              )}
            />
            {errors.name && (
              <p className='text-sm text-red-500'>{errors.name.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='quantity'>Quantity</Label>
            <Controller
              name='quantity'
              control={control}
              render={({ field }) => (
                <Input
                  id='quantity'
                  type='number'
                  placeholder='Enter quantity'
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.quantity && (
              <p className='text-sm text-red-500'>{errors.quantity.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='inventoryType'>Inventory Type</Label>
            <Controller
              name='inventoryTypeId'
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select inventory type' />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.inventoryTypeId && (
              <p className='text-sm text-red-500'>
                {errors.inventoryTypeId.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type='submit'>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryFormDialog;
