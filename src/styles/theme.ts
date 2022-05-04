import { css, SerializedStyles } from '@emotion/react';

export const colors = {
  black: '#2b2b2b',
  white: '#FFFFFF',
  indigo: '#181F38',
  grayOne: '#F7F7F7',
  grayTwo: '#E5E5E5',
  grayThree: '#707070',
  grayFour: '#5a5a5a',
  pointColorPurple: '#ad8bf6',
  pointColorYello: '#ffc114',
  pointColorCarrot: '#ff5248',
  pointColorMint: '#19cdca',
  pointColorBlue: '#4e80e1',
  lightblue: '#C5E2EE',
  footerColor: '#313131',
  mainColor: '#E7286A',
  waringColor: '#ff3838',
  starColor: '#fd4',
} as const;

//breackpoint
export const Md = (styling: SerializedStyles) => {
  return css`
    @media screen and (min-width: 768px) {
      ${styling}
    }
  `;
};

export type ModeType = 'white' | 'dark';

export const themeMode = (mode: ModeType) =>
  ({
    backgroundColor:
      mode === 'white' ? '#ffffff' : mode === 'dark' ? '#212021' : '',
    fontColor: mode === 'white' ? '#212021' : mode === 'dark' ? '#ffffff' : '',
  } as const);

export type ThemeType = ReturnType<typeof themeMode>;
