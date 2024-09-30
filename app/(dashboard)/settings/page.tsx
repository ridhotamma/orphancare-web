'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Pencil, X, Save } from 'lucide-react';
import Link from 'next/link';
import IndonesiaFlag from '@/images/indonesia.png';
import UKFlag from '@/images/united-kingdom.png';
import JapanFlag from '@/images/japan.png';
import Image from 'next/image';

type Locale = 'en' | 'id' | 'ja';

const AppSettingsPage: React.FC = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [locale, setLocale] = useState<Locale>('en');
  const [donationsEnabled, setDonationsEnabled] = useState(true);
  const [childSubmissionOpen, setChildSubmissionOpen] = useState(true);

  const handleLocaleChange = (value: Locale) => {
    setLocale(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting settings:', {
      locale,
      donationsEnabled,
      childSubmissionOpen,
    });
    setIsEdit(false);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  return (
    <div className='container mx-auto px-0 lg:px-20'>
      <div className='flex items-center justify-between mb-6'>
        <Button variant='link' className='p-0' asChild>
          <Link href='/dashboard'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Dashboard
          </Link>
        </Button>
        {isEdit ? (
          <div className='space-x-2'>
            <Button variant='outline' onClick={handleCancel}>
              <X className='h-4 w-4 mr-2' />
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className='h-4 w-4 mr-2' />
              Save Settings
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEdit(true)}>
            <Pencil className='h-4 w-4 mr-2' />
            Edit Settings
          </Button>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='locale'>Localization</Label>
              <Select
                onValueChange={handleLocaleChange}
                value={locale}
                disabled={!isEdit}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select language' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='en'>
                    <div className='flex items-center gap-2'>
                      <Image
                        src={IndonesiaFlag}
                        alt='indonesian flag'
                        width={20}
                        height={20}
                      />
                      Indonesian
                    </div>
                  </SelectItem>
                  <SelectItem value='id'>
                    <div className='flex items-center gap-2'>
                      <Image
                        src={UKFlag}
                        alt='indonesian flag'
                        width={20}
                        height={20}
                      />
                      English
                    </div>
                  </SelectItem>
                  <SelectItem value='ja'>
                    <div className='flex items-center gap-2'>
                      <Image
                        src={JapanFlag}
                        alt='indonesian flag'
                        width={20}
                        height={20}
                      />
                      Japanese
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center justify-between'>
              <Label htmlFor='donations-feature'>
                Enable Donations Feature
              </Label>
              <Switch
                id='donations-feature'
                checked={donationsEnabled}
                onCheckedChange={setDonationsEnabled}
                disabled={!isEdit}
              />
            </div>
            <div className='flex items-center justify-between'>
              <Label htmlFor='child-submission'>
                Open New Child Submission
              </Label>
              <Switch
                id='child-submission'
                checked={childSubmissionOpen}
                onCheckedChange={setChildSubmissionOpen}
                disabled={!isEdit}
              />
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default AppSettingsPage;
