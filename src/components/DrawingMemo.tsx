import styled from '@emotion/styled';
import { debounce } from 'helper/debounce';
import React, { useEffect, useRef, useState } from 'react';
import { colors } from 'styles/theme';

function DrawingMemo() {
  // todo 텍스트 넣기 기능 추가
  // 선 굵기 바꾸기
  // 선 색 바꾸기
  // 지우개
  // 그려넣어진 내용 화면 크기 변경에 따라 위치 조정 및 비율조정

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawPath = useRef<ImageData[]>([]);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [contextConfig, setContextConfig] = useState<Partial<CanvasRenderingContext2D>>({
    strokeStyle: colors.black,
    lineWidth: 1.3,
  });

  const startDrawing = () => setIsDrawing(true);
  const stopDrawing = () => {
    if (isDrawing) {
      // resize를 하면 canvas의 크기가 바껴 imageData가 사라지기에, 해당 Data를 ref에 기록해둔다.
      const canvas = canvasRef.current;
      const context = canvasCtx.current;
      drawPath.current.push(context?.getImageData(0, 0, canvas.width, canvas.height));
    }

    setIsDrawing(false);
  };
  const onDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const context = canvasCtx.current;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (!isDrawing) {
      // 그리지 않을 때, 마우스가 움직이면 canvas의 시작점을 reset하고(beginPath) 재설정(moveTo).
      context?.beginPath();
      context?.moveTo(x, y);
    } else {
      // 그릴 때, 해당 좌표까지 픽셀경로를 만들고(lineTo) 그 픽셀을 채워넣어서 라인을 만든다(stroke).
      context?.lineTo(x, y);
      context?.stroke();
    }
  };
  const redraw = () => {
    const canvas = canvasRef.current;
    const context = canvasCtx.current;
    context?.clearRect(0, 0, canvas.width, canvas.height);
    drawPath.current?.forEach((imageData) => {
      //todo 둘째, 세째 인자가 드로잉되는 위치 조정값임
      // 따라서, window의 innerWidth를 기록하고 있다가
      // resize 발생 시, reDraw에 이벤트 객체 내의 innerWidth 보내서
      // 기록하고 있었던 기존 window 사이즈와 비교하여 x, y포지션 설정하면 된다.
      context?.putImageData(imageData, 0, 0);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const parentElement = canvas.parentElement;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.strokeStyle = contextConfig.strokeStyle;
    context.lineWidth = contextConfig.lineWidth;
    canvasCtx.current = context;

    const updateCanvasSize = () => {
      const initialSize = { width: canvas.width, height: canvas.height };
      canvas.width = parentElement.clientWidth;
      canvas.height = parentElement.clientHeight;

      debounce(redraw, 500)();
    };
    updateCanvasSize();

    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <CanvasFrame>
      <Canvas
        ref={canvasRef}
        onMouseMove={onDrawing}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onContextMenu={(e) => e.preventDefault()}
      />
    </CanvasFrame>
  );
}

const CanvasFrame = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9000;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

export default DrawingMemo;
