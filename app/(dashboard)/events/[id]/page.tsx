'use client'

import EventFormPage from '@/components/events/event-form-page';
import { usePageTitle } from '@/hooks/use-page-title';

const EventCreatePage = () => {
  usePageTitle('Event Detail');
  return <EventFormPage />;
};

export default EventCreatePage;
