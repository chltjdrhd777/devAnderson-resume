import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { checkMobile } from 'helper/checkMobile';
import useRecoilImmerState from 'hooks/useImmerState';
import React, { useEffect, useRef, useState } from 'react';

import { memoContextAttrAtom, pickerCircleAtom } from 'recoil/memo';

const ColorPicker = () => {
  const isMobile = checkMobile();
  const colorBarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorBarCanvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const colorBarRect = useRef<DOMRect | null>(null);
  const pickerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pickerCanvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const pickerCanvasRect = useRef<DOMRect | null>(null);
  const pickerCircleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pickerCircleCanvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const isColorBarPressedRef = useRef(false);
  const isPickerCanvasPressedRef = useRef(false);

  const [memoContextAttr, setMemoAttr] = useRecoilImmerState(memoContextAttrAtom);
  const [pickerCircle, setPickerCircle] = useRecoilImmerState(pickerCircleAtom);
  const [pointerHeight, setPointerHeight] = useState(0);

  const fitToPerent = (canvas: HTMLCanvasElement) => {
    // 그냥 frame없이 캔버스 자체 사이즈를 설정하면 예기치 못한 공간이 남는 버그가 있으므로,
    // 명확하게 크기를 한정하도록 부모 크기를 설정한다.
    const { clientWidth: parentWidth, clientHeight: parentHeight } = canvas.parentElement;
    canvas.width = parentWidth;
    canvas.height = parentHeight;

    return { parentWidth, parentHeight };
  };

  const initColorBarCanvas = () => {
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

  const initPickerCanvas = (rgba?: string) => {
    const pickerCanvas = pickerCanvasRef.current;
    const context = pickerCanvas.getContext('2d');
    const { parentWidth, parentHeight } = fitToPerent(pickerCanvas);

    const saturationGradient = context.createLinearGradient(0, 0, parentWidth, 0);
    saturationGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    saturationGradient.addColorStop(1, rgba ?? memoContextAttr.pickerBackground);

    const valueGradient = context.createLinearGradient(0, 0, 0, parentHeight);
    valueGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    valueGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

    context.fillStyle = saturationGradient;
    context.fillRect(0, 0, parentWidth, parentHeight);
    context.fillStyle = valueGradient;
    context.fillRect(0, 0, parentWidth, parentHeight);
    initSelectedColor();
  };

  const initPickerCircleCanvas = () => {
    const pickerCircleCanvas = pickerCircleCanvasRef.current;
    fitToPerent(pickerCircleCanvas);
  };

  const initSelectedColor = () => {
    const circleOffsetX = pickerCircle.x;
    const circleOffsetY = pickerCircle.y;

    handleRGBA({ offsetX: circleOffsetX, offsetY: circleOffsetY }, pickerCanvasCtx.current, (rgba) => {
      setPickerCircle((draft) => {
        draft.selectedColor = rgba;
        return draft;
      });
    });
  };

  const genPickerCircle = (params: { offsetX?: number; offsetY?: number; initial?: boolean }) => {
    const { offsetX, offsetY, initial } = params;
    const { clientWidth: parentWidth, clientHeight: parentHeight } = pickerCanvasRef.current.parentElement;
    const context = pickerCircleCanvasCtx.current;
    context.strokeStyle = 'black';
    context?.clearRect(0, 0, parentWidth, parentHeight);
    context?.beginPath();
    context?.arc(offsetX ?? pickerCircle.x, offsetY ?? pickerCircle.y, pickerCircle.width, 0, Math.PI * 2);
    context?.stroke();
    context?.closePath();

    if (initial) {
      initSelectedColor();
    }
  };

  const handleRGBA = (
    position: { offsetY: number; offsetX?: number },
    context: CanvasRenderingContext2D,
    setter?: (rgba: string) => any,
  ) => {
    if (context) {
      // 마우스 이벤트 발생 시점 기준으로 1x1 픽셀 데이터를 가져온다.
      // 해당 픽셀의 data 프로퍼티는 배열을 값으로 가지며, 순서대로 RGBA이다. (즉 투명도는 A/255이다.)
      const { offsetX, offsetY } = position;
      const pixelData = offsetX
        ? context?.getImageData(offsetX, offsetY, 1, 1).data
        : context?.getImageData(0, offsetY, 1, 1).data;

      const rgba = `rgba(${pixelData[0]},${pixelData[1]},${pixelData[2]},${pixelData[3] / 255})`;

      if (rgba === 'rgba(0,0,0,0)') return;

      setter && setter(rgba);
    }
  };

  const handlePointerHeight = (offsetY: number) => {
    setPointerHeight(offsetY);

    handleRGBA({ offsetY }, colorBarCanvasCtx.current, (rgba) => {
      setMemoAttr((draft) => {
        draft.pickerBackground = rgba;
        return draft;
      });

      initPickerCanvas(rgba);
    });
  };
  const handlePointerHeightForMobile = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.changedTouches[0];
    const rect = colorBarRect.current;
    const offsetY = touch.clientY - rect.top;

    if (0 <= offsetY && touch.clientY <= rect.bottom) {
      setPointerHeight(offsetY);

      handleRGBA({ offsetY }, colorBarCanvasCtx.current, (rgba) => {
        setMemoAttr((draft) => {
          draft.pickerBackground = rgba;
          return draft;
        });

        initPickerCanvas(rgba);
      });
    }
  };

  const handlePickerCirclePostion = (offsetX: number, offsetY: number) => {
    handleRGBA({ offsetX, offsetY }, pickerCanvasCtx.current, (rgba) => {
      setPickerCircle((draft) => {
        draft.x = offsetX;
        draft.y = offsetY;
        draft.selectedColor = rgba;
        return draft;
      });

      genPickerCircle({ offsetX, offsetY });
    });
  };
  const handlePickerCirclePostionForMobile = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.changedTouches[0];
    const rect = pickerCanvasRect.current;
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    if (0 <= offsetX && touch.clientX <= rect.right && 0 <= offsetY && touch.clientY <= rect.bottom) {
      handleRGBA({ offsetX, offsetY }, pickerCanvasCtx.current, (rgba) => {
        setPickerCircle((draft) => {
          draft.x = offsetX;
          draft.y = offsetY;
          draft.selectedColor = rgba;
          return draft;
        });

        genPickerCircle({ offsetX, offsetY });
      });
    }
  };

  const calculatedOffset = (clientValue: number, minRect: number, maxRect: number) => {
    let offset = 0;

    if (minRect <= clientValue && clientValue <= maxRect) {
      offset = clientValue - minRect;
    } else if (maxRect < clientValue) {
      offset = maxRect - minRect;
    }

    return offset;
  };

  class ColorBarHandlers {
    // mouse에서는 캔버스 바깥에서의 움직임을 잡아내지 못하고 바로 leave로 빠지는 단점이 있어 UX에 좋지 않았다.
    // 따라서 윈도우의 이벤트리스너로 처리할 수 있도록 하였으며, 메서드를 객체로 통합 시 자가참조(this) 사용을 통한 내부 이벤트 해제가 필요하여 class를 사용하였다.
    static onMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (isMobile) return;
      isColorBarPressedRef.current = true;
      handlePointerHeight(event.nativeEvent.offsetY);

      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    };

    private static onMouseMove = (event: MouseEvent) => {
      const { top, bottom } = colorBarRect.current;
      let offsetY = calculatedOffset(event.clientY, top, bottom);

      if (isColorBarPressedRef.current) {
        handlePointerHeight(offsetY);
      }
    };

    private static onMouseUp = () => {
      if (isColorBarPressedRef.current) {
        isColorBarPressedRef.current = false;
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
      }
    };

    static onTouchStart(event: React.TouchEvent<HTMLCanvasElement>) {
      isColorBarPressedRef.current = true;
      handlePointerHeightForMobile(event);
    }

    static onTouchMove(event: React.TouchEvent<HTMLCanvasElement>) {
      if (isColorBarPressedRef.current) {
        handlePointerHeightForMobile(event);
      }
    }

    static onTouchEnd() {
      if (isColorBarPressedRef.current) {
        isColorBarPressedRef.current = false;
      }
    }
  }

  class PickerCircleCanvasHandlers {
    static onMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (isMobile) return;
      isPickerCanvasPressedRef.current = true;
      handlePickerCirclePostion(event.nativeEvent.offsetX, event.nativeEvent.offsetY);

      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    };

    private static onMouseMove = (event: MouseEvent) => {
      const { left, right, top, bottom } = pickerCanvasRect.current;

      let offsetX = calculatedOffset(event.clientX, left, right);
      let offsetY = calculatedOffset(event.clientY, top, bottom);

      if (isPickerCanvasPressedRef.current) {
        handlePickerCirclePostion(offsetX, offsetY);
      }
    };

    private static onMouseUp = () => {
      if (isPickerCanvasPressedRef.current) {
        isPickerCanvasPressedRef.current = false;
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
      }
    };

    static onTouchStart(event: React.TouchEvent<HTMLCanvasElement>) {
      isPickerCanvasPressedRef.current = true;
      handlePickerCirclePostionForMobile(event);
    }

    static onTouchMove(event: React.TouchEvent<HTMLCanvasElement>) {
      if (isPickerCanvasPressedRef.current) {
        handlePickerCirclePostionForMobile(event);
      }
    }

    static onTouchEnd() {
      if (isPickerCanvasPressedRef.current) {
        isPickerCanvasPressedRef.current = false;
      }
    }
  }

  const init = () => {
    initPickerCanvas();
    initColorBarCanvas();
    initPickerCircleCanvas();

    colorBarCanvasCtx.current = colorBarCanvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null;
    pickerCanvasCtx.current = pickerCanvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null;
    pickerCircleCanvasCtx.current =
      pickerCircleCanvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null;

    genPickerCircle({ initial: true });
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    //Rect를 계속 호출시키면 부하가 크므로, 첫 랜더링 시에 만들어서 기록해둔다.
    const updateRects = () => {
      colorBarRect.current = colorBarCanvasRef.current?.getBoundingClientRect();
      pickerCanvasRect.current = pickerCanvasRef.current?.getBoundingClientRect();
    };

    updateRects();

    window.addEventListener('resize', updateRects);
    return () => {
      window.removeEventListener('resize', updateRects);
    };
  }, []);

  return (
    <Wrapper>
      <PickerCanvasFrame>
        <PickerCircleCanvas
          ref={pickerCircleCanvasRef}
          onMouseDown={PickerCircleCanvasHandlers.onMouseDown}
          onTouchStart={PickerCircleCanvasHandlers.onTouchStart}
          onTouchMove={PickerCircleCanvasHandlers.onTouchMove}
          onTouchEnd={PickerCircleCanvasHandlers.onTouchEnd}
          onTouchCancel={PickerCircleCanvasHandlers.onTouchEnd}
        />
        <PickerCanvas ref={pickerCanvasRef} />
      </PickerCanvasFrame>

      <ColorBarCanvasFrame>
        <ColorBarPointer pointerHeight={pointerHeight}>
          <Pointer direction="left" />
          <Pointer direction="right" />
        </ColorBarPointer>
        <ColorBarCanvas
          ref={colorBarCanvasRef}
          onMouseDown={ColorBarHandlers.onMouseDown}
          onTouchStart={ColorBarHandlers.onTouchStart}
          onTouchMove={ColorBarHandlers.onTouchMove}
          onTouchEnd={ColorBarHandlers.onTouchEnd}
          onTouchCancel={ColorBarHandlers.onTouchEnd}
        />
      </ColorBarCanvasFrame>

      <SelectedColor background={pickerCircle.selectedColor} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 12rem;
`;

const PickerCanvasFrame = styled.div`
  width: 12rem;
  height: 100%;
  margin-right: 1rem;
  position: relative;
`;

const PickerCircleCanvas = styled.canvas`
  touch-action: none;
  position: absolute;
  top: 0;
  left: 0;
`;

const PickerCanvas = styled.canvas`
  touch-action: none;
`;

const ColorBarCanvasFrame = styled.div`
  width: 2rem;
  height: 100%;
  position: relative;
`;
const ColorBarCanvas = styled.canvas`
  touch-action: none;
`;

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

const SelectedColor = styled.div<{ background: string }>`
  width: 3.5rem;
  height: 3.5rem;
  background-color: ${({ background }) => background};
`;

export default ColorPicker;
