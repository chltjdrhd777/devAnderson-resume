import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { animations, colors } from 'styles/theme';

interface Props {
  txt: string | JSX.Element;
}

function Round({ txt }: Props) {
  return (
    <Container>
      <LoadingBar />
      <LoadingText>{txt}</LoadingText>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.middle};
  position: relative;
`;
const LoadingBar = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-radius: 100%;

  /* border-color: transparent ${colors.black} transparent ${colors.black}; */
  /* animation: ${animations.rotate} 1.5s linear 0s infinite normal; */
`;

const LoadingText = styled.div`
  position: absolute;
  font-size: 1.5rem;
  & > * {
    display: flex;
  }

  animation: ${animations.fadeInOut} 2s linear 0s infinite normal;
`;

export default Round;
