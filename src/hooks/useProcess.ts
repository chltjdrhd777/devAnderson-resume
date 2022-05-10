import * as React from 'react';
import { useRef } from 'react';
import { useImmer } from 'use-immer';

interface Process {
  isLoading: boolean;
  isError: boolean;
  isDone: boolean;
  loadingIndicator: number;
}

export function useProcess(callbacks: Function[]) {
  const [process, setProcess] = useImmer<Process>({
    isLoading: false,
    isError: false,
    isDone: false,
    loadingIndicator: 0,
  });

  function reset() {
    setProcess(prev => {
      prev.isLoading = false;
      prev.isError = false;
      prev.isDone = false;
      prev.loadingIndicator = 0;
    });
  }

  function setResultProcess(type: 'success' | 'fail', resetDelay: number) {
    if (type === 'success') {
      setProcess(prev => {
        prev.isDone = true;
      });
      setTimeout(() => {
        reset();
      }, resetDelay);
    }

    if (type === 'fail') {
      setProcess(prev => {
        prev.isError = true;
      });
      setTimeout(() => {
        reset();
      }, resetDelay);
    }
  }

  function setLoadingIndicator(value: number) {
    setProcess(prev => {
      prev.loadingIndicator = value;
    });
  }

  function startProcessing(resetDelay: number) {
    if (process.isLoading) return;

    setProcess(prev => {
      prev.isLoading = true;
    });

    try {
      for (let callback of callbacks) {
        callback();
      }

      setResultProcess('success', resetDelay);
    } catch (err) {
      console.log(err);

      setResultProcess('fail', resetDelay);
    }
  }

  return { process, startProcessing, setLoadingIndicator };
}
