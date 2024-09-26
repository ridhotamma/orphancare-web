import { EventStatus } from "@/types/enums";

export type Event = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  organizer: string;
  status: EventStatus;
  organizerPhoneNumber: string;
  place: string;
  createdAt: Date;
  updatedAt: Date;
};
