import { Dispatch, SetStateAction } from 'react';

export const indexing = {
  memo: 'snapshot',
  // userConfig: 'id',
};
Object.freeze(indexing);

export const tableEnum = {
  memo: 'memo',
  userConfig: 'userConfig',
} as const;
Object.freeze(tableEnum);

type SetDatabase = Dispatch<SetStateAction<IDBDatabase>>;
type CreateTable = (tableName: string, db: IDBDatabase | null) => void;
const createTable = (db: IDBDatabase, tableName: string, keyPath?: string): CreateTable => {
  if (!db) {
    console.error('no database');
    return;
  }

  // store = DB에서 테이블 혹은 컬렉션과 비슷한 개념. 데이터들이 모아지는 장소
  if (!db.objectStoreNames.contains(tableName)) {
    if (keyPath) {
      const store = db.createObjectStore(tableName, { keyPath });
      store.createIndex(keyPath, keyPath, { unique: true }); // (인덱스 접근자, 객체 키패스, 옵션)
    } else {
      db.createObjectStore(tableName);
    }
  }
};

export class VersionManager {
  // class로 객체 구현 이유
  // 객체로 버전별 메서드를 구현 후 이것을 모듈화하여 사용하려 했더니 공통적으로 필요한 값들 존재(setDatabase, createTable, db)
  // 이를 한번에 제공했을 때 가지고있으면서 사용할 수 있도록 만들기 위함.
  // 함수 prams로 전달받아서 return값을 객체로 하여 클로져 구현해도 무관.
  constructor(private setDatabase: SetDatabase, private db: IDBDatabase, private oldVersion: number) {}

  update() {
    // break가 없는 이유는, 해당 old버전 전까지 업데이트를 끌어올려야 하기 때문임.(전부 처리되어야 함)
    // 0은 초기 db가 클라이언트 스토리지에 없었을 경우
    switch (this.oldVersion) {
      case 0:
        this.setDatabase(this.db);
      case 1:
        createTable(this.db, tableEnum.memo, indexing.memo);
      case 2:
        createTable(this.db, tableEnum.userConfig);
    }
  }
}
