import { css, SerializedStyles, keyframes } from '@emotion/react';

export const colors = {
  black: 'rgb(17 24 39)',
  white: 'rgb(243 244 246)',
  indigo: 'rgb(31 41 55)',
  grayOne: '#F7F7F7',
  grayTwo: '#E5E5E5',
  grayThree: '#707070',
  grayFour: '#5a5a5a',
  pointColorPurple: '#ad8bf6',
  pointColorYello: '#ffc114',
  pointColorCarrot: '#ff5248',
  pointColorBrown: '#E1AD49',
  pointColorMint: '#19cdca',
  pointColorBlue: '#4e80e1',
  pointColorGreen: '#6ddb00',
  lightblue: '#C5E2EE',
  footerColor: '#313131',
  mainColor: '#E7286A',
  waringColor: '#ff3838',
  starColor: '#fd4',
} as const;

export const gradients = {
  pointGraidentBlue: css`
    background: linear-gradient(
      to right,
      ${colors.pointColorBlue},
      ${colors.pointColorMint}
    );
  `,
} as const;

//breackpoint
type DeviceSize =
  | 'mobile(375px)'
  | 'tablet(768px)'
  | 'web(1024px)'
  | 'monitor(1440px)';
export const genMedia = (deviceSize: DeviceSize, styling: SerializedStyles) => {
  const sizes = {
    mobile: '375px',
    tablet: '768px',
    web: '1024px',
    monitor: '1440px',
  };
  const sliceIndex = deviceSize.indexOf('(');
  const targetSize = deviceSize.slice(0, sliceIndex);

  return css`
    @media screen and (min-width: ${sizes[targetSize]}) {
      ${styling}
    }
  `;
};

export const Mobile = () => {};

export const Tablet = (styling: SerializedStyles) => {
  return css`
    @media screen and (min-width: 768px) {
      ${styling}
    }
  `;
};

//cetering
export const middle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const centerRow = css`
  ${middle}
  justify-content: initial;
`;

export const centerCol = css`
  ${middle}
  flex-direction: column;
  justify-content: initial;
`;

//! animations
export const animations = {
  rotate: keyframes`
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
  `,
  fadeIn: keyframes`
    0%{
      opacity:0;
      transform: translateY(3rem);
    }
    100%{
      opacity:1;
      transform: translateY(0rem);
    }
  `,
  fadeInOut: keyframes`
       0%  {opacity: 0}
       20% {opacity: 0}
       50% {opacity: 1}
       100%{opacity: 0}
  `,
};

export type ModeType = 'white' | 'dark';

export const themeMode = (mode: ModeType) => {
  const commonCSS = {
    middle,
    centerRow,
    centerCol,
    animations,
  };

  const modeCSS = {
    backgroundColor: mode === 'white' ? 'white' : colors.indigo,
    fontColor: mode === 'white' ? colors.black : colors.white,
    pointColor:
      mode === 'white' ? colors.pointColorBlue : colors.pointColorYello,
    linkColor:
      mode === 'white' ? colors.pointColorGreen : colors.pointColorMint,
  } as const;

  return {
    ...commonCSS,
    ...modeCSS,
  };
};

export type ThemeType = ReturnType<typeof themeMode>;
