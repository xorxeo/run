export type EventUploadFile = { name: string; path: string; index?: number };

export enum ErrorCodes {
  FileInvalidType = 'wrong type',
  EmptyEventNameInput = 'You must enter event name.',
  EmptyEventInformationInput = 'You must enter event information.',
  InvalidSize = 'Invalid file size',
  InvalidMIMETypesImages = '.jpg, .jpeg, .png and .webp files are accepted.',
  InvalidLinkFormat = `Invalid link format, example 'http://www.ab.cd'`,
}

export const eventFormInputsNames = {
  id: 'id',
  eventName: 'eventName',
  information: 'information',
  images: 'images',
  rules: 'rules',
  // partners = 'partners',
  newPartners: 'newPartners',
  partnersFromDatabase: 'partnersFromDatabase',
  newDistances: 'newDistances',
  distancesFromDatabase: 'distancesFromDatabase',
};

export const distanceFormInputsNames = {
  id: 'id',
  distanceName: 'distanceName',
  cost: 'cost',
  distanceLength: 'distanceLength',
  linkToDownloadDistanceRoute: 'linkToDownloadDistanceRoute',
  linkToViewDistanceRouteOnTheMap: 'linkToViewDistanceRouteOnTheMap',
  refreshmentPoints: 'refreshmentPoints',
  longitude: 'longitude',
  latitude: 'latitude',
  startPointDescription: 'startPointDescription',
  startTime: 'startTime',
  timeLimit: 'timeLimit',
  totalElevation: 'totalElevation',
};

export const formInputs = {
  distanceFormInputsNames,
  eventFormInputsNames,
};
