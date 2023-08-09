import React, { useState } from 'react';
import MenuBtn from './Button/organism/MenuBtn';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import ColorPicker from './ColorPicker';
import { useRecoilValue } from 'recoil';
import { memoCanvasAtom, menuConfigAtom } from 'recoil/memo';
import MenuToolSizeSlider from './Slider/Molecule/MenuToolSize';
import { GoPencil } from 'react-icons/go';
import { BsFillEraserFill } from 'react-icons/bs';
import { colors, genMedia } from 'styles/theme';
import useRecoilImmerState from 'hooks/useImmerState';

function CanvasMenu() {
  const { isCanvasOpen } = useRecoilValue(memoCanvasAtom);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuConfig, setMenuConfig] = useRecoilImmerState(menuConfigAtom);

  const onChangeSize = (e: React.ChangeEvent<HTMLInputElement>, tool: 'pen' | 'eraser') => {
    setMenuConfig((draft) => {
      const value = +e.target.value;
      if (tool === 'pen') {
        draft.penSize = value;
      }

      if (tool === 'eraser') {
        draft.eraserSize = value;
      }

      return draft;
    });
  };

  return (
    <Container isCanvasOpen={isCanvasOpen} menuOpen={menuOpen}>
      <MenuBtn className={menuOpen && 'active'} onClick={() => setMenuOpen((prev) => !prev)} />

      <MenuBoxWrapper>
        <MenuBox menuOpen={menuOpen}>
          <ColorPicker />

          <Configs>
            <MenuToolSizeSlider
              SliderIcon={GoPencil}
              labelText="펜 크기"
              min={1}
              max={5}
              value={menuConfig.penSize}
              onChange={(e) => onChangeSize(e, 'pen')}
              step={0.0001}
            />

            <MenuToolSizeSlider
              SliderIcon={BsFillEraserFill}
              labelText="지우개 크기"
              min={7}
              max={30}
              value={menuConfig.eraserSize}
              onChange={(e) => onChangeSize(e, 'eraser')}
              step={0.0001}
            />
          </Configs>
        </MenuBox>
      </MenuBoxWrapper>
    </Container>
  );
}

const Container = styled.div<{ isCanvasOpen: boolean; menuOpen: boolean }>`
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

const MenuBoxWrapper = styled.div`
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

const Configs = styled.div`
  margin-top: 0.5rem;
  margin-left: 3rem;
`;

export default CanvasMenu;
