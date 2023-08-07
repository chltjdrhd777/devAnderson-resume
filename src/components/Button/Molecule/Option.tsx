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
  // 0. 모든 컴포넌트는 변동성을 고려해야 한다. (cloneElement를 활용하도록 하자)
  // 1. Styled 컴포넌트(디자인)을 Base Atom으로 보고, 스타일 상속을 통해 Molecule에서 조합 및 디자인
  // 2. Molecule 별로 개별적인 디자인 => Props를 통해 CSS 건네받아서 적용
  // 3. Molecule 별로 개별적인 기능 => Props를 통해 Handler 건네받아서 적용
  const isMobile = checkMobile();

  return (
    <Button additialCSS={additialCSS} {...props} isMobile={isMobile}>
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

  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  transform: scale(0.85);
  opacity: 0.5;

  ${({ isMobile }) =>
    !isMobile &&
    css`
      //모바일에는 호버가 없기 때문에 이 스타일링이 오히려 UI적인 디버그를 야기하므로 조건부로 설정
      &:hover {
        transform: scale(1);
        opacity: 1;
      }
      ${genMedia(
        'web(1024px)',
        css`
          transform: scale(1.1);
          &:hover {
            transform: scale(1.3);
          }
        `,
      )}
    `}

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
