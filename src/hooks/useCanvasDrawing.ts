import { integerDiff } from 'helper/checkDiff';
import { checkMobile } from 'helper/checkMobile';
import { converURLToImageData } from 'helper/converURLToImageData';
import { debounce } from 'helper/debounce';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  memoCanvasAtom,
  memoContextAttrAtom,
  memoLengthAtom,
  menuConfigAtom,
  pickerCircleAtom,
  useSetMemoImpossible,
} from 'recoil/memo';
import useIndexedDB, { tableEnum, indexing } from './useIndexedDB';
import useRecoilImmerState from './useImmerState';
import { convertImageDataToURL } from 'helper/convertImageDataToURL';
import useDrawPathRef from './useDrawPathRef';
import { genMergedImageData } from 'helper/genMergedImageData';

// Ref로 값을 관리하면
// <Pros>
// 리랜더링과 관계 없이 값이 유지되는 것을 보장하며 값의 변경이 리랜더링을 유발시키지 않는다.
// 비동기 작업에 의해 업데이트되는 상태를 즉각적으로 참조해야 할 때 좋다.

// <Cons>
// 리랜더링을 유발시키지 않는 값이기 때문에, 해당 값을 외부에서 사용할 경우 변경이 안된다.
// 예를 들어, drawPath.current에 있는 배열을 export에 포함시키고 외부에서 이 값을 import해서 사용해도 리랜더링을 유발하지 않으므로 주의한다.

interface Memo {
  snapshot: string;
  dataUrlList: string[];
}

function useCanvasDrawing() {
  const isCanvasOpen = useRecoilValue(memoCanvasAtom).isCanvasOpen;
  const { currentTool, drawType, penSize } = useRecoilValue(menuConfigAtom);
  const { selectedColor } = useRecoilValue(pickerCircleAtom);
  const isMobile = checkMobile();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawStartCoordRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const { drawPathRef, pushNewImageData } = useDrawPathRef();
  const memoPrevImageSize = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const memorizedImageData = useRef<ImageData[]>([]);
  const mergedDataURL = useRef<string | null>(null);

  const [drawPathLength, setDrawPathLength] = useRecoilImmerState(memoLengthAtom);
  const [isDrawing, setIsDrawing] = useState(false);

  const memoContextAttr = useRecoilValue(memoContextAttrAtom);
  const { database, saveTransaction, getLastValueFromTable } = useIndexedDB({ dbName: 'resume-indexedDB' });

  //METHOD
  const updatememoPrevImageSize = async (imageData: ImageData) => {
    memoPrevImageSize.current.width = imageData.width;
    memoPrevImageSize.current.height = imageData.height;
  };

  const updateMemorizedImageData = async (imageData: ImageData) => {
    const { width: newImageWidth, height: newIamgeHeight } = imageData;
    const { width: memorizedPrevWidth, height: memorizedPrevHeight } = memoPrevImageSize.current;

    // 이전까지 그리던 사이즈보다 작은 사이즈에서 그리게 될 경우
    // drawPathRef에 기록되는 가장 마지막의 기록 = 최대사이즈 스냅샷이므로 이것만 저장하여 최종 저장 데이터 용량 최적화
    // 해당 최적화가 없을 경우, 모든 그려진 drawPath에 대해서 redraw하게되므로 수정한다.

    if (newImageWidth < memorizedPrevWidth || newIamgeHeight < memorizedPrevHeight) {
      const lastDrawPath = drawPathRef.current[drawPathRef.current.length - 1]; //반응형 전 최대크기 스냅샷
      memorizedImageData.current.push(lastDrawPath);

      // 추가 최적화
      // 가능성은 적지만, 누군가가 웹사이트에서 메모기능을 쓸 때 화면 크기를 반복적으로 줄였다 늘였다를 반복하며 그릴 경우
      // memorized되는 케이스가 점점 늘어나게 된다 => 저장할 때 오버헤드가 발생할 수 있다.
      // 따라서, 계속 지속적으로 memorized 되는 이미지의 갯수가 늘어나기 보다, memorized 되어있는 배열에서 최대 사이즈의 캔버스를 만들고, 메모를 병합하여 하나의 메모만 관리한다.
      // 해당 작업은 반응형이 발생하는 순간에 항상 2개의 캔버스에 대해서만 발생할 것이기 때문에, 비교적 부담이 적다.(현재이미지, 기존 최대크기 이미지)
      const { mergedImageData, dataURL } = genMergedImageData([imageData, lastDrawPath]);
      memorizedImageData.current = [mergedImageData];
      mergedDataURL.current = dataURL;
    }
  };

  const initDrawPath = async (value: Memo) => {
    for (let dataUrl of value?.dataUrlList ?? []) {
      const convertedDataUrl = await converURLToImageData(dataUrl);
      convertedDataUrl instanceof ImageData && (await updateDrawPathRef(convertedDataUrl));
    }

    updateCanvasSize(canvasRef.current);
  };
  const updateDrawPathRef = async (imageData: ImageData) => {
    await updateMemorizedImageData(imageData)
      .then(() => updatememoPrevImageSize(imageData))
      .then(() => {
        pushNewImageData(imageData);
        setDrawPathLength(drawPathRef.current.length);
      }); //실행 순서가 중요하여 async를 이용한 then 체이닝 적용.
  };
  const applymemoContextAttr = () => {
    const context = canvasCtxRef.current;

    Object.entries(memoContextAttr).forEach(([key, value]) => {
      context[key] = value;
    });

    context.strokeStyle = selectedColor;
    context.lineWidth = penSize;
  };

  const resetDrawingData = () => {
    setIsDrawing(false);
    drawStartCoordRef.current = { x: null, y: null };
  };

  //! mouse event handler
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsDrawing(true);
    const context = canvasCtxRef.current;
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;
    drawStartCoordRef.current = { x, y };

    context?.beginPath();
    context?.moveTo(x, y);
  };

  const onDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const context = canvasCtxRef.current;
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;

    if (isCanvasOpen && isDrawing) {
      //더블클릭으로 인한 드로잉을 막기 위해 isDrawing 상태를 조건으로 걸어둔다.
      // 그리지 않을 때, 마우스가 움직이면 canvas의 시작점을 reset하고(beginPath) 재설정(moveTo).

      if (!isDrawing) {
        context?.beginPath();
        context?.moveTo(x, y);
      } else {
        // 그릴 때, 해당 좌표까지 픽셀경로를 만들고(lineTo) 그 픽셀을 채워넣어서 라인을 만든다(stroke).
        applymemoContextAttr();
        context?.lineTo(x, y);
        context?.stroke();
      }
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isMobile) {
      return; //debugger 환경에서 touchEnd와 같이 발생하는 부분을 막기 위함.
    }

    if (isDrawing) {
      //모든 캔버스에서 이 조건은 반드시 필요하다. 해당 조건이 없으면 어느 장소에서 클릭을 유지한 상태로 캔버스에 마우스를 떼도 onMoseUp이벤트 동작 조건으로 인식하고 발동된다.
      const endX = e.pageX;
      const endY = e.pageY;
      const { x: startX, y: startY } = drawStartCoordRef.current;

      if (integerDiff(endX, startX) !== 0 || integerDiff(endY, startY) !== 0) {
        // 제자리 클릭이 아니라면, 드로잉이므로 기록한다.
        saveDrawing();
      }

      resetDrawingData();
    }
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { x, y } = drawStartCoordRef.current;
    if (x !== null && y !== null) {
      stopDrawing(e);
    }
  };

  const saveDrawing = () => {
    // resize를 하면 canvas의 크기가 바껴 imageData가 사라지기에, 해당 Data를 ref에 기록해둔다.
    const canvas = canvasRef.current;
    const context = canvasCtxRef.current;
    const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);

    updateDrawPathRef(imageData);

    // indexedDB
    const saveDataUrlToIndexedDb = (canvas: HTMLCanvasElement) => {
      const genDataList = () => {
        const baseList = [];

        if (mergedDataURL.current) {
          baseList.push(mergedDataURL.current);
        }
        baseList.push(canvas.toDataURL());

        return baseList;
      };

      const dataUrlList = genDataList();

      const saveData = {
        snapshot: 'recently saved image dataUrl',
        dataUrlList,
      };
      saveTransaction(tableEnum.memo, saveData, 'put', useSetMemoImpossible);
    };

    saveDataUrlToIndexedDb(canvas);
  };

  //! mobile device(phone or tablet) handler
  const checkPointerType = (pointerType: 'mouse' | 'touch' | 'pen', callback: Function) => {
    if (pointerType === drawType) {
      callback();
    }
  };
  const startDrawingForMobile = (e: React.PointerEvent<HTMLCanvasElement>) => {
    checkPointerType(e.pointerType, () => {
      setIsDrawing(true);
      const context = canvasCtxRef.current;
      const x = e.pageX;
      const y = e.pageY;
      drawStartCoordRef.current = { x, y };

      context?.beginPath();
      context?.moveTo(x, y);
    });
  };
  const onDrawingForMobile = (e: React.PointerEvent<HTMLCanvasElement>) => {
    checkPointerType(e.pointerType, () => {
      if (isDrawing && isCanvasOpen) {
        const context = canvasCtxRef.current;
        const x = e.pageX;
        const y = e.pageY;

        applymemoContextAttr();

        context?.lineTo(x, y);
        context?.stroke();
      }
    });
  };
  const stopDrawingForMobile = (e: React.PointerEvent<HTMLCanvasElement>) => {
    checkPointerType(e.pointerType, () => {
      const endX = e.pageX;
      const endY = e.pageY;
      const { x: startX, y: startY } = drawStartCoordRef.current;

      if (isDrawing) {
        if (integerDiff(endX, startX) !== 0 || integerDiff(endY, startY) !== 0) {
          // 제자리 터치가 아니라면, 드로잉이므로 기록한다.
          saveDrawing();
        }

        resetDrawingData();
      }
    });
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const context = canvasCtxRef.current;
    context?.clearRect(0, 0, canvas.width, canvas.height);

    drawPathRef.current.forEach((imageData) => {
      context?.putImageData(imageData, 0, 0);
    });
  };
  const updateCanvasSize = (canvas: HTMLCanvasElement | null) => {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    redraw();
  };

  useEffect(() => {
    // canvas의 context를 초기 저장하는 로직
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    canvasCtxRef.current = context;
  }, []);

  useEffect(() => {
    // 윈도우 사이즈가 변경될 때마다 캔버스에 사용될 이미지 데이터를 넣는 로직
    const resizeHandler = () => updateCanvasSize(canvasRef.current);

    if (!isMobile) {
      window.addEventListener('resize', resizeHandler);
      return () => {
        window.removeEventListener('resize', resizeHandler);
      };
    }
  }, [isMobile]);

  useEffect(() => {
    // 첫 진입시 IndexedDB가 초기화되는 것을 감지하고 그 안에 있는 데이터를 가져오는 로직
    // useEffect 내에서 비동기 함수 호출을 위함이라 IIEF로 적용
    (() => {
      getLastValueFromTable<Memo>(tableEnum.memo, indexing.memo).then(initDrawPath);
    })();
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
    onDrawingForMobile,
    stopDrawingForMobile,
  };
}

export default useCanvasDrawing;
