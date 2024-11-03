import { Donation } from '@/types/donation';
import { DonationType } from '@/types/donation-type';
import { Unit } from '@/types/unit';

const donationTypes: DonationType[] = [
  {
    id: '1',
    name: 'Food',
    type: 'Goods',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Clothing',
    type: 'Goods',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Money',
    type: 'Financial',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Books',
    type: 'Goods',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Toys',
    type: 'Goods',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const units: Unit[] = [
  {
    id: '1',
    name: 'kg',
    type: 'Weight',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'pieces',
    type: 'Quantity',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'USD',
    type: 'Currency',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'boxes',
    type: 'Quantity',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockDonations: Donation[] = [
  {
    id: '1',
    name: 'Canned Food Drive',
    amount: 250,
    receivedDate: new Date('2024-09-15').toLocaleDateString(),
    receiver: 'Local Food Bank',
    donatorName: 'John Doe',
    donationType: donationTypes[0], // Food
    unit: units[0], // kg
    createdAt: new Date('2024-09-14'),
    updatedAt: new Date('2024-09-15'),
    unitId: null,
  },
  {
    id: '2',
    name: 'Winter Coat Collection',
    amount: 50,
    receivedDate: new Date('2024-10-01').toLocaleDateString(),
    receiver: 'Homeless Shelter',
    donatorName: 'Jane Smith',
    donationType: donationTypes[1], // Clothing
    unit: units[1], // pieces
    createdAt: new Date('2024-09-30'),
    updatedAt: new Date('2024-10-01'),
    unitId: null,
  },
  {
    id: '3',
    name: 'Annual Fundraiser',
    amount: 10000,
    receivedDate: new Date('2024-11-15').toLocaleDateString(),
    receiver: "Children's Hospital",
    donatorName: 'Tech Corp Inc.',
    donationType: donationTypes[2], // Money
    unit: units[2], // USD
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
    unitId: null,
  },
  {
    id: '4',
    name: 'School Supply Drive',
    amount: 1000,
    receivedDate: new Date('2024-08-20').toLocaleDateString(),
    receiver: 'Underprivileged Schools',
    donatorName: 'Local Bookstore',
    donationType: donationTypes[3], // Books
    unit: units[1], // pieces
    createdAt: new Date('2024-08-19'),
    updatedAt: new Date('2024-08-20'),
    unitId: null,
  },
  {
    id: '5',
    name: 'Holiday Toy Collection',
    amount: 5,
    receivedDate: new Date('2024-12-10').toLocaleDateString(),
    receiver: "Children's Welfare Center",
    donatorName: 'Toy Store Chain',
    donationType: donationTypes[4], // Toys
    unit: units[3], // boxes
    createdAt: new Date('2024-12-09'),
    updatedAt: new Date('2024-12-10'),
    unitId: null,
  },
  {
    id: '6',
    name: 'Emergency Food Relief',
    amount: 500,
    receivedDate: new Date('2024-07-05').toLocaleDateString(),
    receiver: 'Disaster Relief Organization',
    donatorName: 'Anonymous Donor',
    donationType: donationTypes[0], // Food
    unit: units[0], // kg
    createdAt: new Date('2024-07-04'),
    updatedAt: new Date('2024-07-05'),
    unitId: null,
  },
  {
    id: '7',
    name: 'Back-to-School Backpack Drive',
    amount: 200,
    receivedDate: new Date('2024-08-25').toLocaleDateString(),
    receiver: 'Local School District',
    donatorName: 'Community Association',
    donationType: donationTypes[1], // Clothing (considering backpacks as clothing)
    unit: units[1], // pieces
    createdAt: new Date('2024-08-24'),
    updatedAt: new Date('2024-08-25'),
    unitId: null,
  },
  {
    id: '8',
    name: 'Library Book Donation',
    amount: 1500,
    receivedDate: new Date('2024-06-15').toLocaleDateString(),
    receiver: 'City Public Library',
    donatorName: 'Book Publishers Association',
    donationType: donationTypes[3], // Books
    unit: units[1], // pieces
    createdAt: new Date('2024-06-14'),
    updatedAt: new Date('2024-06-15'),
    unitId: null,
  },
];
