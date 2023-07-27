import React, { useState } from 'react';
import MenuBtn from './Button/MenuBtn';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import ColorPicker from './ColorPicker';

function CanvasMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Container>
      <MenuBtn className={menuOpen && 'active'} onClick={() => setMenuOpen((prev) => !prev)} />

      <MenuBox>
        <ColorPicker />
      </MenuBox>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: calc(var(--header-height) + 1rem);
  right: var(--option-btn-right);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const MenuBox = styled.div``;

export default CanvasMenu;
