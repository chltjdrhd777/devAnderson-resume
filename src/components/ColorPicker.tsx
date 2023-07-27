import styled from '@emotion/styled';
import React, { DOMAttributes, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { colors } from 'styles/theme';

const ColorPicker = () => {
  const colorBarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorBarCanvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const pickerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pickerCanvasCtx = useRef<CanvasRenderingContext2D | null>(null);

  const [isColorBarPressed, setIsColorBarPressed] = useState(false);

  const [pickerBackground, setPickerBackground] = useState<string>('rgba(255, 0, 0, 1)');
  const [pickerCircle, setPickerCircle] = useState({ x: 10, y: 10, width: 7, height: 7 });

  const fitToPerent = (canvas: HTMLCanvasElement) => {
    // 그냥 frame없이 캔버스 자체 사이즈를 설정하면 예기치 못한 공간이 남는 버그가 있으므로,
    // 명확하게 크기를 한정하도록 부모 크기를 설정한다.
    const { clientWidth: parentWidth, clientHeight: parentHeight } = canvas.parentElement;
    canvas.width = parentWidth;
    canvas.height = parentHeight;

    return { parentWidth, parentHeight };
  };

  const initColorBar = () => {
    const colorBarCanvas = colorBarCanvasRef.current;
    const context = colorBarCanvas.getContext('2d');
    const { parentWidth, parentHeight } = fitToPerent(colorBarCanvas);

    const gradient = context.createLinearGradient(0, 0, 0, parentHeight);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, parentWidth, parentHeight);
  };

  const initPicker = () => {
    const pickerCanvas = pickerCanvasRef.current;
    const context = pickerCanvas.getContext('2d');
    const { parentWidth, parentHeight } = fitToPerent(pickerCanvas);

    const saturationGradient = context.createLinearGradient(0, 0, parentWidth, 0);
    saturationGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    saturationGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    const valueGradient = context.createLinearGradient(0, 0, 0, parentHeight);
    valueGradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); //transparent
    valueGradient.addColorStop(1, 'rgba(0, 0, 0, 1)'); //black

    const colorGradient = context.createLinearGradient(0, 0, parentWidth, 0);

    context.fillStyle = saturationGradient;
    context.fillRect(0, 0, parentWidth, parentHeight);
    context.fillStyle = valueGradient;
    context.fillRect(0, 0, parentWidth, parentHeight);
    // Draw circle
    // context.beginPath();
    // context.arc(pickerCircle.x, pickerCircle.y, pickerCircle.width, 0, Math.PI * 2);
    // context.strokeStyle = 'black';
    // context.stroke();
    // context.closePath();
  };

  const handleRGBA = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    context: CanvasRenderingContext2D,
    type: 'colorBar' | 'colorPicker',
    setter?: Function,
  ) => {
    if (context) {
      const mouseX = event.nativeEvent.offsetX;
      const mouseY = event.nativeEvent.offsetY;

      // 마우스 이벤트 발생 시점 기준으로 1x1 픽셀 데이터를 가져온다.
      // 해당 픽셀의 data 프로퍼티는 배열을 값으로 가지며, 순서대로 RGBA이다. (즉 투명도는 A/255이다.)

      const pixelData = context?.getImageData(0, mouseY, 1, 1).data;

      const rgba = `rgba(${pixelData[0]},${pixelData[1]},${pixelData[2]},${pixelData[3] / 255})`;
      if (type === 'colorBar' && rgba === 'rgba(0,0,0,0)') return;

      setter && setter(rgba);
    }
  };

  const colorBarMethods: DOMAttributes<HTMLCanvasElement> = {
    onMouseDown(event) {},

    onMouseMove(event) {
      handleRGBA(event, colorBarCanvasCtx.current, 'colorBar', setPickerBackground);
    },
  };

  const onMouseDown = (e) => {
    let currentX = e.clientX - pickerCanvasRef.current.offsetLeft;
    let currentY = e.clientY - pickerCanvasRef.current.offsetTop;
    if (
      currentY > pickerCircle.y &&
      currentY < pickerCircle.y + pickerCircle.width &&
      currentX > pickerCircle.x &&
      currentX < pickerCircle.x + pickerCircle.width
    ) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      setPickerCircle({ x: currentX, y: currentY, width: pickerCircle.width, height: pickerCircle.height });
    }
  };

  const onMouseMove = (e) => {
    let currentX = e.clientX - pickerCanvasRef.current.offsetLeft;
    let currentY = e.clientY - pickerCanvasRef.current.offsetTop;
    setPickerCircle({ x: currentX, y: currentY, width: pickerCircle.width, height: pickerCircle.height });
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  useLayoutEffect(() => {
    initPicker();
    initColorBar();

    colorBarCanvasCtx.current = colorBarCanvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null;
    pickerCanvasCtx.current = pickerCanvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null;
  }, []);

  return (
    <Wrapper>
      <PickerCanvasFrame background={pickerBackground}>
        <PickerCanvas ref={pickerCanvasRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} />
      </PickerCanvasFrame>

      <ColorBarCanvasFrame>
        <ColorBar>
          <svg
            width="6"
            height="6"
            fill="white"
            stroke="black"
            strokeWidth="0.8"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,10 L18,0 Q18,0 20,2 L20,18 Q20,18 18,20 L0,10 Z" />
          </svg>
        </ColorBar>
        <ColorBarCanvas ref={colorBarCanvasRef} onMouseMove={colorBarMethods.onMouseMove} />
      </ColorBarCanvasFrame>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 12rem;
`;

const PickerCanvasFrame = styled.div<{ background: string }>`
  width: 12rem;
  height: 100%;
  margin-right: 1rem;
  background: ${({ background }) => background};
`;
const PickerCanvas = styled.canvas``;

const ColorBarCanvasFrame = styled.div`
  width: 2rem;
  height: 100%;
  position: relative;
`;
const ColorBar = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  background-color: blue;
`;
const ColorBarCanvas = styled.canvas``;

export default ColorPicker;
