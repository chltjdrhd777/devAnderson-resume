import { useEffect } from 'react';
import { useImmer } from 'use-immer';

interface Process {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  loadingIndicator: number;
}

export function useProcess(callbacks: Function[] | Function) {
  const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    loadingIndicator: 0,
  };

  const [process, setProcess] = useImmer<Process>({
    ...initialState,
  });

  function reset() {
    setProcess({ ...initialState });
  }

  function setProcessResult(type: 'success' | 'fail') {
    if (type === 'success') {
      setProcess((prev) => {
        prev.isSuccess = true;
      });
    }

    if (type === 'fail') {
      setProcess((prev) => {
        prev.isError = true;
      });
    }

    // loading 종료
    setProcess((prev) => {
      prev.isLoading = false;
      prev.loadingIndicator = 0;
    });
  }

  function setLoadingIndicator(value: number) {
    setProcess((prev) => {
      prev.loadingIndicator += value;
    });
  }

  async function startProcessing(delay: number) {
    //loading 중에는 추가적인 processing 제한.
    if (process.isLoading) return;

    //첫 시작 시, 상태 초기화하고 시작하기.
    reset();

    setProcess((prev) => {
      prev.isLoading = true;
    });

    // 너무 다운로드가 빨라서 임시로 로딩 바를 보여주기 위해 걸어둔 딜레이 로직
    await new Promise((resolve) => {
      const timerId = setInterval(() => setLoadingIndicator(1000), 1000);

      setTimeout(() => {
        clearInterval(timerId);
        resolve('clear');
      }, delay);
    });

    try {
      if (!Array.isArray(callbacks)) {
        // 단일 함수가 인자로 들어와도 함수 배열로 처리되도록
        callbacks = [callbacks as Function];
      }

      for (let callback of callbacks) {
        await callback();
      }
      setProcessResult('success');
    } catch (err) {
      console.log('callback 처리 중 에러가 발생했습니다', err);
      setProcessResult('fail');
    }
  }

  return { process, startProcessing, setLoadingIndicator };
}
