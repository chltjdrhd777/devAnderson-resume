import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const CanvasFrame = styled.div<{ isShown: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  z-index: calc(var(--zIndex-2st) * -1);
  opacity: 0;
  transition: opacity 0.1s ease-in, z-index 0.1s ease-in;

  ${({ isShown }) =>
    isShown &&
    css`
      z-index: var(--zIndex-2st);
      opacity: 1;
    `}
`;

export const Canvas = styled.canvas<{ isCanvasOpen: boolean }>`
  touch-action: ${({ isCanvasOpen }) => (isCanvasOpen ? 'none' : 'initial')};
`;
