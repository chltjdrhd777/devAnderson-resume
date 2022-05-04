import type { AppProps } from 'next/app';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import ThemeProvider from 'Provider/ThemeProvider';
import Global from 'styles/global';

const persistor = persistStore(store);

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <PersistGate loading={null} persistor={persistor}>
          <Global />
          <Component {...pageProps} />
        </PersistGate>
      </ThemeProvider>
    </ReduxProvider>
  );
}
