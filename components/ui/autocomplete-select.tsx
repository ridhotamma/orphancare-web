import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
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

type Item = {
  value: string;
  label: string;
};

type AutocompleteProps = {
  items: Item[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  value?: Item | null;
  onChange?: (item: Item | null) => void;
};

const AutocompleteSelect = ({
  items,
  placeholder = 'Select an item...',
  searchPlaceholder = 'Search items...',
  emptyMessage = 'No item found.',
  className = 'w-72',
  value: initialValue = null,
  onChange,
}: AutocompleteProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(
    initialValue
  );

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
            className='w-full justify-between'
          >
            {selectedItem ? selectedItem.label : placeholder}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('p-0', className)}>
          <Command>
            <CommandInput placeholder={searchPlaceholder}/>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandList>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    setSelectedItem(item);
                    onChange?.(item);
                    setOpen(false);
                  }}
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
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AutocompleteSelect;
