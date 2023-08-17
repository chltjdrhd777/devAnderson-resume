import useRecoilImmerState from 'hooks/useImmerState';
import { atom } from 'recoil';
import { colors } from 'styles/theme';

// type
export interface MemoCanvasAtom {
  isCanvasOpen: boolean;
  canSaveMemo: boolean;
}
export interface MemoCanvasHandlerAtom {
  goBackwardPath: () => void;
  goForwardPath: () => void;
}

export interface MenuConfigAtom {
  pickerBackground: string;
  currentTool: 'pen' | 'eraser';
  penSize: number;
  eraserSize: number;
  drawType: 'pen' | 'touch'; // (기본 마우스) 펜 모드 or 터치모드
  pressure: boolean; // 필압 지원유무
}

// atom
export const memoCanvasAtom = atom<MemoCanvasAtom>({
  key: 'memoCanvasAtom',
  default: {
    isCanvasOpen: false,
    canSaveMemo: true,
  },
});
export const memoCanvasHandlerAtom = atom<Partial<MemoCanvasHandlerAtom>>({
  key: 'memoCanvasHandlerAtom',
  default: {},
});

export const memoLengthAtom = atom<number>({
  key: 'memoLengthAtom',
  default: 0,
});

export const memoLimitAtom = atom<number>({
  key: 'memoLimitAtom',
  default: 20,
});

export const memoContextAttrAtom = atom<Partial<CanvasRenderingContext2D>>({
  key: 'memoContextAttrAtom',
  default: {
    strokeStyle: colors.black,
    lineWidth: 1,
    lineCap: 'round',
    lineJoin: 'round',
  },
});

export const menuConfigAtom = atom<MenuConfigAtom>({
  key: 'menuConfigAtom',
  default: {
    pickerBackground: 'rgba(255, 0, 0, 1)',
    currentTool: 'pen',
    penSize: 1,
    eraserSize: 7,
    drawType: 'touch',
    pressure: false,
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

export const isClearMemoNoticeModalOpenAtom = atom({
  key: 'isClearMemoNoticeModalOpenAtom',
  default: false,
});
export const isClearMemoTriggeredAtom = atom({
  key: 'isClearTriggeredAtom',
  default: false,
});

export const useSetMemoImpossible = () => {
  const [_, setCanSaveMemo] = useRecoilImmerState(memoCanvasAtom);
  setCanSaveMemo((draft) => {
    draft.canSaveMemo = false;
    return draft;
  });
};
