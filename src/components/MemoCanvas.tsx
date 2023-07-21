import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { debounce } from 'helper/debounce';
import { checkMobile } from 'helper/checkMobile';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { memoCanvasConfig, useSetMemoImpossible } from 'recoil/memo';
import { colors } from 'styles/theme';
import { integerDiff } from 'helper/checkDiff';
import { converURLToImageData } from 'helper/converURLToImageData';
import useIndexedDB, { indexing, tableEnum } from 'hooks/useIndexedDB';
import useCanvasDrawing from 'hooks/useCanvasDrawing';

function MemoCanvas() {
  //bugfix
  // 2. 현재 drawing을 하고 안하고 기준으로 메모가 보이는데, 메모 보는 옵션에 따라 보이고 안보이고로 수정해야 함.

  // todo 텍스트 넣기 기능 추가
  // 선 굵기 바꾸기
  // 선 색 바꾸기
  // 지우개
  // ctrl + Z (진짜 ctrl+z도 되고, 버튼으로도 되고)
  // 전부 지우기

  const {
    isCanvasOpen,
    canvasRef,
    onDrawing,
    startDrawing,
    stopDrawing,
    onMouseLeave,
    startDrawingForMobile,
    stopDrawingForMobile,
  } = useCanvasDrawing();

  return (
    <CanvasFrame isCanvasOpen={isCanvasOpen}>
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

const CanvasFrame = styled.div<{ isCanvasOpen: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  z-index: -9000;
  opacity: 0;
  transition: opacity 0.1s ease-in;

  ${({ isCanvasOpen }) =>
    isCanvasOpen &&
    css`
      z-index: 9000;
      opacity: 1;
    `}
`;

const Canvas = styled.canvas`
  image-rendering: crisp-edges;
`;

export default MemoCanvas;
