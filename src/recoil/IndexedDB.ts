import { atom } from 'recoil';

export interface IndexedDBVersion {
  currentVersion: null | number;
  latestVersion: number;
}
export const indexedDBVersionAtom = atom<IndexedDBVersion>({
  key: 'indexedDBVersionAtom',
  default: {
    currentVersion: null,
    latestVersion: 3,
  },
});

export const indexedDBAtom = atom<IDBDatabase | null>({
  key: 'indexedDBAtom',
  default: null,
});
