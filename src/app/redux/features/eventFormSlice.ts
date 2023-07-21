import {
  AnyAction,
  CaseReducerActions,
  PayloadAction,
  ThunkAction,
  createSlice,
} from '@reduxjs/toolkit';

import { EventUploadFile } from '../../../modules/EventForm/event-form.typings';
import { RootState } from '@/app/redux/store';
import {
  DistanceFormValues,
  EventFormValues,
} from '../../../modules/EventForm/event-form.schema';
import { SelectOptions } from '@/components/select/Select';
import { DISTANCE_DEFAULT_VALUES } from '@/modules/EventForm/event-form.schema';
import { Reducer } from 'react';

export type EventFormInputValues = Omit<EventFormValues, 'rules'>;

// export type Distance = Pick<InputValue, 'name'>;
type PartnersType = {
  name: string;
  link: string;
  logoName: string;
};
type LogoPayloadType = {
  index: number;
  logoName: string;
};

export type InitialState = {
  storedEvents: EventFormValues[];

  eventFormValues: EventFormValues;
  draftNewDistanceFormValues: DistanceFormValues;
  rules: EventUploadFile[];
  distances: {
    // newDistances: DistanceFormValues[];
    distancesFromDatabase: DistanceFormValues[];
    isInitialFetched: boolean;
  };
  images: EventUploadFile[];
  partners: {
    newPartners: PartnersType[];
    partnersFromDatabase: PartnersType[];
  };
  logos: EventUploadFile[];
  storedPartnersSelectOptions: SelectOptions[];
  storedDistancesSelectOptions: SelectOptions[];
};

const initialState: InitialState = {
  storedEvents: [] as EventFormValues[],

  eventFormValues: {} as EventFormValues,
  draftNewDistanceFormValues: {} as DistanceFormValues,
  // distanceFormValues: DISTANCE_DEFAULT_VALUES,
  distances: {
    // newDistances: [],
    distancesFromDatabase: [],
    isInitialFetched: false,
  },
  rules: [],
  images: [],
  partners: {
    newPartners: [],
    partnersFromDatabase: [],
  },
  logos: [],
  storedPartnersSelectOptions: [],
  storedDistancesSelectOptions: [],
};

export type EventFormActions = typeof eventFormSlice.caseReducers;

export type EventFormReducer = Reducer<InitialState, PayloadAction<any>>;

export const eventFormSlice = createSlice({
  name: 'eventFormSlice',
  initialState,
  reducers: {
    resetDistanceFormAfterSubmit: (
      state,
      action: PayloadAction<DistanceFormValues>
    ) => {
      state.draftNewDistanceFormValues = action.payload;
    },
    resetEventFormAfterSubmit: (state) => {
      state.eventFormValues = initialState.eventFormValues;
    },

    storeEvents: (state, action: PayloadAction<EventFormValues[]>) => {
      state.storedEvents = [...action.payload];
    },
    deleteEvent: (state, action: PayloadAction<String>) => {
      state.storedEvents = [
        ...state.storedEvents.filter((event) => event.id !== action.payload),
      ];
    },

    storeEventFormValues: (state, action: PayloadAction<EventFormValues>) => {
      state.eventFormValues = action.payload;

      // if (state.distances.newDistances.length !== 0) {
      //   state.eventFormValues.newDistances = [...state.distances.newDistances];
      // }
    },
    storeDraftNewDistanceFormValues: (
      state,
      action: PayloadAction<DistanceFormValues>
    ) => {
      state.draftNewDistanceFormValues = action.payload;
    },
    addRule: (state, action: PayloadAction<EventUploadFile[]>) => {
      state.rules = [...state.rules, ...action.payload];
    },
    deleteRule: (state, action: PayloadAction<String>) => {
      state.rules = [
        ...state.rules.filter((rule) => rule.name !== action.payload),
      ];
    },
    storeDistancesFromDatabase: (
      state,
      action: PayloadAction<DistanceFormValues[]>
    ) => {
      state.distances.distancesFromDatabase = [...action.payload];
    },
    setInitialFetched: (state, action: PayloadAction<boolean>) => {
      state.distances.isInitialFetched = true
    },
    addNewDistance: (state, action: PayloadAction<DistanceFormValues>) => {
      state.distances.distancesFromDatabase.push(action.payload);
    },
    // deleteNewDistance: (state, action: PayloadAction<String>) => {
    //   state.distances.newDistances = [
    //     ...state.distances.newDistances.filter(
    //       (distance) => distance.id !== action.payload
    //     ),
    //   ];
    // },
    deleteStoredDistanceById: (state, action: PayloadAction<String>) => {
      state.distances.distancesFromDatabase = [
        ...state.distances.distancesFromDatabase.filter(
          (distance) => distance.id !== action.payload
        ),
      ];
    },
    storeEditedDistance: (state, action: PayloadAction<DistanceFormValues>) => {
      const editedDistanceIndex =
        state.distances.distancesFromDatabase.findIndex(
          (distance) => distance.id === action.payload.id
        );

      if (editedDistanceIndex != -1) {
        state.distances.distancesFromDatabase[editedDistanceIndex] =
          action.payload;
        state.distances.distancesFromDatabase = [
          ...state.distances.distancesFromDatabase,
        ];
      }
    },
    addImages: (state, action: PayloadAction<EventUploadFile[]>) => {
      state.images = [...state.images, ...action.payload];
    },
    deleteImage: (state, action: PayloadAction<String>) => {
      state.images = [
        ...state.images.filter((image) => image.name !== action.payload),
      ];
    },
    addPartnerFromDatabase: (state, action: PayloadAction<PartnersType[]>) => {
      state.partners.partnersFromDatabase = [...action.payload];
    },
    addNewPartners: (state, action: PayloadAction<PartnersType[]>) => {
      state.partners.newPartners = [...action.payload];
    },
    addLogo: (state, action: PayloadAction<EventUploadFile[]>) => {
      state.logos = [...state.logos, ...action.payload];
      console.log('state.logos', state.logos);
    },
    deleteLogo: (state, action: PayloadAction<number>) => {
      state.logos = [
        ...state.logos.filter((logo) => logo.index !== action.payload),
      ];
      // TODO: delete logo from database
    },
    deletePartner: (state, action: PayloadAction<string>) => {
      state.partners.newPartners = [
        ...state.partners.newPartners.filter(
          (partner) => partner.name !== action.payload
        ),
      ];
    },
    partnersSelectOptions: (state, action: PayloadAction<SelectOptions[]>) => {
      state.storedPartnersSelectOptions = [...action.payload];
    },
    distancesSelectOptions: (state, action: PayloadAction<SelectOptions[]>) => {
      state.storedDistancesSelectOptions = [...action.payload];
    },
  },
});

export const {
  addRule,
  deleteRule,
  storeEventFormValues,
  storeDraftNewDistanceFormValues,
  addNewDistance,
  // deleteNewDistance,
  storeEditedDistance,
  addImages,
  deleteImage,
  addPartnerFromDatabase,
  addNewPartners,
  addLogo,
  deleteLogo,
  deletePartner,
  partnersSelectOptions,
  distancesSelectOptions,
  storeEvents,
  resetDistanceFormAfterSubmit,
  resetEventFormAfterSubmit,
  deleteEvent,
  storeDistancesFromDatabase,
  setInitialFetched,
  deleteStoredDistanceById,

  // storedSelectDistancesFromDatabaseOptions,
} = eventFormSlice.actions;

export const selectRules = (state: RootState) => state.eventFormSlice.rules;
export const selectEventFormValues = (state: RootState) =>
  state.eventFormSlice.eventFormValues;
export const selectDraftNewDistanceFormValues = (state: RootState) =>
  state.eventFormSlice.draftNewDistanceFormValues;
// export const selectNewDistances = (state: RootState) =>
//   state.eventFormSlice.distances.newDistances;
export const selectImages = (state: RootState) => state.eventFormSlice.images;
export const selectLogos = (state: RootState) => state.eventFormSlice.logos;
export const selectNewPartners = (state: RootState) =>
  state.eventFormSlice.partners.newPartners;
export const selectPartnersFromDatabase = (state: RootState) =>
  state.eventFormSlice.partners.partnersFromDatabase;
export const selectPartnersStoredSelectOptions = (state: RootState) =>
  state.eventFormSlice.storedPartnersSelectOptions;
export const selectDistancesStoredSelectOptions = (state: RootState) =>
  state.eventFormSlice.storedDistancesSelectOptions;

export const selectDistancesFromDatabase = (state: RootState) =>
  state.eventFormSlice.distances.distancesFromDatabase;

export const selectIsInitialFetched = (state: RootState) =>
  state.eventFormSlice.distances.isInitialFetched;

export const selectEventsFromDatabase = (state: RootState) =>
  state.eventFormSlice.storedEvents;

export const eventFormSliceReducer = eventFormSlice.reducer;
