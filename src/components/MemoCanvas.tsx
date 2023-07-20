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

interface Memo {
  snapshot: string;
  dataUrl: string;
}

function MemoCanvas() {
  //bugfix
  // 2. 현재 drawing을 하고 안하고 기준으로 메모가 보이는데, 메모 보는 옵션에 따라 보이고 안보이고로 수정해야 함.

  // todo 텍스트 넣기 기능 추가
  // 선 굵기 바꾸기
  // 선 색 바꾸기
  // 지우개
  // ctrl + Z (진짜 ctrl+z도 되고, 버튼으로도 되고)
  // 전부 지우기

  const isCanvasOpen = useRecoilValue(memoCanvasConfig).isCanvasOpen;
  const isMobile = checkMobile();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const [contextConfig, setContextConfig] = useState<Partial<CanvasRenderingContext2D>>({
    strokeStyle: colors.black,
    lineWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  });

  const drawPath = useRef<ImageData[]>([]);
  const drawStartCoord = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [isDrawing, setIsDrawing] = useState(false);
  const { database, saveTransaction, getLastValueFromTable } = useIndexedDB({ dbName: 'resume-indexedDB' });

  const applyContextConfig = () => {
    const context = canvasCtx.current ?? {};

    Object.entries(contextConfig).forEach(([key, value]) => {
      context[key] = value;
    });
  };

  const resetDrawingData = () => {
    setIsDrawing(false);
    drawStartCoord.current = { x: null, y: null };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsDrawing(true);
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;
    drawStartCoord.current = { x, y };
  };
  const startDrawingForMobile = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const context = canvasCtx.current;
    const x = e.touches[0].pageX;
    const y = e.touches[0].pageY;
    drawStartCoord.current = { x, y };

    // 움직일때마다 x,y가 결정되는 마우스 이벤트와 다르게, 모바일은 터치하는 순간 x,y가 결정되니까
    // 그 x,y를 터치 순간에 업데이트 시켜서 초기점으로 설정하는 로직이 필요하다.
    context?.beginPath();
    context?.moveTo(x, y);
  };

  const onDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const context = canvasCtx.current;
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;

    if (!isDrawing || !isCanvasOpen) {
      // 그리지 않을 때, 마우스가 움직이면 canvas의 시작점을 reset하고(beginPath) 재설정(moveTo).
      context?.beginPath();
      context?.moveTo(x, y);
    } else {
      // 그릴 때, 해당 좌표까지 픽셀경로를 만들고(lineTo) 그 픽셀을 채워넣어서 라인을 만든다(stroke).
      applyContextConfig();
      context?.lineTo(x, y);
      context?.stroke();
    }
  };
  const onDrawingForMobile = (e: TouchEvent) => {
    if (isDrawing && isCanvasOpen) {
      e.preventDefault();
      const context = canvasCtx.current;
      const x = e.touches[0].pageX;
      const y = e.touches[0].pageY;
      applyContextConfig();

      context?.lineTo(x, y);
      context?.stroke();
    }
  };
  // 모바일은 터치드래그 막아야하므로 "e.preventDefault() 해주기 위하여 passive를 false로 둔다."
  // passive[default : true] = 모바일 환경에서 부드러운 스크롤 위해 스크롤 처리 미리하도록 함. 이게 true일 경우, preventDefault 사용 불가.
  canvasRef.current?.addEventListener('touchmove', onDrawingForMobile, { passive: false });

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isMobile) {
      return; //debugger 환경에서 touchEnd와 같이 발생하는 부분을 막기 위함.
    }

    const endX = e.pageX;
    const endY = e.pageY;
    const { x: startX, y: startY } = drawStartCoord.current;

    if (integerDiff(endX, startX) !== 0 || integerDiff(endY, startY) !== 0) {
      //만약 그냥 제자리 클릭이 아닐 경우, 드로잉 했던 내용 기록
      saveDrawing();
    }

    resetDrawingData();
  };

  const stopDrawingForMobile = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const endX = e.changedTouches[0]?.pageX;
    const endY = e.changedTouches[0]?.pageY;
    const { x: startX, y: startY } = drawStartCoord.current;

    if (
      (e.changedTouches !== undefined && e.changedTouches.length !== 0 && integerDiff(endX, startX) !== 0) ||
      integerDiff(endY, startY) !== 0
    ) {
      //만약 그냥 제자리 클릭이 아닐 경우, 드로잉 했던 내용 기록
      saveDrawing();
    }

    resetDrawingData();
  };

  const saveDrawing = () => {
    // resize를 하면 canvas의 크기가 바껴 imageData가 사라지기에, 해당 Data를 ref에 기록해둔다.
    const canvas = canvasRef.current;
    const context = canvasCtx.current;
    const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
    drawPath.current.push(imageData);

    // indexedDB
    const dataUrl = canvas.toDataURL();

    const saveData = {
      snapshot: 'recently saved image dataUrl',
      dataUrl,
    };
    saveTransaction(tableEnum.memo, saveData, 'put', useSetMemoImpossible);
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { x, y } = drawStartCoord.current;
    if (x !== null && y !== null) {
      stopDrawing(e);
    }
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const context = canvasCtx.current;
    context?.clearRect(0, 0, canvas.width, canvas.height);

    drawPath.current?.forEach((imageData) => {
      context?.putImageData(imageData, 0, 0);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const parentElement = canvas.parentElement;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    canvasCtx.current = context;

    const updateCanvasSize = () => {
      const previousSize = { width: canvas.width, height: canvas.height };

      canvas.width = Math.max(parentElement.clientWidth, previousSize.width);
      canvas.height = Math.max(parentElement.clientHeight, previousSize.height);

      debounce(redraw, 500)();
    };
    updateCanvasSize();

    // 캔버스 떠있으면 아래에 이상한 여백 생기는 문제 해결해야 함.
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    (() =>
      getLastValueFromTable<Memo>(tableEnum.memo, indexing.memo).then(async (value) => {
        if (value && value.dataUrl) {
          const { dataUrl } = value;

          const convertedDataUrl = await converURLToImageData(dataUrl);
          if (convertedDataUrl instanceof ImageData) {
            drawPath.current.push(convertedDataUrl);
          }
        }
      }))();
  }, [database]);

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
