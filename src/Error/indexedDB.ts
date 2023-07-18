import { BaseErrorCase, customErrHandlerGenerator, customErrorBoundaryGenerator } from 'Error';

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

const customErrorBoundary = customErrorBoundaryGenerator(errorCase); // errorCase는 공통분모인 분기점이므로, 한번만 스코프 환경에 등록되게 한다 (customErrorBoundaryGenerator의 3중 커링함수형태)

export const handleTransactionErr = customErrorBoundary(customErrHandlerGenerator(errorNameEnum.transactionError));
export const handleObjectStoreErr = customErrorBoundary(customErrHandlerGenerator(errorNameEnum.objectStoreError));
