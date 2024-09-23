'use client';

import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Moon, Sun } from 'lucide-react';

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <nav className='py-4 px-6 flex justify-between items-center border-b'>
        <h1 className='text-2xl font-bold text-primary'>OMS</h1>
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                <span className='sr-only'>Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuLabel>Theme Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value='light'>
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='dark'>Dark</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='system'>
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href='/auth/login'>
            <Button variant='outline'>Log In</Button>
          </Link>
        </div>
      </nav>

      <main className='flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='text-4xl sm:text-5xl font-extrabold text-primary mb-6'>
            Orphanage Management System
          </h2>
          <p className='text-xl sm:text-2xl text-muted-foreground mb-8'>
            Empowering caregivers, nurturing futures. Streamline your orphanage
            operations with our comprehensive management solution.
          </p>
          <Link href='/auth/login'>
            <Button size='lg'>Get Started</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
