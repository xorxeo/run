export type EventRule = { name: string; path: string };

export type InputValue = { name: string; value: string };

export enum ErrorCodes {
  FileInvalidType = 'wrong type',
  EmptyEventNameInput = 'You must enter your event name.',
  EmptyEventInformationInput = 'You must enter event information.',
}

export enum EventFormInputs {
  eventName = 'eventName',
  information = 'information',
  distances = 'distances',
}
