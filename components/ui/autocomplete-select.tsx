import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export type AutocompleteItem = {
  value: string;
  label: string;
};

type AutocompleteProps = {
  items: AutocompleteItem[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  value?: AutocompleteItem | null;
  onChange?: (item: AutocompleteItem | null) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  disabled?: boolean; // Added disabled prop
};

const AutocompleteSelect = ({
  items,
  placeholder = 'Select an item...',
  searchPlaceholder = 'Search items...',
  emptyMessage = 'No item found.',
  className = 'w-72',
  value: initialValue = null,
  onChange,
  isLoading = false,
  loadingMessage = 'Loading items...',
  disabled = false,
}: AutocompleteProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] =
    React.useState<AutocompleteItem | null>(initialValue);

  React.useEffect(() => {
    setSelectedItem(initialValue);
  }, [initialValue]);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between bg-inherit'
            disabled={disabled || isLoading}
          >
            {isLoading ? (
              <div className='flex items-center'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {loadingMessage}
              </div>
            ) : (
              <>
                {selectedItem ? selectedItem.label : placeholder}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('p-0', className)}>
          <Command>
            <CommandInput placeholder={searchPlaceholder} disabled={disabled} />
            {isLoading ? (
              <div className='py-6 text-center'>
                <Loader2 className='mx-auto h-4 w-4 animate-spin' />
                <p className='mt-2 text-sm text-muted-foreground'>
                  {loadingMessage}
                </p>
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandList className='w-full lg:min-w-[300px]'>
                  {items.map((item, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => {
                        setSelectedItem(item);
                        onChange?.(item);
                        setOpen(false);
                      }}
                      disabled={disabled}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedItem?.value === item.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AutocompleteSelect;
