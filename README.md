# Resume for Dev Anderson (READ.md 업데이트 중)

## 이 레파지토리는

기존에 notion을 이용한 이력서를 작성해서 pdf를 만들어 보았습니다. 하지만, pdf 내용의 디자인적 자유로움과 커스터마이징을 하고 싶었기 때문에 react component를 pdf 파일로 변환하는 시스템을 만들어 보았습니다.

소개하고 싶은 feature은

1. puppeteer : react component의 스크린 내용을 copy한 뒤, 그것을 pdf로 만드는 로직을 구현하였습니다. next.js 내부의 api endpoint를 활용하여 내부적으로 pdf 생성을 처리에 전달하는 점이 포인트입니다.

2. useProcess : react-hook을 이용하여 프로세싱에 필요한 loading, success, done과 관련한 로직을 훅으로 분리하여 관리하였습니다.

3. immer : 상태 업데이트를 위해 불변성을 지켜야 하지만, 불필요하게 늘어나는 (...) 의 얕은 복사를 원치 않았으므로 redux-toolkit에서 이미 적극적으로 활용되고 있는 immer을 이용해 불변성 복사 처리를 대신 위임하였습니다.

4. react-portal : 특정 노드를 타게팅하여 컴포넌트의 내용물을 랜더링하는 portal 기능을 통해 부모의 스타일링 (ex overflow:hidden) 옵션과 상관없는 컴포넌트 배치를 손쉽게 만들 수 있었습니다. 또한 이벤트 버블링은 그대로 현재 정의된 위치를 기준으로 전파된다는 점 역시 흥미로운 부분입니다.

## 목표

최종적으로 만들어진 레쥬메는 netlify에 배포하여 취업을 위한 이력서로 적극 활용할 예정입니다.
