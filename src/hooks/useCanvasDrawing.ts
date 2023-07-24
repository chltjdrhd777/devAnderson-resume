import { integerDiff } from 'helper/checkDiff';
import { checkMobile } from 'helper/checkMobile';
import { converURLToImageData } from 'helper/converURLToImageData';
import { debounce } from 'helper/debounce';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { memoCanvasAtom, memoLengthAtom, useSetMemoImpossible } from 'recoil/memo';
import { colors } from 'styles/theme';
import useIndexedDB, { tableEnum, indexing } from './useIndexedDB';
import useRecoilImmerState from './useImmerState';
import { convertImageDataToURL } from 'helper/convertImageDataToURL';

// Ref로 값을 관리하면
// <Pros>
// 리랜더링과 관계 없이 값이 유지되는 것을 보장하며 값의 변경이 리랜더링을 유발시키지 않는다.
// 비동기 작업에 의해 업데이트되는 상태를 즉각적으로 참조해야 할 때 좋다.

// <Cons>
// 리랜더링을 유발시키지 않는 값이기 때문에, 해당 값을 외부에서 사용할 경우 변경이 안된다.
// 예를 들어, drawPath.current에 있는 배열을 export에 포함시키고 외부에서 이 값을 import해서 사용해도 리랜더링을 유발하지 않으므로 주의한다.

// 즉, 다시 말하자면
// useRef에 인자로 들어가는 값은, 호출 결과로 만들어지는 mutable object의 current 프로퍼티 값으로 할당된다.
// 이 값은 컴포넌트의 생애주기동안 계속 유지되는 값이지만, 이 current의 할당 결과가 변한다고 리랜더링을 유발하지 않는다.
// 즉, 리엑트는 해당 호출 결과로 만들어지는 object 주소 자체를 기록하기때문에, 리랜더링을 하더라도 해당 주소의 값을 계속 이용하고 변경이 없다고 판단한다.
// 따라서, useRef의 값이 변화되는 것으로 인해 리랜더링 시 영향을 주게 되는 상황은 아래와 같다
// a. useRef로 인해서가 아닌, 리랜더링 조건(props 변경, 내부 상태 변경, 부모 리랜더링 등) 이 발생했을 때에는 useRef에 값이 변경된 것이 반영될 수 있다.
// b. useRef에 기록되는 값이 HttpElement와 같은 값이고 이 값의 attribute가 변경되면 리랜더링을 유발시킬 수 있다.

// ref의 값 자체는 애초에 고정되게 바라보고 있는 mutable object의 참조값이기 때문에 변경이 리랜더링을 발생시키지 않으나,
// ref에 html element에 대한 ref로 걸어두어 그 요소 자체를 바라보고 있을 경우, mutable object가 관리하는 값인 element의 attribute 변화는 리랜더링의 대상이다.
// 즉, 이로 추론되는 바는 ref의 current 값이 얕은비교가 되고 있음을 알 수 있다.
// 리랜더링을 유발시키지 않으면 해당 값이 원시값일 경우 변화를 감지시킬 수 없으나
// 참조값일 경우 해당 요소 object 주소를 그대로 사용하더라도 그 안에 관리되는 attribute들의 키 값 벨류들이 변화하게 되면 이것은 리랜더링의 대상이기 때문에 리랜더링이 발생한다.

// 그럼 이런 의문이 들 수 있다. 왜 ref로 관리했냐, state로 하면 깔끔하게 되지 않느냐
// state로 해도 좋긴 하지만 현재 내 로직에는 조금 불편한점이 존재하는데, ref가 아닌 state로 관리하게 될 경우, indexedDB가 초기화되어 첫 데이터를 불러오는 순간
// 또다른 useEffect를 두고 해당 path가 업데이트 될 때(dependency) imageData를 캔버스에 삽입하는 훅이 필요해지는데, 이럴 경우 그냥 그림을 그려도 발동되게 되므로
// 첫 초기 드로잉 데이터를 불러오는 순간에 대한 상태를 따로 만들든가 하는 문제가 생긴다. 그런 불편함으로 인해 ref로 관리하고
// ref의 업데이트를 바로 current로 접근하는 것이 아닌, 일종의 setter을 두고 추가 로직을 하도록 함수를 만들어 책임을 주어지는 것이 합당하다.
// 내 경우, 이 drawPath의 업데이트에 의한 데이터 길이를 외부에 export하고 이 값을 기준으로 UI 가 반응하도록 만들고 싶기 때문에 만든다.(까지 블로그 작성하자. 주제는 ref의 올바른 사용.)

// 이 때, ref의 setter 두는 것은 https://khalilstemmler.com/articles/typescript-value-object/ 이 클래스에서 construction에 대한 public static 메서드 만드는 이유 = 생성에 대한 책임, 단일화 관리(내 useRef 아무대서나 업데이트하던 꼬라지 기억하자)
// 추가적으로 useRef setter은 그냥 바로 내부 추가로직보다는 => props로 콜백함수 받아오는 형식으로 바꿔서 설명

interface Memo {
  snapshot: string;
  dataUrlList: string[];
}

function useCanvasDrawing() {
  const isCanvasOpen = useRecoilValue(memoCanvasAtom).isCanvasOpen;
  const isMobile = checkMobile();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [contextConfig, setContextConfig] = useState<Partial<CanvasRenderingContext2D>>({
    strokeStyle: colors.black,
    lineWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  });

  const drawPathRef = useRef<ImageData[]>([]);
  const [drawPathLength, setDrawPathLength] = useRecoilImmerState(memoLengthAtom);
  const updateDrawPath = (imageData: ImageData) => {
    drawPathRef.current.push(imageData);
    setDrawPathLength(drawPathRef.current.length);
  };
  const drawStartCoordRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [isDrawing, setIsDrawing] = useState(false);
  const { database, saveTransaction, getLastValueFromTable } = useIndexedDB({ dbName: 'resume-indexedDB' });

  const applyContextConfig = () => {
    const context = canvasCtxRef.current ?? {};

    Object.entries(contextConfig).forEach(([key, value]) => {
      context[key] = value;
    });
  };

  const resetDrawingData = () => {
    setIsDrawing(false);
    drawStartCoordRef.current = { x: null, y: null };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsDrawing(true);
    const context = canvasCtxRef.current;
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;
    drawStartCoordRef.current = { x, y };

    context?.beginPath();
    context?.moveTo(x, y);
  };
  const startDrawingForMobile = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const context = canvasCtxRef.current;
    const x = e.touches[0].pageX;
    const y = e.touches[0].pageY;
    drawStartCoordRef.current = { x, y };

    context?.beginPath();
    context?.moveTo(x, y);
  };

  const onDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const context = canvasCtxRef.current;
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;

    if (isCanvasOpen) {
      // 그리지 않을 때, 마우스가 움직이면 canvas의 시작점을 reset하고(beginPath) 재설정(moveTo).

      if (!isDrawing) {
        context?.beginPath();
        context?.moveTo(x, y);
      } else {
        // 그릴 때, 해당 좌표까지 픽셀경로를 만들고(lineTo) 그 픽셀을 채워넣어서 라인을 만든다(stroke).
        applyContextConfig();
        context?.lineTo(x, y);
        context?.stroke();
      }
    }
  };
  const onDrawingForMobile = (e: TouchEvent) => {
    if (isDrawing && isCanvasOpen) {
      e.preventDefault();
      const context = canvasCtxRef.current;
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
    const { x: startX, y: startY } = drawStartCoordRef.current;

    if (integerDiff(endX, startX) !== 0 || integerDiff(endY, startY) !== 0) {
      //만약 그냥 제자리 클릭이 아닐 경우, 드로잉 했던 내용 기록
      saveDrawing();
    }

    resetDrawingData();
  };

  const stopDrawingForMobile = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const endX = e.changedTouches[0]?.pageX;
    const endY = e.changedTouches[0]?.pageY;
    const { x: startX, y: startY } = drawStartCoordRef.current;

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
    const context = canvasCtxRef.current;
    const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
    const lastSavedDataUrl = convertImageDataToURL(drawPathRef.current[drawPathRef.current.length - 1]);

    updateDrawPath(imageData);

    // indexedDB
    const dataUrl = canvas.toDataURL();

    const saveData = {
      snapshot: 'recently saved image dataUrl',
      dataUrlList: [dataUrl, lastSavedDataUrl],
    };
    saveTransaction(tableEnum.memo, saveData, 'put', useSetMemoImpossible);
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { x, y } = drawStartCoordRef.current;
    if (x !== null && y !== null) {
      stopDrawing(e);
    }
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const context = canvasCtxRef.current;
    context?.clearRect(0, 0, canvas.width, canvas.height);

    drawPathRef.current?.forEach((imageData) => {
      context?.putImageData(imageData, 0, 0);
    });
  };

  useEffect(() => {
    // 윈도우 사이즈가 변경될 때마다 캔버스에 사용될 이미지 데이터를 넣는 로직
    const canvas = canvasRef.current;
    const parentElement = canvas.parentElement;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    canvasCtxRef.current = context;

    const updateCanvasSize = () => {
      // const previousSize = { width: canvas.width, height: canvas.height };

      // canvas.width = Math.max(parentElement.clientWidth, previousSize.width);
      // canvas.height = Math.max(parentElement.clientHeight, previousSize.height);

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

  useEffect(() => {
    // 첫 진입시 IndexedDB가 초기화되는 것을 감지하고 그 안에 있는 데이터를 가져오는 로직
    (() =>
      getLastValueFromTable<Memo>(tableEnum.memo, indexing.memo).then(async (value) => {
        if (value && value.dataUrlList) {
          const { dataUrlList } = value;

          for (let dataUrl of dataUrlList) {
            const convertedDataUrl = await converURLToImageData(dataUrl);
            if (convertedDataUrl instanceof ImageData) {
              updateDrawPath(convertedDataUrl);
            }
          }
        }
      }))();
  }, [database]);

  return {
    isCanvasOpen,
    canvasRef,
    drawPathLength,
    onDrawing,
    startDrawing,
    stopDrawing,
    onMouseLeave,
    startDrawingForMobile,
    stopDrawingForMobile,
  };
}

export default useCanvasDrawing;
