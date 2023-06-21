import { ThemeProvider } from '@emotion/react';
import React, { PropsWithChildren } from 'react';
import { useSelector } from 'redux/store';
import { themeMode } from 'styles/theme';

function Index({ children }: PropsWithChildren) {
  // redux storage에 저장하고 해당 값을 쓰도록 하자
  // 그렇게 해야 하는 이유도 설명할 것 작성하자.
  const user = useSelector(state => state.user);
  const theme = themeMode(user.config.mode);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Index;
