import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { debounce } from 'helper/debounce';
import { checkMobile } from 'helper/checkMobile';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { memoCanvasConfig } from 'recoil/memo';
import { colors } from 'styles/theme';
import { integerDiff } from 'helper/checkDiff';
import { converURIToImageData } from 'helper/converURIToImageData';
import useIndexedDB, { tableEnum } from 'hooks/useIndexedDB';

function MemoCanvas() {
  //bugfix
  // 2. 현재 drawing을 하고 안하고 기준으로 메모가 보이는데, 메모 보는 옵션에 따라 보이고 안보이고로 수정해야 함.
  // 3. 해당 메모 안보이고는 캐싱되는 게 맞아서, 리덕스 저장. 메모했던 내용도 리덕스 저장해서 불러와지는지 확인해야 함.

  // todo 텍스트 넣기 기능 추가
  // 선 굵기 바꾸기
  // 선 색 바꾸기
  // 지우개
  // 그려넣어진 내용 화면 크기 변경에 따라 위치 조정 및 비율조정
  const isCanvasOpen = useRecoilValue(memoCanvasConfig).isCanvasOpen;
  const isMobile = checkMobile();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const [contextConfig, setContextConfig] = useState<Partial<CanvasRenderingContext2D>>({
    strokeStyle: colors.black,
    lineWidth: 1.3,
    lineCap: 'round',
  });

  const drawPath = useRef<ImageData[]>([]);
  const drawDataUrlPath = useRef<string[]>([]);
  const drawStartCoord = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [isDrawing, setIsDrawing] = useState(false);
  const { saveTransaction, getLastValueFromTable } = useIndexedDB({ dbName: 'resume-indexedDB' });

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

    context?.beginPath();
    context?.moveTo(x, y);
    drawStartCoord.current = { x, y };
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
      context?.lineTo(x, y);
      context?.stroke();
    }
  };
  const onDrawingForMobile = (e: TouchEvent) => {
    // 마우스 이벤트와 다르게, 모바일은 터치하는 순간 x,y가 결정되니까
    // 그 x,y를 터치 순간에 업데이트 시켜서 초기점으로 설정하는 로직이 필요하다
    // onDrawing 함수에 통일시킬 경우, 관심사가 분리가 되지 않으므로 따로 핸들러를 분리해서 관리한다.
    if (isDrawing && isCanvasOpen) {
      e.preventDefault();
      const context = canvasCtx.current;
      const x = e.touches[0].pageX;
      const y = e.touches[0].pageY;
      context?.lineTo(x, y);
      context?.stroke();
    }
  };
  canvasRef.current?.addEventListener('touchmove', onDrawingForMobile, { passive: false }); //모바일은 터치드래그 막아야하므로 "e.preventDefault() 해주기 위하여 passive를 false로 둔다."

  const saveDrawing = () => {
    // resize를 하면 canvas의 크기가 바껴 imageData가 사라지기에, 해당 Data를 ref에 기록해둔다.
    // 배열로 저장해서 기록하는 이유는, ctrl+Z 를 구현하기 위함이다. (항상 캔버스 마지막이 가장 최근 스냅샷 데이터임)
    const canvas = canvasRef.current;
    const context = canvasCtx.current;
    drawPath.current.push(context?.getImageData(0, 0, canvas.width, canvas.height));

    // 나중에 새로고침해도 저장된 데이터를 불러올 수 있도록 indexedDB에 저장한다.
    // 이미지 자체를 저장하면 너무 크기 때문에 dataURL로 변환하여 관리한다.

    // 기존
    // const canvasDataUrl = canvas.toDataURL();
    // drawDataUrlPath.current.push(canvasDataUrl);
    // const key = 'memoData';
    // localStorage.setItem(key, JSON.stringify(drawDataUrlPath.current));

    // indexedDB
    const canvasDataUrl = canvas.toDataURL();
    drawDataUrlPath.current.push(canvasDataUrl);
    saveTransaction(
      tableEnum.MEMO,
      {
        snapshot: 'snapshot',
        dataURL: JSON.stringify(drawDataUrlPath.current),
      },
      'put',
    );
  };

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
    // drawPath.current?.forEach((imageData) => {
    //   context?.putImageData(imageData, 0, 0);
    // });
    const lastDrawing = drawPath.current[drawPath.current.length - 1];
    if (lastDrawing) {
      context?.putImageData(lastDrawing, 0, 0);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const parentElement = canvas.parentElement;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.strokeStyle = contextConfig.strokeStyle;
    context.lineWidth = contextConfig.lineWidth;
    context.lineCap = contextConfig.lineCap;
    canvasCtx.current = context;

    const updateCanvasSize = () => {
      canvas.width = parentElement.clientWidth;
      canvas.height = parentElement.clientHeight;

      debounce(redraw, 500)();
    };
    updateCanvasSize();

    // const memoData = localStorage.getItem('memoData');

    // if (memoData) {
    //   const uriList: string[] = JSON.parse(memoData);

    //   converURIToImageData(uriList[uriList.length - 1]).then((data) => {
    //     console.log('imageData', data);
    //     drawPath.current.push(data);
    //   });
    // }

    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <CanvasFrame isCanvasOpen={isCanvasOpen}>
      <Canvas
        ref={canvasRef}
        onMouseMove={onDrawing}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={onMouseLeave}
        // onTouchMove={onDrawingForMobile}
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
  transition: visibility 0.3s ease-in;

  ${({ isCanvasOpen }) =>
    isCanvasOpen &&
    css`
      z-index: 9000;
      opacity: 1;
    `}
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  image-rendering: crisp-edges;
`;

export default MemoCanvas;
