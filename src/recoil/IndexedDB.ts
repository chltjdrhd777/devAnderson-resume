import { atom } from 'recoil';

export const indexedDBAtom = atom<IDBDatabase | null>({
  key: 'indexedDBAtom',
  default: null,
});
