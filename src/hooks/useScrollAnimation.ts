import { debounce } from 'helper/debounce';
import { useState, useEffect, useCallback } from 'react';

function useScrollAnimation() {
  const [scroll, setScroll] = useState(false);

  const debounceScroll = useCallback(
    debounce(() => setScroll(false), 400),
    [],
  );

  const onScroll = () => {
    if (scroll) return;
    setScroll(true);
    debounceScroll();
  };

  useEffect(() => {
    // 동일 이벤트는 discarded되므로, 여러번 호출되도 하나의 이벤트만 등록됌.
    document.addEventListener('scroll', onScroll);
  }, []);

  return { scroll };
}

export default useScrollAnimation;
