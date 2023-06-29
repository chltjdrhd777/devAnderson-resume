import React, { useEffect, useState } from 'react';
import { colors, genMedia, gradients } from 'styles/theme';
import styled from '@emotion/styled';
import useScrollAnimation from 'hooks/useScrollAnimation';
import { useSelector, useDispatcher, AppState } from 'redux/store';
import { css } from '@emotion/react';

function GradientHeader() {
  const { scroll } = useScrollAnimation();
  const toggleModeDispatcher = useDispatcher('toggleMode');
  const toggleModeState = useSelector(state => state.user.config.mode);

  const toggleModeHandler = () => {
    toggleModeDispatcher();
  };

  return (
    <Gradient className={scroll && 'faint'}>
      <Mode onClick={toggleModeHandler}>
        <ToggleBtn mode={toggleModeState} />
      </Mode>
    </Gradient>
  );
}

const Gradient = styled.div`
  width: 100%;
  height: var(--header-height);

  position: fixed;
  z-index: 10000;

  color: ${colors.starColor};
  ${gradients.pointGraidentBlue};

  transition: opacity 0.2s ease-in-out;
  &.faint {
    opacity: 0.5;
  }

  ${({ theme }) => theme.middle}
  justify-content: flex-end;
`;

const Mode = styled.div`
  --padding-side: 0.2rem;

  width: 4.5rem;
  height: 65%;
  border-radius: 2rem;
  margin-right: 0.5rem;
  border: 2px solid white;
  padding: 0 var(--padding-side);
  box-sizing: initial;
  cursor: pointer;
  position: relative;

  ${genMedia(
    'web(1024px)',
    css`
      width: 5.5rem;
    `,
  )}

  ${({ theme }) => theme.centerRow};
`;

type ToggleMode = AppState['user']['config']['mode'];
interface ToggleBtnProps {
  mode: ToggleMode;
}
function moveBtn(mode: ToggleMode) {
  if (mode === 'white') {
    return css`
      transform: translateX(0);
    `;
  }

  if (mode === 'dark') {
    return css`
      transform: translateX(3.35rem);
      ${genMedia(
        'web(1024px)',
        css`
          transform: translateX(4.3rem);
        `,
      )}
    `;
  }
}
const ToggleBtn = styled.div<ToggleBtnProps>`
  height: 1.2rem;
  width: 1.2rem;
  background-color: white;
  border-radius: 50%;
  position: absolute;

  transition: all 0.3s ease-in-out;
  ${({ mode }) => moveBtn(mode)}
`;

export default GradientHeader;
