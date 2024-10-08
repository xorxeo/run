import { DistanceFormValues, PartnerFormValues } from "../../event-form.schema";

export const FIVE_MB = 5_242_880;
export const ONE_MB = 466_700;
export const FIFTY_KB = 51_200;
export const ACCEPTED_IMAGE_MIME_TYPES = 'image/jpeg, image/png, image/webp';
export const ACCEPTED_RULES_MIME_TYPES = 'application/pdf, application/msword';

export const PHONE_NUMBER_INPUT_MASK = {
  mask: '+ _ (___) ___-__-__',
  replacement: '_',
};

export const WEB_LINK_INPUT_MASK = {
  mask: 'http://www._________________________',
  replacement: '_',
};

export const DISTANCES_SELECT_OPTIONS: DistanceFormValues[] = [
  {
    id: 'gdgdgff',
    
      name: 'Distance 1',
      cost: '111',
      distanceLength: '111',
      linkToDownloadDistanceRoute: 'www.google.com',
      linkToViewDistanceRouteOnTheMap: 'www.gogoogle.com',
      refreshmentPoints: '3',
      longitude: '50',
      latitude: '50',
      startPointDescription: 'dgfgdfgdf',
      startTime: '1200',
      timeLimit: '12',
      totalElevation: '12',
    },
 
  {
    id: '24324234',
   
      name: 'Distance 2',
      cost: '222',
      distanceLength: '222',
      linkToDownloadDistanceRoute: 'www.google.com',
      linkToViewDistanceRouteOnTheMap: 'www.gogoogle.com',
      refreshmentPoints: '2',
      longitude: '20',
      latitude: '20',
      startPointDescription: 'fsdfsdfsdfdgfgdfgdf',
      startTime: '2000',
      timeLimit: '22',
      totalElevation: '22',
    },
 
  {
    id: 'gdfg2342343',
    
      name: 'Distance 3',
      cost: '333',
      distanceLength: '333',
      linkToDownloadDistanceRoute: 'www.google.com',
      linkToViewDistanceRouteOnTheMap: 'www.gogoogle.com',
      refreshmentPoints: '4',
      longitude: '30',
      latitude: '30',
      startPointDescription: '333333dgfgdfgdf',
      startTime: '1300',
      timeLimit: '3',
      totalElevation: '33',
    },
 
];

export const PARTNERS_FROM_DATABASE: PartnerFormValues[] = [
  {
    id: '13fsdfs',
    name: 'Partner 1',
    link: 'www.google.com',
    logoName: 'logo1',
  },
  {
    id: '23434234dfsdfs',
    name: 'Partner 2',
    link: 'www.fsdfsdfsd.com',
    logoName: 'logo2',
  },
  {
    id: '3dasdad423434',
    name: 'Partner 3',
    link: 'www.sdfjjkhjk.com',
    logoName: 'logo3',
  },
];
