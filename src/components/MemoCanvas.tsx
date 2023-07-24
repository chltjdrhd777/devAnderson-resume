import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { CanvasHTMLAttributes, useEffect } from 'react';

import useCanvasDrawing from 'hooks/useCanvasDrawing';
import { useSelector } from 'redux/store';

function MemoCanvas() {
  // todo 텍스트 넣기 기능 추가
  // 선 굵기 바꾸기
  // 선 색 바꾸기
  // 지우개
  // ctrl + Z (진짜 ctrl+z도 되고, 버튼으로도 되고)
  // 전부 지우기

  const memo = useSelector((state) => state.user.memo); //사용자별 영속성이어야 하기에 Redux-persist로 로컬관리

  const {
    isCanvasOpen,
    canvasRef,
    drawPathLength,
    onDrawing,
    startDrawing,
    stopDrawing,
    onMouseLeave,
    startDrawingForMobile,
    stopDrawingForMobile,
  } = useCanvasDrawing();

  //보기 모드일 때
  // 1. 메서드들을 조건부로 할당하도록 설정하여 보기 모드가 true이면, 핸들러 없도록 함
  // 2. 캔버스 아래에 있는 존재들 클릭 가능하도록 z-index레벨조정해야 함.

  const isMemoShown = (memo.isMemoShown && drawPathLength !== 0) || isCanvasOpen;
  const canvasAttrs = {
    onMouseMove: onDrawing,
    onMouseDown: startDrawing,
    onMouseUp: stopDrawing,
    onMouseLeave: onMouseLeave,
    onTouchStart: startDrawingForMobile,
    onTouchEnd: stopDrawingForMobile,
    onTouchCancel: stopDrawingForMobile,
    onContextMenu: (e) => e.preventDefault(),
  } as CanvasHTMLAttributes<HTMLCanvasElement>;

  return (
    <CanvasFrame isMemoShown={isMemoShown}>
      <Canvas ref={canvasRef} {...(isCanvasOpen && canvasAttrs)} />
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
  transition: opacity 0.1s ease-in;

  ${({ isMemoShown }) =>
    isMemoShown &&
    css`
      z-index: calc(var(--zIndex-2st));
      opacity: 1;
    `}
`;

const Canvas = styled.canvas``;

export default MemoCanvas;
