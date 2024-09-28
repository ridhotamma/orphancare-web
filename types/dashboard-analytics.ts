export type DashboardAnalytics = {
  latestDonations: ShortDonation[];
  latestEvents: ShortEvent[];
  profile: ShortProfile;
  topDonors: TopDonor[];
  inventory: ShortInventory;
  donationTrends: DonationTrend[];
  donationTypeDistribution: DonationTypeDistribution[];
  bedroom: ShortBedRoom;
  totalDonationAmount: TotalDonationAmount[];
};

export const initialDashboardState = (): DashboardAnalytics => ({
  latestDonations: [],
  latestEvents: [],
  profile: {
    previousYearFemaleCount: 0,
    previousYearMaleCount: 0,
    userCount: 0,
    currentYearMaleCount: 0,
    maleCount: 0,
    adminCount: 0,
    currentYearFemaleCount: 0,
    maleDifference: '0%',
    femaleCount: 0,
    femaleDifference: '0%',
    careTakerCount: 0,
    studentCount: 0,
    careTakerAdminCount: 0,
    studentAdminCount: 0,
    alumniCount: 0,
  },
  topDonors: [],
  inventory: {
    total: 0,
    details: [],
  },
  donationTrends: [],
  donationTypeDistribution: [],
  bedroom: {
    total: 0,
    details: [],
  },
  totalDonationAmount: [],
});

export type ShortDonation = {
  id: string;
  donationType: string;
  amount: string;
  donatorName: string;
  receivedDate: string;
};

export type ShortEvent = {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  place: string;
  name: string;
  organizerPhoneNumber: string;
  organizer: string;
};

export type ShortProfile = {
  previousYearFemaleCount: number;
  previousYearMaleCount: number;
  userCount: number;
  currentYearMaleCount: number;
  maleCount: number;
  adminCount: number;
  currentYearFemaleCount: number;
  maleDifference: string;
  femaleCount: number;
  femaleDifference: string;
  careTakerCount: number;
  studentCount: number;
  careTakerAdminCount: number;
  studentAdminCount: number,
  alumniCount: number,
};

export type TopDonor = {
  donator: string;
  donationName: string;
  amount: string;
};

export type ShortInventory = {
  total: number;
  details: InventoryDetail[];
};

export type InventoryDetail = {
  inventory_type_name: string;
  count: number;
};

export type DonationTrend = {
  month: string;
  [key: string]: number | string;
};

export type DonationTypeDistribution = {
  name: string;
  amount: number;
};

export type ShortBedRoom = {
  total: number;
  details: BedroomDetail[];
};

export type BedroomDetail = {
  bedroom_type_name: string;
  count: number;
};

export type TotalDonationAmount = {
  name: string;
  amount: string;
};
