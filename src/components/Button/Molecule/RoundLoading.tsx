import React from 'react';
import styled from '@emotion/styled';
import { animations } from 'styles/theme';

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
