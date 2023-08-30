import styled from '@emotion/styled';
import React, { HTMLAttributes } from 'react';
import Option from '../Molecule/Option';
import { BiMenu } from 'react-icons/bi';
import { css } from '@emotion/react';
import { genMedia } from 'styles/theme';

function MenuBtn(props: HTMLAttributes<HTMLButtonElement>) {
  return (
    <Option additialCSS={additionalCSS} {...props}>
      <BiMenu />
    </Option>
  );
}

const additionalCSS = css`
  opacity: 1;
  z-index: var(--zIndex-1st);
  &.active {
    transform: scale(1);
    opacity: 1;

    ${genMedia(
      'web(1024px)',
      css`
        transform: scale(1.3);
      `,
    )}
  }
`;

export default MenuBtn;
