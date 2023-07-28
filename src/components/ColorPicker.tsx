import { css } from '@emotion/react';
import styled from '@emotion/styled';
import useRecoilImmerState from 'hooks/useImmerState';
import React, { DOMAttributes, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { memoCanvasAtom, memoContextAttrAtom } from 'recoil/memo';

const ColorPicker = () => {
  const colorBarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorBarCanvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const colorBarRect = useRef<DOMRect | null>(null);
  const pickerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pickerCanvasCtx = useRef<CanvasRenderingContext2D | null>(null);

  const { isCanvasOpen } = useRecoilValue(memoCanvasAtom);
  const [memoContextAttr, setMemoAttr] = useRecoilImmerState(memoContextAttrAtom);
  const [isColorBarPressed, setIsColorBarPressed] = useState(false);
  const [PointerHeight, setPointerHeight] = useState(0);

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
    setter?: (rgba: string) => any,
  ) => {
    if (context) {
      const mouseY = event.nativeEvent.offsetY;

      // 마우스 이벤트 발생 시점 기준으로 1x1 픽셀 데이터를 가져온다.
      // 해당 픽셀의 data 프로퍼티는 배열을 값으로 가지며, 순서대로 RGBA이다. (즉 투명도는 A/255이다.)

      const pixelData = context?.getImageData(0, mouseY, 1, 1).data;

      const rgba = `rgba(${pixelData[0]},${pixelData[1]},${pixelData[2]},${pixelData[3] / 255})`;
      if (rgba === 'rgba(0,0,0,0)') return;

      setter && setter(rgba);
    }
  };

  const handlePointerHeight = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const offsetY = event.nativeEvent.offsetY;

    setPointerHeight(offsetY);
    handleRGBA(event, colorBarCanvasCtx.current, (rgba) => {
      setPickerBackground(rgba);
    });
  };
  const handlePointerHeightForMobile = (event: React.TouchEvent<HTMLCanvasElement>) => {};

  const colorBarMethods: DOMAttributes<HTMLCanvasElement> & { [key: string]: any } = {
    onMouseDown(event) {
      setIsColorBarPressed(true);

      handlePointerHeight(event);
    },

    onMouseMove(event) {
      if (isColorBarPressed) {
        handlePointerHeight(event);
      }
    },

    onMouseUp() {
      if (isColorBarPressed) {
        //캔버스에서 mouseUp이벤트는 항상 상태를 조건으로 걸어야 불필요한 mouseUp이벤트를 방지할 수 있다.
        setIsColorBarPressed(false);
      }
    },

    onMouseLeave() {
      if (isColorBarPressed) {
        //캔버스에서 mouseUp이벤트는 항상 상태를 조건으로 걸어야 불필요한 mouseUp이벤트를 방지할 수 있다.
        setIsColorBarPressed(false);
      }
    },
  };
  colorBarCanvasRef.current?.addEventListener('touchmove', colorBarMethods.onMouseMove as any, { passive: false });

  useEffect(() => {
    initPicker();
    initColorBar();

    colorBarCanvasCtx.current = colorBarCanvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null;
    pickerCanvasCtx.current = pickerCanvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null;
  }, []);

  useEffect(() => {
    const updateRects = () => {
      colorBarRect.current = colorBarCanvasRef.current?.getBoundingClientRect();
    };

    updateRects();

    window.addEventListener('resize', updateRects);
    return () => {
      window.removeEventListener('resize', updateRects);
    };
  }, []);

  return (
    <Wrapper>
      <PickerCanvasFrame background={pickerBackground}>
        <PickerCanvas ref={pickerCanvasRef} />
      </PickerCanvasFrame>

      <ColorBarCanvasFrame>
        <ColorBarPointer pointerHeight={PointerHeight}>
          <Pointer direction="left" />
          <Pointer direction="right" />
        </ColorBarPointer>
        <ColorBarCanvas
          ref={colorBarCanvasRef}
          onMouseDown={colorBarMethods.onMouseDown}
          onMouseMove={colorBarMethods.onMouseMove}
          onMouseUp={colorBarMethods.onMouseUp}
          onMouseLeave={colorBarMethods.onMouseLeave}
        />
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
const ColorBarCanvas = styled.canvas``;

const ColorBarPointer = styled.div<{ pointerHeight: number }>`
  width: 100%;
  position: absolute;
  top: ${({ pointerHeight }) => pointerHeight + 'px'};
`;
const PointerSVG = styled.svg<{ direction: 'left' | 'right' }>`
  --pointer-size: 0.6rem;

  width: var(--pointer-size);
  height: var(--pointer-size);
  position: absolute;
  top: calc(var(--pointer-size) * -0.5);

  ${({ direction }) =>
    direction === 'left'
      ? css`
          right: calc(var(--pointer-size) * -1);
        `
      : css`
          transform: scaleX(-1);
          left: calc(var(--pointer-size) * -1);
        `};
`;
const Pointer = ({ direction }: { direction: 'left' | 'right' }) => {
  return (
    <PointerSVG
      direction={direction}
      fill="white"
      stroke="black"
      strokeWidth="0.8"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0,10 L18,0 Q18,0 20,2 L20,18 Q20,18 18,20 L0,10 Z" />
    </PointerSVG>
  );
};

export default ColorPicker;
