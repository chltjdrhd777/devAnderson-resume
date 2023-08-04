import useRecoilImmerState from 'hooks/useImmerState';
import { atom } from 'recoil';
import { colors } from 'styles/theme';

export interface memoCanvasAtom {
  isCanvasOpen: boolean;
  canSaveMemo: boolean;
}

export interface MenuConfigAtom {
  tool: 'pen' | 'ereaser';
  mode: 'pen' | 'touch';
  pressure: boolean;
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

export const memoContextAttrAtom = atom<
  Partial<
    CanvasRenderingContext2D & {
      pickerBackground: string;
    }
  >
>({
  key: 'memoContextAttrAtom',
  default: {
    pickerBackground: 'rgba(255, 0, 0, 1)',
    strokeStyle: colors.black,
    lineWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  },
});

export interface PickerCircle {
  x: number;
  y: number;
  width: number;
  height: number;
  selectedColor: string;
}
export const pickerCircleAtom = atom<PickerCircle>({
  key: 'pickerCircleAtom',
  default: {
    x: 10,
    y: 10,
    width: 7,
    height: 7,
    selectedColor: colors.black,
  },
});

export const menuConfigAtom = atom<MenuConfigAtom>({
  key: 'menuConfigAtom',
  default: {
    tool: 'pen',
    mode: 'pen',
    pressure: false,
  },
});

export const useSetMemoImpossible = () => {
  const [_, setCanSaveMemo] = useRecoilImmerState(memoCanvasAtom);
  setCanSaveMemo((draft) => {
    draft.canSaveMemo = false;
    return draft;
  });
};
