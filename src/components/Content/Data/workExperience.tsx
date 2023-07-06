export const workExperienceData = [
   {
      title: '에이락 몰(모바일쿠폰마켓) 구축',
      term: '2023.03 - 2023.06',
      workList: [
         <>
            앱 내 수익화 촉진을 위해 Prisma ORM을 사용한 Express 애플리케이션에{' '}
            <span className="bold underline">Market 데이터베이스 구축 및 결제 시스템 구현</span>
         </>,
         <>
            React-native 앱 내에 <span className="bold underline">Toss Payment를 통한 PG사 결제 기능 도입</span>
         </>,
         'Coop Market과 제휴하여 API 문서분석 및 통신 데이터로 매 11시마다 상품 최신화 스케쥴링 도입',
         '마켓 내 홈뷰, 상품 뷰, 결제 뷰 구현 및 유지보수',
      ],
   },
   {
      title: '에이락 앱 성능 개선 및 고도화',
      term: '2022.12 - 2023.02',
      workList: [
         <>React-native 기반 에이락 월렛의 레거시 코드 리펙토링 및 성능 최적화 업무 담당</>,
         <>
            해당 과정을 통해 <span className="bold underline">전반적인 코드 최적화 및 지연 속도 1/4로 감축</span>{' '}
            <a
               target="_blank"
               className="bold underline"
               href="https://velog.io/@chltjdrhd777/%EB%A6%AC%ED%8E%99%ED%86%A0%EB%A7%81...-%EA%B7%B8%EA%B2%83%EC%9D%80-%ED%95%84%EC%88%98-%EB%B6%88%EA%B0%80%EA%B2%B0%ED%95%9C-%EA%B2%83"
            >
               <span className="postscript">(🧷후기)</span>
            </a>
         </>,
         <>
            <span className="bold underline">React-query 도입 및 Graphql과 병합</span>을 통한 캐싱 및 네트워크 요청
            최적화
         </>,
         'Code Push를 통한 실시간 배포 시스템 도입',
      ],
   },
   {
      title: '다국어 기능 도입',
      term: '2022.09 - 2022.11',
      workList: [
         <>
            태국 법인 진출을 목표로{' '}
            <span className="bold underline">i18Next와 google-spreadsheet, React-native, Node.js 등을 연계</span> 하여
            에이락 월렛 앱 다국어 기능 구현
         </>,
      ],
   },
   {
      title: '마이메타갤러리 페이지 제작',
      term: '2022.06 - 2022.08',
      workList: [
         <>
            삼성 SDS의 넥스레져를 이용한 NFT발행 및 Next.js를 이용한 작품 등록 사이트 “마이메타갤러리” 웹페이지 개발
            참여
         </>,
         <>
            <span className="bold underline">회원가입, 로그인 등의 본인인증 서비스 구현</span> 및 Firebase Dynamic
            Link를 이용한 에이락 월렛 연동 UI 구현
         </>,
      ],
   },
];
