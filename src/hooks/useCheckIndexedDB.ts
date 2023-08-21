import { Dispatch, SetStateAction, useEffect } from 'react';
import { VersionManager, indexing, tableEnum } from 'indexedDB/versionManager';
import { useSetMemoImpossible } from 'recoil/memo';
import useRecoilImmerState from './useImmerState';
import { indexedDBVersionAtom } from 'recoil/IndexedDB';
import { handleIndexErr, handleObjectStoreErr, handleOpenCursorErr, handleTransactionErr } from 'Error/indexedDB';

const getLastValueFromTable = <T>(database: IDBDatabase, tableName: string, indexing: string) => {
  return new Promise<T>((resolve, reject) => {
    try {
      if (!database) {
        return resolve(undefined);
      }

      const transaction = handleTransactionErr(() => database?.transaction(tableName, 'readonly'));
      const table = handleObjectStoreErr(() => transaction?.objectStore(tableName));
      const index = handleIndexErr(() => table?.index(indexing));
      const getValueByCursor = handleOpenCursorErr(() => {
        const cursor = index?.openCursor(null, 'prev');
        cursor.onsuccess = (e) => {
          const value = cursor.result?.value;
          resolve(value);
        };
        cursor.onerror = (e) => {
          reject(new Error('Failed to retrieve last value from object store'));
        };
      });
    } catch (err) {
      reject({ reason: 'uncaught error', err });
    }
  });
};

function useCheckIndexedDB(
  database: IDBDatabase | null,
  setDatabase: Dispatch<SetStateAction<IDBDatabase>>,
  dbName: string,
) {
  const [indexedDBVersion] = useRecoilImmerState(indexedDBVersionAtom);

  useEffect(() => {
    if (database !== null) {
      return;
    }

    // 브라우저별 API 지원유무 파악
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
      const request = (indexedDB as IDBFactory).open(dbName, indexedDBVersion.latestVersion);

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
        const db = request.result;
        const versionManager = new VersionManager(setDatabase, db, e.oldVersion);
        versionManager.update().then(() => {
          getLastValueFromTable(db, tableEnum.memo, indexing.memo);
        });
      };
    }
  }, []);
}

export default useCheckIndexedDB;
