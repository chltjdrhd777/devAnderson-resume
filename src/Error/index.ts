// 해당 로직 작성 이유
// 로직을 작성하다 보니, indexedDB의 메서드 에러는 onError 콜백으로 잡히는 게 아니라 바로 thorw되어 에러 바운더리가 필요함을 알게 되었다.
// 이로 인해, 불필요하게 indexedDB에서 CRUD와 관련한 로직을 할 때마다 모든 메서드 호출에 대해 try~catch가 존재해야 하는 문제점이 발생했다.
// 부모에서 전체적으로 try~catch로 잡아버려서 단순히 에러로 죽는 것을 방지해도 상관없지만, 이렇게 되면 catch 구분에 모든 처리 로직들이 누적되어 복잡도가 올라가는 문제가 발생했다.
// 따라서, 특정할 수 있는 에러가 존재한다면 커스텀하여 관리할 수 있도록 수정하였다.

export class CustomError {
  constructor(public readonly message: string, public readonly name: string, public readonly err: any) {
    this.message = message;
    this.name = name;
    this.err = err;
  }
}

export type BaseErrorCase<T> = (err: Error & { name: T }) => Error; // 호출당시가 아닌, 할당 내용에 타입정의이므로 할당하는 장소에서 타입 정의해야 함 (generic T 위치가 좌측). 공적사용을 위해 index.ts에서 export함
export type Closure = <T extends (...args: any) => any>(targetFunc: T) => ReturnType<T>; // 호출 당시 타입이 인자에 의해 정해지므로, T를 extends할 때 일반화 타입으로 확장함. (generic T 위치가 우측)
export const customErrHandlerGenerator = (targetErrName: string, message: string = '') =>
  ((targetFunc) => {
    // customErrWrapperGenerator은 CustomError을 생성해 내보내는 관심사를 담당한다.
    try {
      return targetFunc();
    } catch (err) {
      throw new CustomError(message, targetErrName, err); // 받아오는 에러객체가 아닌, 커스텀 에러객체를 throw
    }
  }) as Closure;

export const customErrorBoundaryGenerator =
  (errorCase: (err: Error) => void) => (customErrHandler: ReturnType<typeof customErrHandlerGenerator>) =>
    ((targetFunc) => {
      // customErrRange는 customError의 분기를 처리하는 관심사를 담당한다.
      try {
        return customErrHandler(targetFunc);
      } catch (err) {
        errorCase(err);
      }
    }) as Closure;
