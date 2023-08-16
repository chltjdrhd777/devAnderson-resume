import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

function Portal({ root, children }: PropsWithChildren<{ root?: Element }>) {
  const Root = root ?? document.querySelector('#__next');

  return createPortal(children, Root);
}

export default Portal;
