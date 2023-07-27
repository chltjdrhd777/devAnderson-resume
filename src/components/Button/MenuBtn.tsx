import styled from '@emotion/styled';
import React, { HTMLAttributes } from 'react';
import Option from './Molecule/Option';
import { BiMenu } from 'react-icons/bi';
import { css } from '@emotion/react';
import { colors, genMedia } from 'styles/theme';
import ColorPicker from 'components/ColorPicker';

function MenuBtn(props: HTMLAttributes<HTMLButtonElement>) {
  const onChange = (color) => {
    const selected = document.getElementsByClassName('selected')[0];
    console.log('선택된 값은', selected);
  };

  return (
    <Option additialCSS={additionalCSS} {...props}>
      <BiMenu />
    </Option>
  );
}

const additionalCSS = css`
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
