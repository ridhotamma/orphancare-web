'use client'

import DonationFormPage from '@/components/donations/donation-form-page';
import { usePageTitle } from '@/hooks/use-page-title';

const DonationCreatePage = () => {
  usePageTitle('Tambah Pemberian Donasi');
  return <DonationFormPage />;
};

export default DonationCreatePage;
