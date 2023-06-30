import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';

function DrawingMemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = () => setIsDrawing(true);
  const stopDrawing = () => setIsDrawing(false);
  const onDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const context = ctx.current;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (!isDrawing) {
      console.log('그리는 상태는 아니다');
      context.beginPath();
      context.moveTo(x, y);
    } else {
      console.log('그리자', x, y);
      context.lineTo(x, y);
      context.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const parentElement = canvas.parentElement;
    const updateCanvasSize = () => {
      canvas.width = parentElement.clientWidth;
      canvas.height = parentElement.clientHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const context = canvas.getContext('2d');
    context.strokeStyle = 'black';
    context.lineWidth = 1.3;

    ctx.current = context;

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
      ></Canvas>
    </CanvasFrame>
  );
}

const CanvasFrame = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000000;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

export default DrawingMemo;
