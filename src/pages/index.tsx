import type { NextPage } from 'next';
import styled from '@emotion/styled';
import { genMedia } from 'styles/theme';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

const ModalPortal = dynamic(() => import('components/ModalPortal'), {
  ssr: false,
});
import PdfBtn from 'components/Button/PdfBtn';
import Content from 'components/Content';
import GradientHeader from 'components/GradientHeader';
import { css } from '@emotion/react';
import MemoCanvas from 'components/MemoCanvas';
import OpenCanvasBtn from 'components/Button/OpenCanvasBtn';

const IndexPage: NextPage = () => {
  return (
    <Wrapper>
      <GradientHeader />

      <Main>
        <MemoCanvas />
        <Content />

        <ModalPortal>
          <Options>
            <OpenCanvasBtn />
            <PdfBtn />
          </Options>
        </ModalPortal>
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  --header-height: 2.5rem;
  ${genMedia(
    'web(1024px)',
    css`
      --header-height: 3.2rem;
    `,
  )}
`;

const Main = styled.main`
  min-width: 100vw;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.backgroundColor};
  html {
    background-color: ${({ theme }) => theme.backgroundColor};
  }
  transition: background-color 0.3s ease-in;
  color: ${({ theme }) => theme.fontColor};
  padding-top: calc(var(--header-height));
  padding-bottom: calc(var(--header-height) * 2);
  position: relative;

  ${({ theme }) => theme.centerCol};
`;

const Options = styled.div`
  ${({ theme }) => theme.centerCol};
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: var(--zIndex-1st);

  ${genMedia(
    'web(1024px)',
    css`
      right: 2.5rem;
      bottom: 2.5rem;
      gap: 2rem;
    `,
  )}
`;

export default IndexPage;
