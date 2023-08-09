import styled from '@emotion/styled';
import React, { Ref, RefObject, forwardRef, useEffect, useRef, useState } from 'react';
import { CanvasFrame as BaseCanvasFrame, Canvas as BaseCanvas } from './Canvas/Atom/BaseCanvas';
import { useRecoilValue } from 'recoil';
import { MenuConfigAtom, memoCanvasAtom, memoLengthAtom, menuConfigAtom } from 'recoil/memo';
import { useSelector } from 'redux/store';
import { checkMobile } from 'helper/checkMobile';
import { css } from '@emotion/react';
import { useUpdateCanvasSize } from 'hooks/useUpdateCanvasSize';

type MemoCanvasRefType = HTMLCanvasElement | null;
interface EraserCanvasProps {}

const EraserCanvas = forwardRef<MemoCanvasRefType, EraserCanvasProps>((props, memoCanvasRef) => {
  const isMobile = checkMobile();
  const isCanvasOpen = useRecoilValue(memoCanvasAtom).isCanvasOpen;
  const menuConfig = useRecoilValue(menuConfigAtom);

  const [isEraserDown, setIsEraserDown] = useState(false);
  const eraserCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const eraserCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const memoCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const eraseLastCoords = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useUpdateCanvasSize(eraserCanvasRef, eraserCanvasCtxRef, isMobile);
  useEffect(() => {
    const memoCanvas = (memoCanvasRef as RefObject<MemoCanvasRefType>).current;
    memoCanvasCtxRef.current = memoCanvas?.getContext('2d');
  }, [memoCanvasRef]);

  const { onMouseDown, onMouseMove, onMouseUp } = EraserCanvasHandlers.init({
    refs: { eraserCanvasRef, eraserCanvasCtxRef, memoCanvasRef, memoCanvasCtxRef, eraseLastCoords },
    states: { isCanvasOpen, isEraserDown, menuConfig },
    setters: { setIsEraserDown },
  });

  return (
    <EraserCanvasFrame isShown={isCanvasOpen && menuConfig.currentTool === 'eraser'}>
      <Canvas
        ref={eraserCanvasRef}
        isCanvasOpen={isCanvasOpen}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    </EraserCanvasFrame>
  );
});

// eraser event handlers
interface EraserCanvasHandlersProps {
  refs: {
    eraserCanvasRef: React.MutableRefObject<HTMLCanvasElement>;
    eraserCanvasCtxRef: React.MutableRefObject<CanvasRenderingContext2D>;
    memoCanvasRef: React.ForwardedRef<HTMLCanvasElement>;
    memoCanvasCtxRef: React.MutableRefObject<CanvasRenderingContext2D>;
    eraseLastCoords: React.MutableRefObject<{
      x: number | null;
      y: number | null;
    }>;
  };
  states: {
    isCanvasOpen: boolean;
    isEraserDown: boolean;
    menuConfig: MenuConfigAtom;
  };
  setters: {
    setIsEraserDown: (value: React.SetStateAction<boolean>) => void;
  };
}
class EraserCanvasHandlers {
  private constructor(
    private refs: EraserCanvasHandlersProps['refs'],
    private states: EraserCanvasHandlersProps['states'],
    private setters: EraserCanvasHandlersProps['setters'],
  ) {}
  private resetEraserData = () => {
    this.setters.setIsEraserDown(false);
    this.refs.eraserCanvasCtxRef.current.clearRect(
      0,
      0,
      this.refs.eraserCanvasRef.current.width,
      this.refs.eraserCanvasRef.current.height,
    );
  };
  private genEraserCircle = (params: { x?: number; y?: number; size: number }) => {
    const { x, y, size } = params;
    const { clientWidth: parentWidth, clientHeight: parentHeight } = this.refs.eraserCanvasRef.current?.parentElement;
    const context = this.refs.eraserCanvasCtxRef.current;
    context.strokeStyle = 'black';
    context?.clearRect(0, 0, parentWidth, parentHeight);
    context?.beginPath();
    context?.arc(x, y, size, 0, Math.PI * 2);
    context?.stroke();
    context?.closePath();
  };
  private eraseMemo = (params: { x?: number; y?: number; size: number }) => {
    const { x, y, size } = params;
    const context = this.refs.memoCanvasCtxRef.current;
    context.globalCompositeOperation = 'destination-out'; //cantext의 그려진 값이 서로 겹칠 경우, 겹쳐진 부분은 보이지 않게 설정.
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.globalCompositeOperation = 'source-over'; //기본값
  };

  onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    this.setters.setIsEraserDown(true);
    const eraseData = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
      size: this.states.menuConfig.eraserSize,
    };

    this.refs.eraseLastCoords.current = { x: eraseData.x, y: eraseData.y };
    this.genEraserCircle(eraseData);
    this.eraseMemo(eraseData);
  };

  onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (this.states.isCanvasOpen && this.states.isEraserDown) {
      const eraseData = {
        x: e.nativeEvent.pageX,
        y: e.nativeEvent.pageY,
        size: this.states.menuConfig.eraserSize,
      };
      this.genEraserCircle(eraseData);
      this.eraseMemo(eraseData);
    }
  };

  onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (this.states.isEraserDown) {
      this.resetEraserData();
    }
  };

  static init(props: EraserCanvasHandlersProps) {
    return new EraserCanvasHandlers(props.refs, props.states, props.setters);
  }
}

// styled
const EraserCanvasFrame = styled(BaseCanvasFrame)`
  width: 100%;
  height: 100%;
  z-index: calc((var(--zIndex-2st) + 100) * -1);
  ${({ isShown }) =>
    isShown &&
    css`
      background-color: red;
      opacity: 0.3;
      z-index: calc(var(--zIndex-2st) + 100);
    `};
`;
const Canvas = styled(BaseCanvas)``;

export default EraserCanvas;
