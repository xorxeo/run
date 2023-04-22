import { z } from 'zod';
import { ErrorCodes } from '../../event-form.typings';

export const distancesSchema = z.object({
  id: z.string(),
  value: z.object({
    name: z.string(),
    // .refine(
    //   (name) => {
    //     if (
    //       !isEdit &&
    //       DTO.distancesState.some((distance) => distance.name === name)
    //     ) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   { message: 'Same name' }
    // ),
    cost: z.coerce.number(),
    distanceLength: z.coerce.number(),
    linkToDownloadDistanceRoute: z.string(),
    linkToViewDistanceRouteOnTheMap: z.string(),
    refreshmentPoints: z.coerce.number(),
    longitude: z.coerce.number(),
    latitude: z.coerce.number(),
    startPointDescription: z.string(),
    startTime: z.string(),
    timeLimit: z.string(),
    totalElevation: z.string(),
    // images: z
    //   .any()
    //   .refine(
    //     (files) => {
    //       invalidSizeFiles = [] as string[];
    //       for (let { size, name } of files) {
    //         if (size > FIVE_MB) {
    //           invalidSizeFiles.push(name);
    //         }
    //       }
    //       return !(invalidSizeFiles.length > 0);
    //     },
    //     { message: FilesErrorCodes.InvalidSize }
    //   )
    //   .refine(
    //     (files) => {
    //       InvalidMIMETypesFiles = [] as string[];
    //       for (let { type, name } of files) {
    //         if (!ACCEPTED_IMAGE_MIME_TYPES.includes(type)) {
    //           InvalidMIMETypesFiles.push(name);
    //         }
    //       }
    //       return !(InvalidMIMETypesFiles.length > 0);
    //     },
    //     { message: FilesErrorCodes.InvalidMIMETypes }
    //   ),
  }),
});

export const eventFormSchema = z.object({
  eventName: z.string().min(1, { message: ErrorCodes.EmptyEventNameInput }),
  information: z
    .string()
    .min(1, { message: ErrorCodes.EmptyEventInformationInput }),
  distances: z.array(distancesSchema),
  rules: z.array(z.object({ name: z.string(), path: z.string() })),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export type DistanceFormValues = z.infer<typeof distancesSchema>;
