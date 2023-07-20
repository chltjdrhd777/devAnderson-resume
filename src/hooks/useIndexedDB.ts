import { useState } from 'react';
import useCheckIndexedDB from './useCheckIndexedDB';
import {
  handleCreateErr,
  handleIndexErr,
  handleObjectStoreErr,
  handleOpenCursorErr,
  handleTransactionErr,
} from 'Error/indexedDB';

//해당 로직은 memoCanvas에서만 사용될 것이므로, database instance가 유지될 필요가 없음.
//만약 이 훅이 여러 컴포넌트에 쓰인다면, 매번 호출 때마다 database를 초기화 할 것이므로 비효율적
//따라서, 훅이 여러 컴포넌트에서 쓰일 것 같으면 로직을 class로 모듈화하여 싱글톤 패턴을 고려해야 하는 것이 나아보임.

// 시작 전 고려해야 할 indexedDB error case
// 1. window.indexedDB가 없는 브라우저일 경우
// 2. 저장소 공간이 부족하여 connection 및 CRUD 실패

// 두 케이스에 대해서 모두 다 UI적으로 나타낼 예정이기에, 상태적 관리가 필요함.
// 단, 해당 에러를 나타낼 컴포넌트가 memo component와 다른 장소에 있으므로 Recoil이나, Jotai를 이용해 전역적 상태 조회 시스템 구축 필요.

interface Params {
  dbName: string;
}

export const tableEnum = {
  memo: 'memo',
} as const;
Object.freeze(tableEnum);

export const indexing = {
  memo: 'snapshot',
};

function useIndexedDB({ dbName }: Params) {
  const [database, setDatabase] = useState<IDBDatabase | null>(null);

  // METHOD
  const getDatabase = () => database;

  const destroyDatabase = () => {
    if (!database) {
      console.warn('no database');
      return;
    }

    return indexedDB.deleteDatabase(dbName);
  };

  const createTable = (tableName: string, db: IDBDatabase | null = database) => {
    if (!db) {
      console.error('no database');
      return;
    }

    // store = DB에서 테이블 혹은 컬렉션과 비슷한 개념. 데이터들이 모아지는 장소
    if (!db.objectStoreNames.contains(tableName)) {
      const store = db.createObjectStore(tableName, { keyPath: indexing.memo });
      store.createIndex(indexing.memo, indexing.memo, { unique: true }); // (인덱스 접근자, 객체 키패스, 옵션)

      return store;
    }
  };

  const deleteTable = (tableName: string) => {
    if (database === null) {
      console.error('no database');
      return;
    }

    database.deleteObjectStore(tableName);
  };

  const getLastValueFromTable = <T>(tableName: string, indexing: string) => {
    return new Promise<T>((resolve, reject) => {
      try {
        if (!database) {
          return resolve(undefined);
        }

        const transaction = handleTransactionErr(() => database?.transaction(tableName, 'readonly'));
        const table = handleObjectStoreErr(() => transaction?.objectStore(tableName));
        const index = handleIndexErr(() => table?.index(indexing));
        const openCursor = handleOpenCursorErr(() => index?.openCursor(null, 'prev'));

        if (openCursor) {
          openCursor.onsuccess = (e) => {
            const value = openCursor.result?.value;
            resolve(value);
          };
          openCursor.onerror = (e) => {
            reject(new Error('Failed to retrieve last value from object store'));
          };
        }
      } catch (err) {
        reject({ reason: 'uncaught error', err });
      }
    });
  };

  const saveTransaction = (tableName: string, data: any, type: 'put' | 'add' = 'add', callback?: Function) => {
    if (!database) {
      console.error('no database');
      return;
    }

    try {
      const transaction = handleTransactionErr(() => database?.transaction(tableName, 'readwrite'));
      const table = handleObjectStoreErr(() => transaction?.objectStore(tableName));
      const request = handleCreateErr(() => (type === 'add' ? table?.add(data) : table?.put(data)));
      request.onsuccess = () => console.log('save success');
      request.onerror = (e) => {
        console.error('no suffient space to save data');
        callback && callback();
      };
    } catch (err) {
      console.log('uncaught error', err);
    }
  };

  // indexedDB 조회 후 database 초기화.
  useCheckIndexedDB(dbName, setDatabase, createTable);

  return { database, getDatabase, destroyDatabase, createTable, deleteTable, getLastValueFromTable, saveTransaction };
}

export default useIndexedDB;
