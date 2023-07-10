import Document, { Html, Head, Main, NextScript } from 'next/document';
import * as React from 'react';

export default class AppDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preload" href="/fonts/NotoSans-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
