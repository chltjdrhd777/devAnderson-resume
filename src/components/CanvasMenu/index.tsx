import React, { useState } from 'react';
import MenuBtn from '../Button/organism/MenuBtn';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import ColorPicker from '../ColorPicker';
import { useRecoilValue } from 'recoil';
import { memoCanvasAtom } from 'recoil/memo';
import { colors, genMedia } from 'styles/theme';
import Configs from './Configs';
import Sidebar from './Sidebar';

function CanvasMenu() {
  const { isCanvasOpen } = useRecoilValue(memoCanvasAtom);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Wrapper isCanvasOpen={isCanvasOpen} menuOpen={menuOpen}>
      <MenuBtn className={menuOpen && 'active'} onClick={() => setMenuOpen((prev) => !prev)} />

      <MenuBoundary>
        <MenuBox menuOpen={menuOpen}>
          <ColorPicker />

          <MenuBottomContainer>
            <Sidebar />
            <Configs />
          </MenuBottomContainer>
        </MenuBox>
      </MenuBoundary>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ isCanvasOpen: boolean; menuOpen: boolean }>`
  position: fixed;
  top: calc(var(--header-height) + 1rem);
  right: var(--option-btn-right);
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  transition: opacity 0.1s ease-in, visibility 0.1s ease-in;
  opacity: ${({ isCanvasOpen }) => (isCanvasOpen ? 1 : 0)};
  visibility: ${({ isCanvasOpen }) => (isCanvasOpen ? 'visible' : 'hidden')};
  z-index: var(--zIndex-1st);
`;

const MenuBoundary = styled.div`
  position: relative;
`;
const MenuBox = styled.div<{ menuOpen: boolean }>`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.1s ease-in, visibility 0.1s ease-in;
  border: 1px solid ${colors.black};
  background-color: white;
  border-radius: 1rem;
  min-width: 20rem;
  width: 20rem;
  padding: 2rem;
  position: absolute;
  top: 0;
  right: 0;

  ${({ menuOpen }) =>
    menuOpen &&
    css`
      visibility: visible;
      opacity: 1;
    `}

  margin-top: 1rem;
  ${genMedia(
    'web(1024px)',
    css`
      margin-top: 1.5rem;
    `,
  )}
`;

const MenuBottomContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 1.5rem;
`;

export default CanvasMenu;
