'use client'

import DonationFormPage from '@/components/donations/donation-form-page';
import { usePageTitle } from '@/hooks/use-page-title';

const DonationEditPage = () => {
  usePageTitle('Donation Detail');
  return <DonationFormPage />;
};

export default DonationEditPage;
