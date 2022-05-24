import type { AppProps } from 'next/app';

import ThemeProvider from 'Provider/ThemeProvider';
import Global from 'styles/global';
//context API로 theme 관리하기
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <>
        <Global />
        <Component {...pageProps} />
      </>
    </ThemeProvider>
  );
}
