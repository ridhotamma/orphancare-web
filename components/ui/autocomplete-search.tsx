import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type AutocompleteSearchProps<T> = {
  onSearch: (query: string) => Promise<T[]>;
  value?: T | null;
  onChange?: (item: T | null) => void;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
  renderValue?: (item: T) => string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  getId: (item: T) => string | number;
};

function AutocompleteSearch<T extends object>({
  onSearch,
  value: selectedValue = null,
  onChange,
  renderItem,
  renderValue = (item: T) => String(item),
  placeholder = 'Select an item...',
  searchPlaceholder = 'Search items...',
  emptyMessage = 'No items found.',
  className = 'w-72',
  disabled = false,
  getId,
}: AutocompleteSearchProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setItems([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await onSearch(query);
        setItems(results);
      } catch (error) {
        console.error('Search error:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(performSearch, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const defaultRenderItem = (item: T, isSelected: boolean) => (
    <div className='flex items-center'>
      <Check
        className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
      />
      {renderValue(item)}
    </div>
  );

  const isItemSelected = (item: T) => {
    if (!selectedValue) return false;
    return getId(item) === getId(selectedValue);
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between bg-inherit'
            disabled={disabled}
          >
            {selectedValue ? renderValue(selectedValue) : placeholder}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('p-0', className)}>
          <div className='flex flex-col w-full lg:min-w-[400px]'>
            <div className='flex items-center border-b px-3'>
              <input
                className='flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className='max-h-[300px] overflow-y-auto'>
              {isLoading ? (
                <div className='flex items-center justify-center py-6'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span className='ml-2 text-sm text-muted-foreground'>
                    Loading...
                  </span>
                </div>
              ) : items.length === 0 ? (
                <div className='py-6 text-center text-sm text-muted-foreground'>
                  {emptyMessage}
                </div>
              ) : (
                <div className='py-2'>
                  {items.map((item) => (
                    <div
                      key={getId(item)}
                      className={cn(
                        'relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none',
                        'hover:bg-accent hover:text-accent-foreground',
                        isItemSelected(item) &&
                          'bg-accent text-accent-foreground'
                      )}
                      onClick={() => {
                        onChange?.(item);
                        setOpen(false);
                      }}
                    >
                      {renderItem
                        ? renderItem(item, isItemSelected(item))
                        : defaultRenderItem(item, isItemSelected(item))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default AutocompleteSearch;
