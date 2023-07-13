import { useEffect, useState } from 'react';
import useRecoilImmerState from './useImmerState';
import { memoCanvasConfig } from 'recoil/memo';
import useCheckIndexedDB from './useCheckIndexedDB';

//해당 로직은 memoCanvas에서만 사용될 것이므로, database instance가 유지될 필요가 없음.
//만약 이 훅이 여러 컴포넌트에 쓰인다면, 매번 호출 때마다 database를 초기화 할 것이므로 비효율적
//따라서, 훅이 여러 컴포넌트에서 쓰일 것 같으면 로직을 class로 모듈화하여 싱글톤 패턴을 고려해야 하는 것이 나아보임.

// 시작 전 고려해야 할 indexedDB error case
// 1. window.indexedDB가 없는 브라우저일 경우
// 2. 저장소 공간이 부족하여 connection 및 CRUD 실패

// 두 케이스에 대해서 모두 다 UI적으로 나타낼 예정이기에, 상태적 관리가 필요함.
// 단, 해당 에러를 나타낼 컴포넌트가 memo component와 다른 장소에 있으므로 Recoil이나, Jotai를 이용해 전역적 상태 조회 시스템 구축 필요.

// 최적화할것
// 1. 불필요 반복로직 Proxy 객체로 대체해보기
// 2. 데이터 저장 형태는 맨 마지막 데이터만 있으면 되기 떄문에, 현재 배열로 저장되는 것 수정하기
// 3. saveTranasaction 부분 타입지정 명확하게 하기.("data 부분")
interface Params {
  dbName: string;
}

export const tableEnum = {
  MEMO: 'memo',
} as const;
Object.freeze(tableEnum);

function useIndexedDB({ dbName }: Params) {
  const [database, setDatabase] = useState<IDBDatabase | null>(null);
  const [_, setCanSaveMemo] = useRecoilImmerState(memoCanvasConfig);

  // METHOD
  const getDatabase = () => database;

  const destroyDatabase = () => {
    if (database === null) {
      console.warn('no database');
      return;
    }

    indexedDB.deleteDatabase(dbName);
  };

  const createTable = (tableName: string, db: IDBDatabase | null = database) => {
    if (db === null) {
      console.warn('no database');
      return;
    }

    // store = DB에서 테이블 혹은 컬렉션과 비슷한 개념. 데이터들이 모아지는 장소
    if (!db.objectStoreNames.contains(tableName)) {
      const store = db.createObjectStore(tableName, { keyPath: 'snapshot' });
      store.createIndex('indexing on snapshot', 'snapshot', { unique: true });

      return store;
    }
  };

  const deleteTable = (tableName: string) => {
    if (database === null) {
      console.warn('no database');
      return;
    }

    database.deleteObjectStore(tableName);
  };

  const getLastValueFromTable = (tableName: string) => {
    return new Promise<string | undefined>((resolve, reject) => {
      const transaction = database.transaction(tableName, 'readonly');
      const objectStore = transaction.objectStore(tableName);
      const index = objectStore.index('snapshot');

      const request = index.openCursor(null, 'prev'); // 인덱스를 내림차순으로

      request.onsuccess = (event) => {
        const cursor = request.result;
        if (cursor) {
          const lastValue = cursor.value;
          resolve(lastValue);
        } else {
          resolve(undefined);
        }
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve last value from object store.'));
      };
    });
  };

  const saveTransaction = (tableName: string, data: any, type: 'put' | 'add' = 'add') => {
    if (database === null) {
      console.warn('no database');
      return;
    }

    const transaction = database.transaction(tableName, 'readwrite');
    const table = transaction.objectStore(tableName);
    const request = type === 'add' ? table.add(data) : table.put(data);
    request.onsuccess = () => console.log('save success');
    request.onerror = (e) => {
      console.error('no suffient space to save data');
      setCanSaveMemo((draft) => {
        draft.canSaveMemo = false;
        return draft;
      });
    };
  };

  // indexedDB 조회 후 database 초기화.
  useCheckIndexedDB(dbName, setDatabase, setCanSaveMemo, createTable);

  return { getDatabase, destroyDatabase, createTable, deleteTable, getLastValueFromTable, saveTransaction };
}

export default useIndexedDB;
