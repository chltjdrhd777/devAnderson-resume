import type { AppProps } from 'next/app';

import ThemeProvider from 'Provider/ThemeProvider';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from 'redux/store';
import Global from 'styles/global';
//context API로 theme 관리하기
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistStore(store)}>
        <ThemeProvider>
          <Global />
          <Component {...pageProps} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
