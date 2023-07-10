import type { AppProps } from 'next/app';
import Head from 'next/head';

import ThemeProvider from 'Provider/ThemeProvider';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from 'redux/store';
import { RecoilRoot } from 'recoil';
import Global from 'styles/global';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>프론트엔드 이력서_최우철</title>
      </Head>

      <Provider store={store}>
        <PersistGate persistor={persistStore(store)}>
          <RecoilRoot>
            <ThemeProvider>
              <Global />
              <Component {...pageProps} />
            </ThemeProvider>
          </RecoilRoot>
        </PersistGate>
      </Provider>
    </>
  );
}
