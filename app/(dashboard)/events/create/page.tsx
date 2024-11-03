'use client'

import EventFormPage from '@/components/events/event-form-page';
import { usePageTitle } from '@/hooks/use-page-title';

const EventCreatePage = () => {
  usePageTitle('Tambah Data Event');
  return <EventFormPage />;
};

export default EventCreatePage;
