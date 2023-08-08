import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

function ModalPortal({ root, children }: PropsWithChildren<{ root?: Element }>) {
  const modalRoot = root ?? document.querySelector('#__next');

  return createPortal(children, modalRoot);
}

export default ModalPortal;
