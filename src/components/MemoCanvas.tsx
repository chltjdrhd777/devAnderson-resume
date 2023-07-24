import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import useCanvasDrawing from 'hooks/useCanvasDrawing';
import { useSelector } from 'redux/store';

function MemoCanvas() {
  //bugfix
  // 2. 현재 drawing을 하고 안하고 기준으로 메모가 보이는데, 메모 보는 옵션에 따라 보이고 안보이고로 수정해야 함.

  // todo 텍스트 넣기 기능 추가
  // 선 굵기 바꾸기
  // 선 색 바꾸기
  // 지우개
  // ctrl + Z (진짜 ctrl+z도 되고, 버튼으로도 되고)
  // 전부 지우기

  const memo = useSelector((state) => state.user.memo);

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
  return (
    <CanvasFrame isMemoShown={(memo.isMemoShown && drawPathLength !== 0) || isCanvasOpen}>
      <Canvas
        ref={canvasRef}
        onMouseMove={onDrawing}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={onMouseLeave}
        onTouchStart={startDrawingForMobile}
        onTouchEnd={stopDrawingForMobile}
        onTouchCancel={stopDrawingForMobile}
        onContextMenu={(e) => e.preventDefault()}
      />
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
