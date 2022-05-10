import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { themeMode } from 'styles/theme';

interface Props {
  children?: JSX.Element;
}

function Index({ children }: Props) {
  const theme = themeMode('white');

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Index;
