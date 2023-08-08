import type { NextPage } from 'next';
import styled from '@emotion/styled';
import { genMedia } from 'styles/theme';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

const ModalPortal = dynamic(() => import('components/ModalPortal'), {
  ssr: false,
});
import PdfBtn from 'components/Button/organism/PdfBtn';
import Content from 'components/Content';
import GradientHeader from 'components/GradientHeader';
import { css } from '@emotion/react';
import MemoCanvas from 'components/MemoCanvas';
import OpenCanvasBtn from 'components/Button/OpenCanvasBtn';
import MemoShownBtn from 'components/Button/organism/MemoShownBtn';

const IndexPage: NextPage = () => {
  return (
    <Wrapper>
      <GradientHeader />

      <Main>
        <MemoCanvas />
        <Content />

        <ModalPortal>
          <Options>
            <MemoShownBtn />
            <OpenCanvasBtn />
            <PdfBtn />
          </Options>
        </ModalPortal>
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Main = styled.main`
  min-width: 100vw;
  min-height: 100vh;
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
  right: var(--option-btn-right);
  z-index: var(--zIndex-1st);

  ${genMedia(
    'web(1024px)',
    css`
      bottom: 2.5rem;
      gap: 2rem;
    `,
  )}
`;

export default IndexPage;
