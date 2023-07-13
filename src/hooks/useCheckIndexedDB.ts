import { Dispatch, SetStateAction, useEffect } from 'react';
import { DraftFunction } from './useImmerState';
import { MemoCanvasConfig } from 'recoil/memo';
import { tableEnum } from './useIndexedDB';

function useCheckIndexedDB(
  dbName: string,
  setDatabase: Dispatch<SetStateAction<IDBDatabase>>,
  setCanSaveMemo: (updater: MemoCanvasConfig | DraftFunction<MemoCanvasConfig>) => void,
  createTable: (tableName: string, db: IDBDatabase | null) => IDBObjectStore,
) {
  useEffect(() => {
    const indexedDB =
      window?.indexedDB ||
      (window as any)?.mozIndexedDB ||
      (window as any)?.webkitIndexedDB ||
      (window as any)?.msIndexedDB;

    if (!indexedDB) {
      console.error(`There is no IndexedDB`);
      setCanSaveMemo((draft) => {
        draft.canSaveMemo = false;
        return draft;
      });

      return;
    }

    if (indexedDB) {
      const request = (indexedDB as IDBFactory).open(dbName, 2);

      request.onsuccess = (e) => {
        setDatabase(request.result);
      };
      request.onerror = (e) => {
        console.error(`IndexedDB open error`);
        console.log(e);
        setCanSaveMemo((draft) => {
          draft.canSaveMemo = false;
          return draft;
        });
      };
      request.onupgradeneeded = (e) => {
        // 현재 이 페이지를 보는 사람들은 모두 version 1의 데이터베이스일것이다 "open(dbName,1)".
        // 만약, indexedDB의 스키마를 변경하도록 로직을 짰다고 가정하자.
        // 그리고 이것을 version 2라고 open하도록 했을 경우, 기존 version 1인 클라이언트들은 데이터베이스의 업데이트가 필요해진다.
        // 이 때 사용되는 것이 request.onupgradeneeded이다.
        const db = request.result;
        switch (e.oldVersion) {
          case 0:
            //db가 없는 상태.
            setDatabase(db);
          case 1:
            //db가 있었으나 버전이 1일 때
            createTable(tableEnum.MEMO, db);
        }
      };
    }
  }, []);
}

export default useCheckIndexedDB;
