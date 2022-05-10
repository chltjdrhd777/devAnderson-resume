import type { AppProps } from 'next/app';

import ThemeProvider from 'Provider/ThemeProvider';
import Global from 'styles/global';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <>
        <Global />
        <Component {...pageProps} />

        <div
          id="portal"
          style={{
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        ></div>
      </>
    </ThemeProvider>
  );
}
