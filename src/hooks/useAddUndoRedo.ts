import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { memoCanvasAtom, memoCanvasHandlerAtom } from 'recoil/memo';

function useAddUndoRedo() {
  const isCanvasOpen = useRecoilValue(memoCanvasAtom).isCanvasOpen;
  const { goBackwardPath, goForwardPath } = useRecoilValue(memoCanvasHandlerAtom);

  useEffect(() => {
    const addKeyboardShorcut = (e: KeyboardEvent) => {
      const isCtrlZ = (e.ctrlKey || e.metaKey) && e.key === 'z';
      const isCtrlShiftZ = isCtrlZ && e.shiftKey;

      if (isCtrlShiftZ) {
        goForwardPath();
        return;
      }
      if (isCtrlZ) {
        goBackwardPath();
      }
    };

    if (isCanvasOpen) {
      window.addEventListener('keydown', addKeyboardShorcut);
    } else {
      window.removeEventListener('keydown', addKeyboardShorcut);
    }
  }, [isCanvasOpen]);

  return {
    goBackwardPath,
    goForwardPath,
  };
}

export default useAddUndoRedo;
