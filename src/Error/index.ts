// 해당 로직 작성 이유
// 그냥 부모 로직에서 한번에 try~catch 로 잡아서 처리해도 되지만,
// 각 비동기 및 에러 예상되는 함수 호출 시 커스텀한 에러 객체로 구분하여 에러처리하고싶었다.
// 의식의 흐름대로 쓰자면, 예를 들어 아 그래 내가 함수 호출해서 에러 내보고 catch에서 에러 처리할 수도 있겠지. 근데 언제 그걸 다 확인하고, 무슨 에런지 확신할 수 있겠어
// 그러니 그냥 특정 로직에서 발생하는 에러를 내가 확정지어서 관리하자. 라고 생각함.

export class CustomError extends Error {
  constructor(readonly message: string, public name: string) {
    super(message);
    this.name = name;
  }
}

export type BaseErrorCase<T> = (err: Error & { name: T }) => Error; // 호출당시가 아닌, 할당 내용에 타입정의이므로 할당하는 장소에서 타입 정의해야 함.

export const customErrorRange = (errGenerator: () => Error, errorCase: (err: Error) => void) => {
  try {
    throw errGenerator();
  } catch (err) {
    errorCase(err);
  }
};
export const customErrWrapperGenerator =
  (
    targetErrName: string,
    errorNameEnum: { [key: string]: string },
    errorCase: (err: Error) => void,
    message: string = '',
  ) =>
  <T extends (...args: any) => any>(target: T): ReturnType<T> => {
    // 호출 당시 타입이 인자에 의해 정해지므로, T를 extends할 때 일반화 타입으로 확장함.
    // customErrHandler의 내곽은 CustomError을 내보내는 관심사를 담당한다.
    // customErrRange는 customError의 분기를 처리하는 관심사를 담당한다.
    try {
      return target();
    } catch (err) {
      const errorGenerator = (): Error => {
        if (errorNameEnum[targetErrName]) {
          return new CustomError(message, targetErrName);
        }

        return err;
      };

      customErrorRange(errorGenerator, errorCase);
    }
  };
