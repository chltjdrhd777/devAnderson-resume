import type { NextPage } from 'next';
import Head from 'next/head';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { colors, Md } from 'styles/theme';
import { useDispatch, useSelector } from 'redux/store';
import { test } from 'redux/userReducer';

const IndexPage: NextPage = () => {
  const dispatch = useDispatch();
  return (
    <Main>
      <button
        onClick={() => {
          dispatch(test());
        }}
      >
        click
      </button>
    </Main>
  );
};

const Main = styled.main`
  min-width: 100vw;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.fontColor};

  & button {
    color: inherit;
  }
  /* ${Md(css`
    background-color: ${colors.lightblue};
  `)}; */
`;

export default IndexPage;
