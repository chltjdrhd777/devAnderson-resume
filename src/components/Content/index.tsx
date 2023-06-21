import React from 'react';
import styled from '@emotion/styled';
import { colors, gradients } from 'styles/theme';
import useFadeInAnimation from 'hooks/useFadeInAnimation';

import TitleSection from 'components/Content/TitleSection';
import ChannelSection from 'components/Content/ChannelSection';

function Content() {
  useFadeInAnimation();

  return (
    <Container>
      <TitleSection />

      <Divider className="animate" />

      <ChannelSection />
      {/* <Skills>
        <h2>
          Skills <span className="dot">.</span>
        </h2>

        <h3>Mindset</h3>

        <ul className="list">
          <li>반갑습니다</li>
        </ul>
      </Skills>
      <Skills>
        <h2>
          Skills <span className="dot">.</span>
        </h2>

        <h3>Mindset</h3>

        <ul className="list">
          <li>반갑습니다</li>
        </ul>
      </Skills>
      <Skills>
        <h2>
          Skills <span className="dot">.</span>
        </h2>

        <h3>Mindset</h3>

        <ul className="list">
          <li>반갑습니다</li>
        </ul>
      </Skills>
      <Skills>
        <h2>
          Skills <span className="dot">.</span>
        </h2>

        <h3>Mindset</h3>

        <ul className="list">
          <li>반갑습니다</li>
        </ul>
      </Skills> */}
    </Container>
  );
}

const Container = styled.div`
  width: 80%;
  height: 100%;
  max-width: 70rem;

  & .pointColor {
    transition: color 0.1s ease-in;
    color: ${({ theme }) => theme.pointColor};
  }

  & .bold {
    font-weight: 500;
  }

  & .underline {
    text-decoration: underline;
  }

  & .animate {
    opacity: 0;
    transform: translateY(3rem);
  }

  & .fadeIn {
    animation-name: ${({ theme }) => theme.animations.fadeIn};
    animation-duration: 2s;
    animation-timing-function: cubic-bezier(0, 0.95, 0.48, 0.94);
    animation-fill-mode: both;
  }

  & h2 {
    font-size: 2.5rem;
    font-weight: bold;
    word-break: keep-all;
    margin-bottom: 2rem;
  }

  /* & h2 {
    font-size: 4rem;
    margin-bottom: 3rem;
  }

  & h3 {
    font-size: 3rem;
    margin-bottom: 2rem;
  }

  & section {
    border-bottom: 1.5px solid ${colors.grayTwo};
    padding: 7rem 0;
  } */

  /* & p {
    margin-top: 3.5rem;
    font-size: 3rem;
    word-break: keep-all;

    &.description {
      padding-bottom: 10rem;
      border-bottom: 1.5px solid ${colors.grayTwo};
    }
  } */

  /* & .list {
    list-style: none;
    font-size: 2.3rem;

    & li::before {
      content: '';
      background-color: ${colors.pointColorBlue};
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      display: inline-block;
      margin-right: 0.5rem;
      transform: translateY(-0.3rem);
    }
  } */
`;

const Divider = styled.div`
  width: 100%;
  height: 0.12rem;
  margin: 3rem 0;
  ${gradients.pointGraidentBlue};
`;

const Skills = styled.section``;
export default Content;
