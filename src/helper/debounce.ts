export function debounce(callback: Function, timer: number) {
  let timerId: any | string = null;

  return () => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback();

      timerId = null;
    }, timer);
  };
}
