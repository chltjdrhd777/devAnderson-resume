import { RecoilState, useRecoilState } from 'recoil';
import { produce, Draft } from 'immer';
import { useCallback } from 'react';

export type DraftFunction<T> = (draft: Draft<T>) => Draft<T>; // setState의 함수형 방식의 형태를 타입지정.
export default function useRecoilImmerState<T>(atom: RecoilState<T>) {
  // setState => immer가 적용된 함수로 변환하여 리턴하는 훅.
  const [state, setState] = useRecoilState(atom);

  // [state, setImmerState]
  // produce로 감쌀 경우, 불변성을 유지하며 상태 업데이트
  return [
    state,
    useCallback(
      (updater: T | DraftFunction<T>) => {
        setState(updater instanceof Function ? produce(updater) : updater);
      },
      [setState],
    ),
  ] as const;
}
