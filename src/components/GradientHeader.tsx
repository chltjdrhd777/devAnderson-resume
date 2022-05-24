import React, { useEffect, useState } from 'react';
import { colors } from 'styles/theme';
import styled from '@emotion/styled';
import useScrollAnimation from 'hooks/useScrollAnimation';

function GradientHeader() {
  const { scroll } = useScrollAnimation();

  return (
    <Gradient className={scroll && 'faint'}>
      <span>
        created by <span>리엑트</span>
        <a href="https://github.com/chltjdrhd777/my-record/issues">
          "Click Here for more Info"
        </a>
      </span>
    </Gradient>
  );
}

const Gradient = styled.div`
  width: 100%;
  height: 3.5rem;
  position: fixed;
  background: linear-gradient(
    to right,
    ${colors.pointColorBlue},
    ${colors.pointColorMint}
  );

  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${colors.starColor};
  z-index: 10000;

  & > span {
    margin-right: 1rem;
    font-size: 1.65rem;

    & a {
      color: ${colors.white};
      margin-left: 0.5rem;
    }
  }

  transition: opacity 0.2s ease-in-out;
  &.faint {
    opacity: 0.5;
  }
`;

export default GradientHeader;
