import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { CanvasHTMLAttributes, useLayoutEffect } from 'react';

import useCanvasDrawing from 'hooks/useCanvasDrawing';
import { useSelector } from 'redux/store';
import CanvasMenu from './CanvasMenu';
import { useRecoilValue } from 'recoil';
import { menuConfigAtom } from 'recoil/memo';
import { checkMobile } from 'helper/checkMobile';
import preventCanvasDefault from 'helper/preventCanvasDefault';

function MemoCanvas() {
  // todo 텍스트 넣기 기능 추가
  // 선 굵기 바꾸기
  // 선 색 바꾸기
  // 지우개
  // ctrl + Z (진짜 ctrl+z도 되고, 버튼으로도 되고)
  // 전부 지우기

  const isMobile = checkMobile();
  const memo = useSelector((state) => state.user.memo); //사용자별 영속성이어야 하기에 Redux-persist로 로컬관리
  const { drawType } = useRecoilValue(menuConfigAtom);

  const {
    isCanvasOpen,
    canvasRef,
    drawPathLength,
    onDrawing,
    startDrawing,
    stopDrawing,
    onMouseLeave,
    startDrawingForMobile,
    onDrawingForMobile,
    stopDrawingForMobile,
  } = useCanvasDrawing();

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

  return (
    <CanvasFrame isMemoShown={isMemoShown}>
      <CanvasMenu />
      <Canvas ref={canvasRef} {...(isCanvasOpen && canvasAttrs)} isCanvasOpen={isCanvasOpen} />
    </CanvasFrame>
  );
}

const CanvasFrame = styled.div<{ isMemoShown: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  z-index: calc(var(--zIndex-2st) * -1);
  opacity: 0;
  transition: opacity 0.1s ease-in, z-index 0.1s ease-in;

  ${({ isMemoShown }) =>
    isMemoShown &&
    css`
      z-index: calc(var(--zIndex-2st));
      opacity: 1;
    `}
`;
const Canvas = styled.canvas<{ isCanvasOpen: boolean }>`
  touch-action: ${({ isCanvasOpen }) => (isCanvasOpen ? 'none' : 'initial')};
`;

export default MemoCanvas;
