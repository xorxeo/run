import { z } from 'zod';
import { ErrorCodes } from './event-form.typings';
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  FIFTY_KB,
  FIVE_MB,
} from '@/modules/EventForm/components/create-event-form/create-event-form.consts';

const URL_REG_EXP =
  /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,}).?/

export const partnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.string(),
  logoName: z.string(),
});

export const distancesSchema = z.object({
  id: z.string(),
  
    name: z.string().min(3),
    cost: z.string(),
    distanceLength: z.string(),
    linkToDownloadDistanceRoute: z.union([
      z.literal(''),
      z.string().regex(URL_REG_EXP, { message: ErrorCodes.InvalidLinkFormat }),
    ]),
    linkToViewDistanceRouteOnTheMap: z.union([
      z.literal(''),
      z.string().regex(URL_REG_EXP, { message: ErrorCodes.InvalidLinkFormat }),
    ]),
    refreshmentPoints: z.string(),
    longitude: z
      .string()
      .refine((val) => Number(val) >= -180 && Number(val) <= 180, {
        message: 'value must be between -180 and 180',
      }),
    latitude: z
      .string()
      .refine((val) => Number(val) >= -90 && Number(val) <= 90, {
        message: 'value must be between -90 and 90',
      }),
    startPointDescription: z.string(),
    startTime: z.string(),
    timeLimit: z.string(),
    totalElevation: z.string(),
 
});

export const eventFormSchema = z.object({
  eventName: z.string().min(1, { message: ErrorCodes.EmptyEventNameInput }),
  information: z
    .string()
    .min(1, { message: ErrorCodes.EmptyEventInformationInput }),
  newDistances: z.array(distancesSchema),
  distancesFromDatabase: z.array(distancesSchema),
  rules: z.array(z.object({ name: z.string(), path: z.string() })),
  images: z.any().refine(
    (files) => {
      const invalidSizeFiles = [] as string[];
      for (let { size, name } of files) {
        if (size > FIFTY_KB) {
          invalidSizeFiles.push(name);
        }
      }
      return !(invalidSizeFiles.length > 0);
    },
    { message: ErrorCodes.InvalidSize }
  ),
  partnersFromDatabase: z.array(partnerSchema),
  newPartners: z.array(partnerSchema),
 
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export type DistanceFormValues = z.infer<typeof distancesSchema>;

export type PartnerFormValues = z.infer<typeof partnerSchema>;
