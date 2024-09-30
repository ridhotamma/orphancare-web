'use client'

import BedRoomDetail from '@/components/bedrooms/detail-bedroom';
import { mockBedRooms } from '@/data/mockup/bedroom-mockup';
import { usePageTitle } from '@/hooks/use-page-title';

const BedRoomDetailPage = () => {
    usePageTitle('Bedroom Detail')
  return <BedRoomDetail bedRoom={mockBedRooms[0]} />;
};

export default BedRoomDetailPage;
