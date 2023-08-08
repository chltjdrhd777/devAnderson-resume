import styled from '@emotion/styled';
import React, { Ref, RefObject, forwardRef, useEffect, useRef, useState } from 'react';
import { CanvasFrame as BaseCanvasFrame, Canvas as BaseCanvas } from './Canvas/Atom/BaseCanvas';
import { useRecoilValue } from 'recoil';
import { memoCanvasAtom, memoLengthAtom, menuConfigAtom } from 'recoil/memo';
import { useSelector } from 'redux/store';
import { checkMobile } from 'helper/checkMobile';
import { css } from '@emotion/react';
import { useCanvasSizeUpdate } from 'hooks/useCanvasSizeUpdate';

type MemoCanvasRefType = HTMLCanvasElement | null;
interface EraserCanvasProps {}

const EraserCanvas = forwardRef<MemoCanvasRefType, EraserCanvasProps>((props, memoCanvasRef) => {
  const isMobile = checkMobile();
  const isCanvasOpen = useRecoilValue(memoCanvasAtom).isCanvasOpen;
  const drawPathLength = useRecoilValue(memoLengthAtom);
  const currentTool = useRecoilValue(menuConfigAtom).currentTool;

  const [isEraserDown, setIsEraserDown] = useState(false);
  const eraserCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const eraserCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const memoCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  useCanvasSizeUpdate(eraserCanvasRef, eraserCanvasCtxRef, isMobile);

  useEffect(() => {
    const memoCanvas = (memoCanvasRef as RefObject<MemoCanvasRefType>).current;
    memoCanvasCtxRef.current = memoCanvas?.getContext('2d');
  }, [memoCanvasRef]);

  return (
    <EraserCanvasFrame isShown={isCanvasOpen && currentTool === 'eraser'}>
      <Canvas
        ref={eraserCanvasRef}
        isCanvasOpen={isCanvasOpen}
        onMouseDown={(e) => {
          setIsEraserDown(true);
          const x = e.nativeEvent.pageX;
          const y = e.nativeEvent.pageY;

          memoCanvasCtxRef.current.clearRect(x, y, 10, 10);
        }}
      />
      <div>hello</div>
    </EraserCanvasFrame>
  );
});

// eraser event handlers
interface EraserCanvasHandlersProps {
  memoCanvasRef: React.ForwardedRef<HTMLCanvasElement>;
  isEraserDown: boolean;
}
class EraserCanvasHandlers {
  private constructor(
    private memoCanvasRef: EraserCanvasHandlersProps['memoCanvasRef'],
    private isEraserDown: EraserCanvasHandlersProps['isEraserDown'],
  ) {}

  onMouseDown() {}

  static init(props: EraserCanvasHandlersProps) {
    return new EraserCanvasHandlers(props.memoCanvasRef, props.isEraserDown);
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
