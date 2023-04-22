import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { EventRule, InputValue } from '../event-form.typings';
import { RootState } from '@/store';
import {
  DistanceFormValues,
  EventFormValues,
} from '../components/create-event-form/createForm.schema';

export type InputValues = Omit<EventFormValues, 'rules'>;
// export type Distance = Pick<InputValue, 'name'>;

type InitialState = {
  inputValues: InputValues;
  rules: EventRule[];
  distances: DistanceFormValues[];
};

const initialState: InitialState = {
  inputValues: {} as InputValues,
  distances: [],
  rules: [],
};

export const eventFormSlice = createSlice({
  name: 'eventFormSlice',
  initialState,
  reducers: {
    addRule: (state, action: PayloadAction<EventRule>) => {
      state.rules.push(action.payload);
    },
    deleteRule: (state, action: PayloadAction<String>) => {
      state.rules = state.rules.filter((rule) => rule.name !== action.payload);
    },
    storeInputValues: (state, action: PayloadAction<InputValues>) => {
      state.inputValues = action.payload;
      console.log('storeInputValues', action.payload);
    },
    addDistance: (state, action: PayloadAction<DistanceFormValues>) => {
      console.log('>>> action.payload', action.payload);
      state.distances.push(action.payload);
    },
    deleteDistance: (state, action: PayloadAction<String>) => {
      state.distances = [
        ...state.distances.filter((distance) => distance.id !== action.payload),
      ];
      console.log('deleteDistance', action.payload);
    },
    editDistance: (state, action: PayloadAction<DistanceFormValues>) => {
      const editedDistanceIndex = state.distances.findIndex(
        (distance) => distance.id === action.payload.id
      );

      if (editedDistanceIndex != -1) {
        state.distances[editedDistanceIndex] = action.payload;

        state.distances = [...state.distances];
      }
    },
  },
});

export const {
  addRule,
  deleteRule,
  storeInputValues,
  addDistance,
  deleteDistance,
  editDistance,
} = eventFormSlice.actions;
export const selectRules = (state: RootState) => state.eventFormSlice.rules;
export const selectInputValues = (state: RootState) =>
  state.eventFormSlice.inputValues;
export const selectDistances = (state: RootState) =>
  state.eventFormSlice.distances;

// export const eventFormSliceReducer = eventFormSlice.reducer;
