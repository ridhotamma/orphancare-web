import { Guardian } from "@/app/types/guardian";

export type GuardianType = {
    id: string;
    type: string;
    name: string;
    guardians?: Set<Guardian>;
    createdAt: Date;
    updatedAt: Date;
  };