import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import { FirebaseContainer } from '@/containers/FirebaseContainer';
import { AuthUserProvider } from '@/containers/AuthUserContainer';
import { storeWrapper } from '@/store';
import '@/styles/globals.css';

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = storeWrapper.useWrappedStore(rest);
  const { pageProps } = props;

  return (
    <Provider store={store}>
      <FirebaseContainer>
        <AuthUserProvider>
          <Component {...pageProps} />
        </AuthUserProvider>
      </FirebaseContainer>
    </Provider>
  );
}
