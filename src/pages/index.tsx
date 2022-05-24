import type { NextPage } from 'next';
import styled from '@emotion/styled';
import { colors } from 'styles/theme';
import React from 'react';
import dynamic from 'next/dynamic';

const ModalPortal = dynamic(() => import('components/ModalPortal'), {
  ssr: false,
});
import PdfBtn from 'components/PdfBtn';
import Content from 'components/Content';
import GradientHeader from 'components/GradientHeader';

// 배포시 env에 production이라면, 상태를 변경한다
// 해당 상태에 따라서 class "site" 가 적용될지 안적용될지가 결정되고, site 클래스가 있으면
// display : block으로 나타내어 더 화려하게 꾸민다.

const IndexPage: NextPage = () => {
  return (
    <Main>
      <GradientHeader />

      <Content />

      <ModalPortal>
        <PdfBtn />
      </ModalPortal>
    </Main>
  );
};

const Main = styled.main`
  min-width: 100vw;
  min-height: 100vh;
  color: ${colors.black};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default IndexPage;
