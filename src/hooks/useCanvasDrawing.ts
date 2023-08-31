import { integerDiff } from 'helper/checkDiff';
import { checkMobile } from 'helper/checkMobile';
import { converURLToImageData } from 'helper/converURLToImageData';
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
import useIndexedDB from './useIndexedDB';
import useRecoilImmerState from './useImmerState';
import useDrawPathRef from './useDrawPathRef';
import { genMergedImageData } from 'helper/genMergedImageData';
import { indexing, tableEnum } from 'indexedDB/versionManager';

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
  const { drawType, penSize } = useRecoilValue(menuConfigAtom);
  const { selectedColor } = useRecoilValue(pickerCircleAtom);
  const isMobile = checkMobile();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const { drawPathRef, setDrawPathRef, pushNewImageData, goBackwardPath, goForwardPath, clearRestDrawPath } =
    useDrawPathRef(redraw, () => saveDrawing(true));
  const drawStartCoordRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const memoPrevImageSize = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const memorizedImageData = useRef<ImageData[]>([]);
  const mergedDataURL = useRef<string | null>(null);
  const [drawPathLength, setDrawPathLength] = useRecoilImmerState(memoLengthAtom);

  const [isDrawing, setIsDrawing] = useState(false);

  const memoContextAttr = useRecoilValue(memoContextAttrAtom);
  const { database, saveValue, getLastValueFromTable } = useIndexedDB({});

  //METHOD
  const updatememoPrevImageSize = async (imageData: ImageData) => {
    memoPrevImageSize.current.width = imageData.width;
    memoPrevImageSize.current.height = imageData.height;
  };

  const updateMemorizedImageData = async (newMemoImage: ImageData) => {
    const { width: newImageWidth, height: newIamgeHeight } = newMemoImage;
    const { width: memorizedPrevWidth, height: memorizedPrevHeight } = memoPrevImageSize.current;
    const isPrevMemoBigger = newImageWidth < memorizedPrevWidth || newIamgeHeight < memorizedPrevHeight;
    // 이전까지 그리던 사이즈보다 작은 사이즈에서 그리게 될 경우
    // drawPathRef에 기록되는 가장 마지막의 기록 = 최대사이즈 스냅샷이므로 이것만 저장하여 최종 저장 데이터 용량 최적화
    // 해당 최적화가 없을 경우, 모든 그려진 drawPath에 대해서 redraw하게되므로 수정한다.
    if (isPrevMemoBigger) {
      const biggerMemoImage = drawPathRef.current[drawPathRef.current.length - 1]; //반응형 전 최대크기 스냅샷
      memorizedImageData.current.push(biggerMemoImage);

      // 추가 최적화
      // 가능성은 적지만, 누군가가 웹사이트에서 메모기능을 쓸 때 화면 크기를 반복적으로 줄였다 늘였다를 반복하며 그릴 경우
      // memorized되는 케이스가 점점 늘어나게 된다 => 저장할 때 오버헤드가 발생할 수 있다.
      // 따라서, 계속 지속적으로 memorized 되는 이미지의 갯수가 늘어나기 보다, memorized 되어있는 배열에서 최대 사이즈의 캔버스를 만들고, 메모를 병합하여 하나의 메모만 관리한다.
      // 해당 작업은 반응형이 발생하는 순간에 항상 3개의 캔버스에 대해서만 발생할 것이기 때문에, 비교적 부담이 적다.(현재이미지, 기존 이미지, 메모라이징되었던 최대사이즈 이미지)
      const { mergedImageData, dataURL } = genMergedImageData([
        newMemoImage,
        biggerMemoImage,
        ...memorizedImageData.current,
      ]);
      memorizedImageData.current = [mergedImageData];
      mergedDataURL.current = dataURL;
    }
  };
  const saveDataUrlToIndexedDb = ({ canvas, dataUrlList }: { canvas?: HTMLCanvasElement; dataUrlList?: string[] }) => {
    const genDataUrlList = () => {
      const baseList: string[] = [];

      if (mergedDataURL.current) {
        baseList.push(mergedDataURL.current);
      }
      baseList.push(canvas.toDataURL());

      return baseList;
    };

    saveValue({
      tableName: tableEnum.memo,
      value: {
        snapshot: indexing.memo,
        dataUrlList: canvas ? genDataUrlList() : dataUrlList ?? [],
      },
      type: 'put',
      onError: () => {
        useSetMemoImpossible();
      },
    });
  };

  const initEmptyCanvas = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 0;
    canvas.height = 0;
    const context = canvas.getContext('2d');

    await updateDrawPathRef(context.getImageData(0, 0, 1, 1));
  };

  const initDrawPath = async (value: Memo) => {
    const dataUrlList = value?.dataUrlList ?? [];
    const convertedImageDataList = await Promise.all(dataUrlList.map((url) => converURLToImageData(url)));
    if (convertedImageDataList.length) {
      const merging = genMergedImageData(convertedImageDataList);
      saveDataUrlToIndexedDb({ dataUrlList: [merging.dataURL] });
      await updateDrawPathRef(merging.mergedImageData);
    } else {
      initEmptyCanvas();
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

  const setStartDrawingCoord = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.PointerEvent<HTMLCanvasElement>,
  ) => {
    drawStartCoordRef.current = { x: e.pageX, y: e.pageY };
  };

  const setMoveTo = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.PointerEvent<HTMLCanvasElement>) => {
    const context = canvasCtxRef.current;
    context?.beginPath();
    context.moveTo(e.pageX, e.pageY);
  };

  const onDrawingStart = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.PointerEvent<HTMLCanvasElement>,
  ) => {
    setIsDrawing(true);
    setStartDrawingCoord(e);
    setMoveTo(e);
  };

  const resetDrawingData = () => {
    setIsDrawing(false);
    drawStartCoordRef.current = { x: null, y: null };
  };

  const clearDrawing = () => {
    const width = Math.max(memoPrevImageSize.current.width, canvasRef.current.parentElement.clientWidth);
    const height = Math.max(memoPrevImageSize.current.height, canvasRef.current.parentElement.clientHeight);
    canvasCtxRef.current?.clearRect(0, 0, width, height);

    setDrawPathRef([]);
    drawStartCoordRef.current = { x: null, y: null };
    memoPrevImageSize.current = {
      width: 0,
      height: 0,
    };
    memorizedImageData.current = [];
    mergedDataURL.current = null;
    setDrawPathLength(0);
  };

  //! mouse event handler
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    onDrawingStart(e);
  };

  const onDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const context = canvasCtxRef.current;
    const x = e.pageX;
    const y = e.pageY;

    if (isCanvasOpen) {
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

  async function saveDrawing(rollback?: boolean) {
    // resize를 하면 canvas의 크기가 바껴 imageData가 사라지기에, 해당 Data를 ref에 기록해둔다.
    const canvas = canvasRef.current;
    const context = canvasCtxRef.current;

    if (!rollback) {
      // 만약 메모를 그리는 상황이었으면(rollback에 주어지는 인자 없음) 해당 캔버스 이미지를 저장하고 drawPathRef에 기록해야하며
      // resetDrawRef에 저장된 배열의 내용은 없어져야 하므로 초기화한다. (포토샵 그림그리다가 ctrl+z후 다시 그려보면 작업내역이 변경되는 것을 참조)
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
      await updateDrawPathRef(imageData);
      clearRestDrawPath();
    }

    // indexedDB
    saveDataUrlToIndexedDb({ canvas });
  }

  //! mobile device(phone or tablet) handler
  const checkPointerType = (pointerType: 'mouse' | 'touch' | 'pen', callback: Function) => {
    if (pointerType === drawType) {
      callback();
    }
  };
  const startDrawingForMobile = (e: React.PointerEvent<HTMLCanvasElement>) => {
    checkPointerType(e.pointerType, () => {
      onDrawingStart(e);
    });
  };
  const onDrawingForMobile = (e: React.PointerEvent<HTMLCanvasElement>) => {
    checkPointerType(e.pointerType, () => {
      const context = canvasCtxRef.current;
      const x = e.pageX;
      const y = e.pageY;

      if (isCanvasOpen) {
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

  function redraw() {
    const canvas = canvasRef.current;
    const context = canvasCtxRef.current;
    context?.clearRect(
      0,
      0,
      Math.max(canvas.width, memoPrevImageSize.current.width),
      Math.max(canvas.height, memoPrevImageSize.current.height),
    );

    drawPathRef.current.forEach((imageData) => {
      context?.putImageData(imageData, 0, 0);
    });
  }
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
      database && getLastValueFromTable<Memo>(tableEnum.memo, indexing.memo).then(initDrawPath);
    })();
  }, [database]);

  return {
    isCanvasOpen,
    canvasRef,
    drawPathLength,
    onDrawing,
    startDrawing,
    stopDrawing,
    saveDrawing,
    onMouseLeave,
    startDrawingForMobile,
    onDrawingForMobile,
    stopDrawingForMobile,
    clearDrawing,
    goBackwardPath,
    goForwardPath,
    database,
  };
}

export default useCanvasDrawing;
