import React, { useState } from 'react';
import MenuBtn from './Button/MenuBtn';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import ColorPicker from './ColorPicker';
import { useRecoilValue } from 'recoil';
import { memoCanvasAtom, menuConfigAtom } from 'recoil/memo';
import MenuConfigSlider from './Slider/Molecule/MenuConfigSlider';
import { GoPencil } from 'react-icons/go';
import { colors } from 'styles/theme';
import { useSelector } from 'redux/store';
import useRecoilImmerState from 'hooks/useImmerState';

function CanvasMenu() {
  const { isCanvasOpen } = useRecoilValue(memoCanvasAtom);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuConfig, setMenuConfig] = useRecoilImmerState(menuConfigAtom);

  return (
    <Container isCanvasOpen={isCanvasOpen}>
      <MenuBtn className={menuOpen && 'active'} onClick={() => setMenuOpen((prev) => !prev)} />

      <MenuBox menuOpen={menuOpen}>
        <ColorPicker />

        <Configs>
          <MenuConfigSlider SliderIcon={GoPencil} labelText="펜 크기" />
        </Configs>
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
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.1s ease-in, visibility 0.1s ease-in;
  border: 1px solid ${colors.black};
  background-color: white;
  border-radius: 1rem;
  min-width: 20rem;
  width: 20rem;

  ${({ menuOpen }) =>
    menuOpen &&
    css`
      visibility: visible;
      opacity: 1;
    `}

  padding: 2rem;
  margin-top: 0.5rem;
`;

const Configs = styled.div`
  margin-top: 0.5rem;
  margin-left: 3rem;
`;

export default CanvasMenu;
