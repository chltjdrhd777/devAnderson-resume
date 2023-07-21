import { Global, Theme, css, useTheme } from '@emotion/react';

function GlobalStyle() {
  const theme = useTheme();

  const globalCSS = (theme: Theme) => css`
    :root {
      --zIndex-1st: 10000;
      --zIndex-2st: 9000;
      --zIndex-3st: 8000;
    }

    @font-face {
      font-family: 'NotoSansKR';
      src: url('/fonts/NotoSans-Regular.woff') format('woff');
      font-style: normal;
      font-weight: normal;
      font-display: '';
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      word-break: keep-all;
    }
    html {
      font-size: 62.5%;
      scroll-behavior: smooth;
      overflow-x: hidden;
      background-color: ${theme.backgroundColor};
    }
    body {
      font-size: 1.6rem;
      font-family: 'NotoSansKR', sans-serif;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
    }
    a {
      text-decoration: none;
      color: black;
    }
    ul {
      list-style-type: none;
    }
    img {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    button {
      border: none;
      background-color: transparent;
      border-radius: 1rem;
      cursor: pointer;
      &:active,
      &:focus {
        outline: none;
      }
    }
    input {
      outline: none;
      &:focus::placeholder {
        color: transparent;
      }
    }
  `;

  return <Global styles={globalCSS(theme)} />;
}

export default GlobalStyle;
