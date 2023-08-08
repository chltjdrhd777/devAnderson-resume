import React, { DOMAttributes, HTMLAttributes, PropsWithChildren } from 'react';
import { BaseButton, BaseButtonIconContainer } from '../Atom/round';
import styled from '@emotion/styled';
import { SerializedStyles, css } from '@emotion/react';
import { colors, genMedia } from 'styles/theme';
import { checkMobile } from 'helper/checkMobile';
import { MoleculeProps } from 'types';

interface OptionProps extends MoleculeProps<HTMLButtonElement> {
  isMobile?: Boolean;
}
function Option({ children, additialCSS, ...props }: PropsWithChildren<OptionProps>) {
  // 내가 이해하고 변동적으로 시도해보려고 하는 Atomic Design
  // 0. 실무적으로는 항상 변동성을 고려해야 한다.
  // 1. Atom은 상대적으로 변하지 않는, 스토리보드 상에 존재하는 디자인적 고정 형태
  // 2. Molecule은 변동과 확장을 최대한 고려해야하는, Atom을 통한 디자인적 확장 + props를 통한 기능적 확장.
  // 3. organism은 Molecule을 통해 파생되어 발생하는 독립적 기능단위 컴포넌트
  // 4. pages는 organism들이 모여서 만들어지는 의미론적 웹 구성단위.

  return (
    <Button additialCSS={additialCSS} {...props}>
      <ButtonIconContainer className="button-icon-container">{children}</ButtonIconContainer>
    </Button>
  );
}

const Button = styled(BaseButton)<OptionProps>`
  width: 5rem;
  height: 5rem;
  border-radius: 100%;
  border: 1px solid ${colors.grayTwo};
  overflow: hidden;
  background-color: ${({ theme }) => theme.backgroundColor};

  transition: opacity 0.25s ease-in-out, transform 0.5s ease-in-out;
  transform: scale(0.85);
  opacity: 0.5;

  ${genMedia(
    'web(1024px)',
    css`
      transform: scale(1.1);
    `,
  )}

  ${({ theme }) => theme.middle};
  ${({ additialCSS }) => additialCSS};
`;
const ButtonIconContainer = styled(BaseButtonIconContainer)`
  display: inline-block;
  width: 90%;
  height: 90%;
  border-radius: 100%;
  background-color: white;
  border: 1px solid ${colors.footerColor};
  font-size: 2rem;
  color: ${colors.footerColor};
  position: absolute;

  ${({ theme }) => theme.middle};
`;

export default Option;
