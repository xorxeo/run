'use client';

import { StoreProvider } from './redux/provider';
import { ReactNode } from 'react';
import { AuthContextProvider, useAuthContext } from '@/context/AuthContext';
import { MantineProvider, createEmotionCache } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';


const myCache = createEmotionCache({
  key: 'mantine',
  prepend: false,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      emotionCache={myCache}
      // theme={{}}
     
      withGlobalStyles
      withNormalizeCSS
    >
      <ModalsProvider>
        <StoreProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </StoreProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
