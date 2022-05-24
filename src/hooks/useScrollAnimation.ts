import { debounce } from 'helper/debounce';
import * as React from 'react';
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
    document.addEventListener('scroll', onScroll);
  }, []);

  return { scroll };
}

export default useScrollAnimation;
