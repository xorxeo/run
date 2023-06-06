import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { EventUploadFile } from '../event-form.typings';
import { RootState } from '@/store';
import { DistanceFormValues, EventFormValues } from '../event-form.schema';
import { selectOptions } from '@/components/select/Select';

export type InputValues = Omit<EventFormValues, 'rules'>;
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
  inputValues: EventFormValues;
  rules: EventUploadFile[];
  distances: {
    newDistances: DistanceFormValues[];
    distancesFromDatabase: DistanceFormValues[];
  };
  images: EventUploadFile[];
  partners: {
    newPartners: PartnersType[];
    partnersFromDatabase: PartnersType[];
  };
  logos: LogoPayloadType[];
  storedPartnersSelectOptions: selectOptions[];
  storedDistancesSelectOptions: selectOptions[];
};

const initialState: InitialState = {
  inputValues: {} as EventFormValues,
  distances: {
    newDistances: [],
    distancesFromDatabase: [],
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

export const eventFormSlice = createSlice({
  name: 'eventFormSlice',
  initialState,
  reducers: {
    storeInputValues: (state, action: PayloadAction<EventFormValues>) => {
      state.inputValues = action.payload;

      if (state.distances.newDistances.length !== 0) {
        state.inputValues.newDistances = [...state.distances.newDistances];
      }
    },
    addRule: (state, action: PayloadAction<EventUploadFile>) => {
      state.rules.push(action.payload);
    },
    deleteRule: (state, action: PayloadAction<String>) => {
      state.rules = [
        ...state.rules.filter((rule) => rule.name !== action.payload),
      ];
    },
    addNewDistance: (state, action: PayloadAction<DistanceFormValues>) => {
      state.distances.newDistances.push(action.payload);
    },
    deleteNewDistance: (state, action: PayloadAction<String>) => {
      state.distances.newDistances = [
        ...state.distances.newDistances.filter(
          (distance) => distance.id !== action.payload
        ),
      ];
    },
    editDistance: (state, action: PayloadAction<DistanceFormValues>) => {
      const editedDistanceIndex = state.distances.newDistances.findIndex(
        (distance) => distance.id === action.payload.id
      );
      if (editedDistanceIndex != -1) {
        state.distances.newDistances[editedDistanceIndex] = action.payload;
        state.distances.newDistances = [...state.distances.newDistances];
      }
    },
    addImages: (state, action: PayloadAction<EventUploadFile>) => {
      state.images.push(action.payload);
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
    addLogo: (state, action: PayloadAction<LogoPayloadType>) => {
      state.logos.push(action.payload);
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
    partnersSelectOptions: (state, action: PayloadAction<selectOptions[]>) => {
      state.storedPartnersSelectOptions = [...action.payload];
    },
    distancesSelectOptions: (state, action: PayloadAction<selectOptions[]>) => {
      state.storedDistancesSelectOptions = [...action.payload];
    },
  },
});

export const {
  addRule,
  deleteRule,
  storeInputValues,
  addNewDistance,
  deleteNewDistance,
  editDistance,
  addImages,
  deleteImage,
  addPartnerFromDatabase,
  addNewPartners,
  addLogo,
  deleteLogo,
  deletePartner,
  partnersSelectOptions,
  distancesSelectOptions,
  // storedSelectDistancesFromDatabaseOptions,
} = eventFormSlice.actions;
export const selectRules = (state: RootState) => state.eventFormSlice.rules;
export const selectInputValues = (state: RootState) =>
  state.eventFormSlice.inputValues;
export const selectNewDistances = (state: RootState) =>
  state.eventFormSlice.distances.newDistances;
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

// export const eventFormSliceReducer = eventFormSlice.reducer;
