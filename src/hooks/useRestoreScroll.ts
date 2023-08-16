import React, { useEffect, useLayoutEffect } from 'react';

export function useRestoreScroll() {
  useEffect(() => {
    history.scrollRestoration = 'manual';
  }, []);
}

export default useRestoreScroll;
