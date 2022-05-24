import React from 'react';
import styled from '@emotion/styled';
import { colors } from 'styles/theme';
import axios from 'axios';

function Content() {
  return (
    <Container>
      <h1>
        반갑습니다,
        <br /> 저는 최우철입니다<span className="dot">.</span>
      </h1>

      <p className="description">
        어제의 저에게 지고싶지 않아 스스로를 채찍질하는 새싹개발자입니다. 항상
        겸손한 마음으로 나보다 남을 낫게 여기며 저의 일을 돌보면서도 다른
        사람들의 일도 돌볼 수 있는 개발자가 되기를 희망합니다.
      </p>

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
    </Container>
  );
}

const Container = styled.div`
  width: 80%;
  max-width: 70rem;
  transform: translateY(7rem);

  & h1 {
    font-size: 7rem;
    font-weight: bold;
  }

  & .dot {
    color: ${colors.pointColorBlue};
  }

  & h2 {
    font-size: 5rem;
    margin-bottom: 3rem;
  }

  & h3 {
    font-size: 3rem;
    margin-bottom: 2rem;
  }

  & p {
    margin-top: 3.5rem;
    font-size: 3rem;
    word-break: keep-all;

    &.description {
      padding-bottom: 10rem;
      border-bottom: 1.5px solid ${colors.grayTwo};
    }
  }

  & section {
    border-bottom: 1.5px solid ${colors.grayTwo};
    padding: 7rem 0;
  }

  & .list {
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
  }
`;

const Skills = styled.section``;
export default Content;
