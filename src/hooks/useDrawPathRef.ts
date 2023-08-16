import { useRef } from 'react';
import { memoLimitAtom } from 'recoil/memo';
import { useRecoilValue } from 'recoil';

function useDrawPathRef() {
  // path 최적화
  // 모든 path를 기록할 경우, 매 resize에 모든 이미지를 다 업데이트해야한다.
  // 사실상 canvas에 저장되는 이미지가 전부 다 필요하지 않고, 마지막 이미지와 반응형에 따라 저장되는 그 당시 최대 크기 스냅샷만 필요하므로
  // 최대 저장 크기 갯수만큼만 저장해두면 오버헤드가 발생하지 않는다 (최대저장갯수 크기는 추후 되돌리기 기능을 위함)
  const drawPathLimit = useRecoilValue(memoLimitAtom);
  const drawPathRef = useRef<ImageData[]>([]);

  const pushNewImageData = (imageData: ImageData) => {
    if (drawPathRef.current.length >= drawPathLimit) {
      const sliced = drawPathRef.current.slice(1);
      sliced.push(imageData);
      drawPathRef.current = sliced;
    } else {
      drawPathRef.current.push(imageData);
    }
  };
  const setDrawPathRef = (value: ImageData[]) => {
    drawPathRef.current = value;
  };

  return { drawPathRef, pushNewImageData, setDrawPathRef };
}

export default useDrawPathRef;
