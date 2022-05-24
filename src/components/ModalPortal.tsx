import React, { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

function ModalPortal({ children }: PropsWithChildren<{}>) {
  const modalRoot = document.querySelector('#__next');

  return createPortal(children, modalRoot);
}

export default ModalPortal;
