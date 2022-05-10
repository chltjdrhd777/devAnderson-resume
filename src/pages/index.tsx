import type { NextPage } from 'next';
import styled from '@emotion/styled';
import { colors } from 'styles/theme';
import React from 'react';
import dynamic from 'next/dynamic';

const ModalPortal = dynamic(() => import('components/ModalPortal'), {
  ssr: false,
});
import PdfBtn from 'components/PdfBtn';

// 배포시 env에 production이라면, 상태를 변경한다
// 해당 상태에 따라서 class "site" 가 적용될지 안적용될지가 결정되고, site 클래스가 있으면
// display : block으로 나타내어 더 화려하게 꾸민다.

const IndexPage: NextPage = () => {
  return (
    <Main>
      <div className="container">
        <h1>Hello World</h1>
        <div></div>

        <div>
          <a href="https://github.com/chltjdrhd777/my-record/issues">
            this is my github
          </a>
        </div>
      </div>

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

  & h1:hover {
    background-color: red;
  }

  & button {
    color: inherit;
    background-color: ${colors.pointColorCarrot};
    padding: 3rem;
    margin: 2rem;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .box {
    width: 50rem;
    height: 50rem;
    background-color: red;
  }
`;

export default IndexPage;
