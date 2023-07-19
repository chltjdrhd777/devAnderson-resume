import useRecoilImmerState from 'hooks/useImmerState';
import { atom } from 'recoil';

export interface MemoCanvasConfig {
  isCanvasOpen: boolean;
  canSaveMemo: boolean;
}
export const memoCanvasConfig = atom<MemoCanvasConfig>({
  key: 'memoCanvasConfig',
  default: {
    isCanvasOpen: false,
    canSaveMemo: true,
  },
});

export interface DisplayCanvasConfig {
  isDisplay: boolean;
}
export const displayCanvasConfig = atom<DisplayCanvasConfig>({
  key: 'displayCanvasConfig',
  default: {
    isDisplay: false,
  },
});

export const useSetMemoImpossible = () => {
  const [_, setCanSaveMemo] = useRecoilImmerState(memoCanvasConfig);
  setCanSaveMemo((draft) => {
    draft.canSaveMemo = false;
    return draft;
  });
};
