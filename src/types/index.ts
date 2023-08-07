export type CustomEventListner = <K extends keyof HTMLElementEventMap>(
  type: K,
  listener: (this: HTMLCanvasElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) => void;
