export type EventUploadFile = { name: string; path: string };

export enum ErrorCodes {
  FileInvalidType = 'wrong type',
  EmptyEventNameInput = 'You must enter event name.',
  EmptyEventInformationInput = 'You must enter event information.',
  InvalidSize = 'Invalid file size',
  InvalidMIMETypesImages = '.jpg, .jpeg, .png and .webp files are accepted.',
  InvalidLinkFormat = `Invalid link format, example 'http://www.ab.cd'`,
}

export enum EventFormInputs {
  eventName = 'eventName',
  information = 'information',
  images = 'images',
  rules = 'rules',
  // partners = 'partners',
  newPartners = 'newPartners',
  partnersFromDatabase = 'partnersFromDatabase',
  newDistances = 'newDistances',
  distancesFromDatabase = 'distancesFromDatabase',
}


