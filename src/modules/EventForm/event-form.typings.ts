import { DistanceFormValues } from '@/components/CreateDistance';

export type EventRule = { name: string; path: string };

export type EventFormValues = {
  eventName: string;
  information: string;
  distances: DistanceFormValues[];
  rules: EventRule[];
};

export enum ErrorCodes {
  invalidTypes = 'wrong type',
}
