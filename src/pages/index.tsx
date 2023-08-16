import type { NextPage } from 'next';
import styled from '@emotion/styled';
import { genMedia } from 'styles/theme';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

const Portal = dynamic(() => import('components/Portal'), {
  ssr: false,
});
import PdfBtn from 'components/Button/organism/PdfBtn';
import Content from 'components/Content';
import GradientHeader from 'components/GradientHeader';
import { css } from '@emotion/react';
import MemoCanvas from 'components/MemoCanvas';
import OpenCanvasBtn from 'components/Button/organism/OpenCanvasBtn';
import MemoShownBtn from 'components/Button/organism/MemoShownBtn';
import useRecoilImmerState from 'hooks/useImmerState';
import { indexedDBAtom } from 'recoil/IndexedDB';
import useCheckIndexedDB from 'hooks/useCheckIndexedDB';
import useRestoreScroll from 'hooks/useRestoreScroll';

const IndexPage: NextPage = () => {
  const [database, setDatabase] = useRecoilImmerState(indexedDBAtom);
  useCheckIndexedDB(database, setDatabase, 'resume');

  useRestoreScroll(); //새로고침 시 스크롤 위치 초기화.

  return (
    <Wrapper>
      <GradientHeader />

      <Main>
        <MemoCanvas />
        <Content />

        <Portal>
          <Options>
            <MemoShownBtn />
            <OpenCanvasBtn />
            <PdfBtn />
          </Options>
        </Portal>
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Main = styled.main`
  min-width: 100vw;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.backgroundColor};
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
  right: var(--option-btn-right);
  z-index: var(--zIndex-1st);

  ${genMedia(
    'web(1024px)',
    css`
      bottom: 2.5rem;
      gap: 1.5rem;
    `,
  )}
`;

export default IndexPage;
