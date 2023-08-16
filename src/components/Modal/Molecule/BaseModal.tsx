import React, { PropsWithChildren, useEffect, useState } from 'react';
import { BaseOverlay } from '../Atom/Overlay';
import { BaseModalContent } from '../Atom/ModalContent';
import styled from '@emotion/styled';
import { MoleculeProps } from 'types';
import { genMedia } from 'styles/theme';
import { css } from '@emotion/react';

interface BaseModalProps extends MoleculeProps<HTMLDivElement> {
  onClose?: (...args: any) => any;
}
function BaseModal({ children, onClose, additialCSS }: PropsWithChildren<BaseModalProps>) {
  return (
    <ModalWrapper additialCSS={additialCSS}>
      <BaseModalContent className="modal-content">{children}</BaseModalContent>
      <BaseOverlay onClick={onClose} className="modal-backdrop" />
    </ModalWrapper>
  );
}

const ModalWrapper = styled.div<BaseModalProps>`
  min-width: 100vw;
  min-height: 100vh;
  width: 100%;
  height: 100%;

  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--zIndex-0st);

  & .modal-content {
    z-index: calc(var(--zIndex-0st + 200));

    animation: ${({ theme }) => theme.animations.popup} 0.7s ease-in forwards;

    ${genMedia(
      'web(1024px)',
      css`
        max-width: 60rem;
      `,
    )}
    ${genMedia(
      'monitor(1440px)',
      css`
        max-width: 70rem;
      `,
    )};
  }

  & .modal-backdrop {
    z-index: calc(var(--zIndex-0st + 100));
  }

  ${({ additialCSS }) => additialCSS && additialCSS}
`;

export default BaseModal;
