import { tableEnum } from 'hooks/useIndexedDB';
import { Dispatch, SetStateAction } from 'react';

type SetDatabase = Dispatch<SetStateAction<IDBDatabase>>;
type CreateTable = (tableName: string, db: IDBDatabase | null) => IDBObjectStore;
export class VersionManager {
  // class로 객체 구현 이유
  // 객체로 버전별 메서드를 구현 후 이것을 모듈화하여 사용하려 했더니 공통적으로 필요한 값들 존재(setDatabase, createTable, db)
  // 이를 한번에 제공했을 때 가지고있으면서 사용할 수 있도록 만들기 위함.
  // 함수 prams로 전달받아서 return값을 객체로 하여 클로져 구현해도 무관.
  constructor(
    private setDatabase: SetDatabase,
    private createTable: CreateTable,
    private db: IDBDatabase,
    private tableName: (typeof tableEnum)[keyof typeof tableEnum],
    private oldVersion: number,
  ) {}

  update() {
    // break가 없는 이유는, 해당 old버전 전까지 업데이트를 끌어올려야 하기 때문임.(전부 처리되어야 함)
    switch (this.oldVersion) {
      case 0:
        this.setDatabase(this.db);
      case 1:
        this.createTable(this.tableName, this.db);
    }
  }
}
