import { useRef } from 'react';
import { memoLimitAtom } from 'recoil/memo';
import { useRecoilValue } from 'recoil';

function useDrawPathRef() {
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

  return { drawPathRef, pushNewImageData };
}

export default useDrawPathRef;
