// import { createWrapper } from 'next-redux-wrapper';

import { eventFormSlice } from '@/app/redux/features/eventFormSlice';
import { configureStore } from '@reduxjs/toolkit';
import { MapCreatorSlice } from './features/MapCreatorSlice';

export const store = 
  configureStore({
    reducer: {
      [eventFormSlice.name]: eventFormSlice.reducer, 
      [MapCreatorSlice.name]: MapCreatorSlice.reducer,
    },
    devTools: true,
    
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

  // export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
// export const storeWrapper = createWrapper(makeStore);
// export type AppDispatch = typeof store.dispatch;
