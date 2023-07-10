import { atom } from 'recoil';

interface MemoCanvasConfig {
  isCanvasOpen: boolean;
}
export const memoCanvasConfig = atom<MemoCanvasConfig>({
  key: 'memoCanvasConfig',
  default: {
    isCanvasOpen: false,
  },
});
