// import { createWrapper } from 'next-redux-wrapper';

import { eventFormSlice } from '@/app/redux/features/eventFormSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = 
  configureStore({
    reducer: {
      [eventFormSlice.name]: eventFormSlice.reducer, 
    },
    devTools: true,
    
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

  // export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
// export const storeWrapper = createWrapper(makeStore);
// export type AppDispatch = typeof store.dispatch;
