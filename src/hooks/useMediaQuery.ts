import { useState, useEffect } from 'react';
import { DeviceSize } from 'styles/theme';

const useMediaQuery = (deviceSize: DeviceSize) => {
  const minWidth = +deviceSize.match(/\d+/)[0];
  const query = `(min-width: ${minWidth}px)`;
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 1. 첫 마운트 시 상태 파악
    setMatches(mediaQuery.matches);

    // 2. 변경이 일어났을 시
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
