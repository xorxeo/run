import { createWrapper } from 'next-redux-wrapper';

import {
  eventFormSlice,
  eventFormSliceReducer,
} from '@/modules/EventForm/store/eventFormSlice';
import { configureStore } from '@reduxjs/toolkit';

const makeStore = () =>
  configureStore({
    reducer: { [eventFormSlice.name]: eventFormSlice.reducer },
    devTools: true,
  });

export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
export const storeWrapper = createWrapper(makeStore);
