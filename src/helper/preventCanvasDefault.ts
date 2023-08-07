export default (canvas: HTMLCanvasElement, type: keyof HTMLElementEventMap) => {
  const listener = (e: HTMLElementEventMap[typeof type]) => e.preventDefault();
  const options = { passive: false } as AddEventListenerOptions;

  canvas && canvas.addEventListener(type, listener, options);

  return () => {
    canvas && canvas.removeEventListener(type, listener, options);
  };
};
