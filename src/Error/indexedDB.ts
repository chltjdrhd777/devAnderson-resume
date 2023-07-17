import { BaseErrorCase, customErrWrapperGenerator } from 'Error';

const errorNameEnum = {
  transactionError: 'transactionError',
  objectStoreError: 'objectStoreError',
} as const;

type ErrorName = (typeof errorNameEnum)[keyof typeof errorNameEnum];
type ErrorCase = BaseErrorCase<ErrorName>;
const errorCase: ErrorCase = (err) => {
  if (err.name === 'transactionError') {
    console.error(`${err.name} 이 발생했습니다`, err);
  }

  if (err.name === 'objectStoreError') {
    console.error(`${err.name} 이 발생했습니다`, err);
  }

  throw err; //무조건 err를 다시 던지게 하여, 부모 로직에서 이 함수 호출 이후의 로직을 하지 않도록 block한다.
};

export const handleTransactionErr = customErrWrapperGenerator(errorNameEnum.transactionError, errorNameEnum, errorCase);

export const handleObjectStoreErr = customErrWrapperGenerator(errorNameEnum.objectStoreError, errorNameEnum, errorCase);
