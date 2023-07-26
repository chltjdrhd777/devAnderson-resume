import useRecoilImmerState from 'hooks/useImmerState';
import { atom } from 'recoil';

export interface memoCanvasAtom {
  isCanvasOpen: boolean;
  canSaveMemo: boolean;
}
export const memoCanvasAtom = atom<memoCanvasAtom>({
  key: 'memoCanvasAtom',
  default: {
    isCanvasOpen: false,
    canSaveMemo: true,
  },
});

export const memoLengthAtom = atom<number>({
  key: 'memoLengthAtom',
  default: 0,
});

export const memoLimitAtom = atom<number>({
  key: 'memoLimitAtom',
  default: 30,
});

export const useSetMemoImpossible = () => {
  const [_, setCanSaveMemo] = useRecoilImmerState(memoCanvasAtom);
  setCanSaveMemo((draft) => {
    draft.canSaveMemo = false;
    return draft;
  });
};
