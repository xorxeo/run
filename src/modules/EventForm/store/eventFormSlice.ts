import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { EventRule } from '../event-form.typings';
import { RootState } from '@/store';

type InitialState = {
  rules: EventRule[];
};

const initialState: InitialState = {
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
  },
});

export const { addRule, deleteRule } = eventFormSlice.actions;
export const selectRules = (state: RootState) => state.eventFormSlice.rules;
export const eventFormSliceReducer = eventFormSlice.reducer;
