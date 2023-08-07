import { SerializedStyles } from '@emotion/react';
import { HTMLAttributes } from 'react';

export type CustomEventListner = <K extends keyof HTMLElementEventMap>(
  type: K,
  listener: (this: HTMLCanvasElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) => void;

export type MoleculeProps<T> = HTMLAttributes<T> & {
  additialCSS?: SerializedStyles;
};
