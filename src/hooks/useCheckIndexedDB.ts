import { Dispatch, SetStateAction, useEffect } from 'react';
import { VersionManager } from 'indexedDB/versionManager';
import { useSetMemoImpossible } from 'recoil/memo';

function useCheckIndexedDB(
  dbName: string,
  setDatabase: Dispatch<SetStateAction<IDBDatabase>>,
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
      useSetMemoImpossible();
      return;
    }

    if (indexedDB) {
      const request = (indexedDB as IDBFactory).open(dbName, 2);

      request.onsuccess = (e) => {
        const db = request.result;
        setDatabase(db);

        db.onversionchange = () => {
          db.close();
          alert('데이터베이스 업데이트를 위해 새로고침을 부탁드립니다.');
        };
      };
      request.onerror = (e) => {
        console.error(`IndexedDB open error`);
        console.log(e);
        useSetMemoImpossible();
      };
      request.onupgradeneeded = (e) => {
        // database merger (indexedDB 오픈하여 인스턴스 만든 후, 현 로컬의 indexedDB 확인시 DB가 없거나 버전이 낮으면 호출됨)
        const db = request.result; // 이 콜백 실행 시점에선 open(dbName, 2) 에 대한 인스턴스 초기화 완료 상태.
        const versionManager = new VersionManager(setDatabase, createTable, db, 'memo', e.oldVersion);
        versionManager.update();
      };
    }
  }, []);
}

export default useCheckIndexedDB;
