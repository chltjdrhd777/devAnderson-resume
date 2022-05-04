import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { useSelector } from 'redux/store';
import { themeMode } from 'styles/theme';

interface Props {
  children?: JSX.Element;
}

function Index({ children }: Props) {
  const {
    config: { mode },
  } = useSelector(state => state.user);

  const theme = themeMode(mode);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Index;
