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
    totalStudentMaleCount: 0,
    previousYearStudentMaleCount: 0,
    studentCount: 0,
    careTakerAdminCount: 0,
    studentMaleDifference: 'N/A',
    previousYearStudentFemaleCount: 0,
    currentYearStudentFemaleCount: 0,
    studentFemaleDifference: 'N/A',
    careTakerCount: 0,
    totalStudentFemaleCount: 0,
    userCount: 0,
    currentYearStudentMaleCount: 0,
    adminCount: 0,
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
  totalStudentMaleCount: number | string
  previousYearStudentMaleCount: number | string
  studentCount: number | string
  careTakerAdminCount: number | string
  studentMaleDifference: number | string,
  previousYearStudentFemaleCount: number | string
  currentYearStudentFemaleCount: number | string
  studentFemaleDifference: number | string,
  careTakerCount: number | string
  totalStudentFemaleCount: number | string
  userCount: number | string
  currentYearStudentMaleCount: number | string
  adminCount: number | string
  studentAdminCount: number | string
  alumniCount: number | string
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
