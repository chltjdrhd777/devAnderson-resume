import React, { CanvasHTMLAttributes, forwardRef, useEffect, useLayoutEffect } from 'react';

import useCanvasDrawing from 'hooks/useCanvasDrawing';
import { useSelector } from 'redux/store';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isClearMemoTriggeredAtom, memoCanvasHandlerAtom, menuConfigAtom } from 'recoil/memo';
import { checkMobile } from 'helper/checkMobile';
import preventCanvasDefault from 'helper/preventCanvasDefault';
import EraserCanvas from './EraserCanvas';
import { Canvas, CanvasFrame } from './Canvas/Atom/BaseCanvas';
import useRecoilImmerState from 'hooks/useImmerState';

function Index() {
  // todo 텍스트 넣기 기능 추가
  // 선 굵기 바꾸기
  // 선 색 바꾸기
  // 지우개
  // ctrl + Z (진짜 ctrl+z도 되고, 버튼으로도 되고)
  // 전부 지우기

  const isMobile = checkMobile();
  const memo = useSelector((state) => state.user.memo); //사용자별 영속성이어야 하기에 Redux-persist로 로컬관리
  const { drawType } = useRecoilValue(menuConfigAtom);
  const [isClearMemoTriggered, setIsClearMemoTriggered] = useRecoilImmerState(isClearMemoTriggeredAtom);
  const setMemoCanvasHandler = useSetRecoilState(memoCanvasHandlerAtom);

  const {
    isCanvasOpen,
    canvasRef,
    drawPathLength,
    onDrawing,
    startDrawing,
    stopDrawing,
    saveDrawing,
    onMouseLeave,
    startDrawingForMobile,
    onDrawingForMobile,
    stopDrawingForMobile,
    clearDrawing,
    goBackwardPath,
    goForwardPath,
    database,
  } = useCanvasDrawing();

  useEffect(() => {
    setMemoCanvasHandler({
      goForwardPath,
      goBackwardPath,
    });
  }, [database]);

  const isMemoShown = (memo.isMemoShown && drawPathLength !== 0) || isCanvasOpen;
  const canvasAttrs = {
    onMouseDown: isMobile && drawType === 'pen' ? (e) => e.preventDefault() : startDrawing, //pen 이벤트는 마우스 이벤트를 공유하기에, 조건을 걸어서 시작을 막아야 함.
    onMouseMove: onDrawing,
    onMouseUp: stopDrawing,
    onMouseLeave: onMouseLeave,
    onPointerDown: startDrawingForMobile,
    onPointerMove: onDrawingForMobile,
    onPointerUp: stopDrawingForMobile,
  } as CanvasHTMLAttributes<HTMLCanvasElement>;

  useLayoutEffect(() => {
    preventCanvasDefault(canvasRef.current, 'contextmenu'); // 우클릭 막기
    preventCanvasDefault(canvasRef.current, 'dblclick'); // 더클블릭 막기
  }, []);

  useLayoutEffect(() => {
    if (isClearMemoTriggered) {
      clearDrawing();
      setIsClearMemoTriggered(false);
    }
  }, [isClearMemoTriggered]);

  return (
    <>
      <EraserCanvas ref={canvasRef} saveDrawing={saveDrawing} />
      <MemoCanvas ref={canvasRef} isMemoShown={isMemoShown} isCanvasOpen={isCanvasOpen} canvasAttrs={canvasAttrs} />
    </>
  );
}

type MemoCanvasRefType = HTMLCanvasElement | null;
interface MemoCanvasProps {
  isMemoShown: boolean;
  isCanvasOpen: boolean;
  canvasAttrs: CanvasHTMLAttributes<HTMLCanvasElement>;
}
const MemoCanvas = forwardRef<MemoCanvasRefType, MemoCanvasProps>(({ isMemoShown, isCanvasOpen, canvasAttrs }, ref) => (
  <CanvasFrame isShown={isMemoShown}>
    <Canvas ref={ref} {...(isCanvasOpen && canvasAttrs)} isCanvasOpen={isCanvasOpen} />
  </CanvasFrame>
));

export default Index;
