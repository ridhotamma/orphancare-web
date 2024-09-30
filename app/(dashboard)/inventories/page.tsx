'use client';

import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { mockInventories } from '@/data/mockup/inventory-mockup';
import {
  Search,
  Package,
  Calendar,
  Plus,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePageTitle } from '@/hooks/use-page-title';
import InventoryFormDialog from '@/components/inventories/inventory-form-dialog';
import { Inventory } from '@/types/inventory';

const InventoriesPage = () => {
  usePageTitle('Inventories');

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  );
  const [sortField, setSortField] = useState<'name' | 'quantity'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  

  const handleSort = useCallback(
    (field: 'name' | 'quantity') => {
      if (field === sortField) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    },
    [sortField, sortDirection]
  );

  const sortedInventories = [...mockInventories].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === 'quantity') {
      return sortDirection === 'asc'
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    }
    return 0;
  });

  const getSortIcon = (field: 'name' | 'quantity') => {
    if (sortField !== field) return <ArrowUpDown className='ml-2 h-4 w-4' />;
    return sortDirection === 'asc' ? (
      <ArrowUp className='ml-2 h-4 w-4' />
    ) : (
      <ArrowDown className='ml-2 h-4 w-4' />
    );
  };

  const handleAddNewItem = () => {
    setSelectedInventory(null);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedInventory(null);
  };

  const handleSubmitInventory = (data: Partial<Inventory>) => {
    console.log('Submitting inventory:', data);
    handleCloseDialog();
  };

  return (
    <div>
      <div className='mb-8 flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-grow'>
          <Search
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-100'
            size={18}
          />
          <Input
            type='text'
            placeholder='Search inventory...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 w-full'
          />
        </div>
        <Button className='w-full sm:w-auto' onClick={handleAddNewItem}>
          <Plus className='mr-2 h-4 w-4' />
          Add New Item
        </Button>
      </div>

      <div className='mb-4 flex justify-end'>
        <Button
          variant={sortField === 'name' ? 'default' : 'outline'}
          size='sm'
          className='mr-2'
          onClick={() => handleSort('name')}
        >
          Sort by Name
          {getSortIcon('name')}
        </Button>
        <Button
          variant={sortField === 'quantity' ? 'default' : 'outline'}
          size='sm'
          onClick={() => handleSort('quantity')}
        >
          Sort by Quantity
          {getSortIcon('quantity')}
        </Button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {sortedInventories.map((item) => (
          <Card
            key={item.id}
            className='overflow-hidden transition-all duration-300 hover:shadow-lg'
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center'>
                  <Package className='mr-2 text-blue-500' size={24} />
                  <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-200'>
                    {item.name}
                  </h3>
                </div>
                <Badge variant='secondary' className='text-xs'>
                  {item.inventoryType.name}
                </Badge>
              </div>
              <div className='space-y-3'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Quantity:{' '}
                  <span className='font-medium text-gray-800 dark:text-gray-200'>
                    {item.quantity}
                  </span>
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Unit:{' '}
                  <span className='font-medium text-gray-800 dark:text-gray-200'>
                    {item.unit?.name || 'N/A'}
                  </span>
                </p>
                <div className='flex items-center text-xs text-gray-500 dark:text-gray-200'>
                  <Calendar
                    className='mr-2 text-gray-400 dark:text-gray-100'
                    size={14}
                  />
                  Last updated: {item.updatedAt.toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <CardFooter className='p-4'>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => handleViewDetails(item)}
              >
                <Eye className='mr-2 h-4 w-4' /> View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <InventoryFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitInventory}
        inventory={selectedInventory as Inventory}
        inventoryTypes={[]}
      />
    </div>
  );
};

export default InventoriesPage;
