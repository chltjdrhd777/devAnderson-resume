import React, { useState } from 'react';
import MenuBtn from './Button/MenuBtn';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import ColorPicker from './ColorPicker';
import { useRecoilValue } from 'recoil';
import { memoCanvasAtom } from 'recoil/memo';

function CanvasMenu() {
  const { isCanvasOpen } = useRecoilValue(memoCanvasAtom);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Container isCanvasOpen={isCanvasOpen}>
      <MenuBtn className={menuOpen && 'active'} onClick={() => setMenuOpen((prev) => !prev)} />

      <MenuBox menuOpen={menuOpen}>
        <ColorPicker />
      </MenuBox>
    </Container>
  );
}

const Container = styled.div<{ isCanvasOpen: boolean }>`
  position: fixed;
  top: calc(var(--header-height) + 1rem);
  right: var(--option-btn-right);
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  transition: opacity 0.1s ease-in, visibility 0.1s ease-in;
  opacity: ${({ isCanvasOpen }) => (isCanvasOpen ? 1 : 0)};
  visibility: ${({ isCanvasOpen }) => (isCanvasOpen ? 'visible' : 'hidden')};
`;

const MenuBox = styled.div<{ menuOpen: boolean }>`
  z-index: calc(var(--zIndex-2st) * -1);
  ${({ menuOpen }) =>
    menuOpen &&
    css`
      z-index: calc(var(--zIndex-2st));
      opacity: 1;
    `}
`;

export default CanvasMenu;
