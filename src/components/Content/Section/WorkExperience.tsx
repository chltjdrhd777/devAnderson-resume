import { css } from '@emotion/react';
import styled from '@emotion/styled';
import useMediaQuery from 'hooks/useMediaQuery';
import React from 'react';
import { genMedia } from 'styles/theme';

function Index() {
  const isWeb = useMediaQuery('web(1024px)');
  const experienceData = [
    {
      title: '에이락 몰(모바일쿠폰마켓) 구축',
      term: '2023.03 - 2023.06',
      workList: [
        <>
          앱 내 수익화 촉진을 위해 Prisma ORM을 사용한 Express 애플리케이션에{' '}
          <span className="bold underline">
            Market 데이터베이스 구축 및 결제 시스템 구현
          </span>
        </>,
        <>
          React-native 앱 내에{' '}
          <span className="bold underline">
            Toss Payment를 통한 PG사 결제 기능 도입
          </span>
        </>,
        'Coop Market과 제휴하여 API 문서분석 및 통신 데이터로 매 11시마다 상품 최신화 스케쥴링 도입',
        '마켓 내 홈뷰, 상품 뷰, 결제 뷰 구현 및 유지보수',
      ],
    },
    {
      title: '에이락 앱 성능 개선 및 고도화',
      term: '2022.12 - 2023.02',
      workList: [
        <>
          React-native 기반 에이락 월렛의 레거시 코드 리펙토링 및 성능 최적화
          업무 담당
        </>,
        <>
          해당 과정을 통해{' '}
          <span className="bold underline">
            전반적인 코드 최적화 및 지연 속도 1/4로 감축
          </span>{' '}
          <a
            target="_blank"
            className="bold underline"
            href="https://velog.io/@chltjdrhd777/%EB%A6%AC%ED%8E%99%ED%86%A0%EB%A7%81...-%EA%B7%B8%EA%B2%83%EC%9D%80-%ED%95%84%EC%88%98-%EB%B6%88%EA%B0%80%EA%B2%B0%ED%95%9C-%EA%B2%83"
          >
            (🧷후기 Link)
          </a>
        </>,
        <>
          <span className="bold underline">
            React-query 도입 및 Graphql과 병합
          </span>
          을 통한 캐싱 및 네트워크 요청 최적화
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
          <span className="bold underline">
            i18Next와 google-spreadsheet, React-native, Node.js 등을 연계
          </span>{' '}
          하여 에이락 월렛 앱 다국어 기능 구현
        </>,
      ],
    },
    {
      title: '마이메타갤러리 페이지 제작',
      term: '2022.06 - 2022.08',
      workList: [
        <>
          삼성 SDS의 넥스레져를 이용한 NFT발행 및 Next.js를 이용한 작품 등록
          사이트 “마이메타갤러리” 웹페이지 개발 참여
        </>,
        <>
          회원가입, 로그인 등의 본인인증 서비스 및{' '}
          <span className="bold underline">
            Firebase Dynamic Link를 이용한 에이락 월렛 연동 기능 구현
          </span>
        </>,
      ],
    },
  ];

  return (
    <WorkExperienceSection>
      <h2>
        Work Experience<span className="pointColor">.</span>
      </h2>

      <div className="company">
        <div className="animate company-title">
          <img src="/img/alockIcon.png" alt="에이락 아이콘" />
          <h3>(주)에이락</h3>
        </div>

        <div className="animate company-info">
          <div className="role">
            <em>프론트엔드 개발자</em>
            <em>(2022-05 ~ 2023-07)</em>
          </div>

          <p className="info">
            <span className="bold pointColor">
              블록체인 기반 전자지갑 서비스를 제공하는 스타트업
            </span>
            으로 Blockchain Global과 협약하여 토큰 증권 플랫폼 사업 개발을
            하였습니다.
          </p>
        </div>

        <div className="experienceList">
          <ul className="experienceItem">
            {experienceData.map(data => (
              <li>
                <div className="title-term">
                  <h5 className="animate">
                    {data.title}
                    <span className="pointColor">.</span>
                  </h5>
                  <div className="animate term">
                    {isWeb ? data.term : `(${data.term})`}
                  </div>
                </div>

                <ul className="experience">
                  {data.workList.map(work => (
                    <li className="animate">{work}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </WorkExperienceSection>
  );
}

const WorkExperienceSection = styled.section`
  & .company {
    font-size: 1.5rem;
    ${genMedia(
      'web(1024px)',
      css`
        font-size: 2rem;
      `,
    )}

    & .company-title {
      display: flex;
      align-items: center;

      & img {
        width: 2rem;
        height: 2rem;
        margin-right: 0.4rem;
      }

      & h3 {
        font-size: 2rem;
        ${genMedia(
          'web(1024px)',
          css`
            font-size: 3rem;
          `,
        )}
      }
    }

    & .company-info {
      margin-top: 0.8rem;
      ${genMedia(
        'web(1024px)',
        css`
          margin-top: 1.5rem;
        `,
      )}

      & .role {
        display: flex;
        gap: 0.5rem;

        & em {
          color: ${({ theme }) => theme.subPointColor};

          &:first-child {
            font-weight: 700;
          }
        }
      }

      & .info {
        margin-top: 0.5rem;
        ${genMedia(
          'web(1024px)',
          css`
            margin-top: 0.8rem;
          `,
        )}
      }
    }

    & .experienceList {
      display: flex;
      flex-direction: column;
      margin-top: 2.5rem;
      ${genMedia(
        'web(1024px)',
        css`
          margin-top: 4rem;
        `,
      )}

      & .experienceItem {
        display: flex;
        flex-direction: column;
        gap: 3.5rem;
        ${genMedia(
          'web(1024px)',
          css`
            gap: 4rem;
          `,
        )}

        & a {
          color: ${({ theme }) => theme.linkColor};
        }

        & > li {
          ${genMedia(
            'web(1024px)',
            css`
              display: flex;
              width: 100%;

              & .title-term {
                min-width: 21.5rem;
                & h5 {
                  display: none;
                }
              }

              & .experience {
                margin-top: 0;
                gap: 1.2rem;
              }
            `,
          )}
        }

        h5 {
          font-size: 1.6rem;

          ${genMedia(
            'web(1024px)',
            css`
              font-size: 2rem;
            `,
          )}
        }

        & .term {
          color: ${({ theme }) => theme.subPointColor};
          font-weight: 500;
        }

        & .experience {
          display: flex;
          flex-direction: column;
          margin-top: 0.9rem;
          gap: 0.8rem;
          list-style-type: none;
          transform: translateX(1.5rem);

          & li {
            position: relative;
          }

          & li::before {
            content: '';
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            border: 1px solid ${({ theme }) => theme.pointColor};
            position: absolute;
            left: -1.15rem;
            top: 0.77rem;

            ${genMedia(
              'web(1024px)',
              css`
                top: 1rem;
              `,
            )}
          }
        }
      }
    }
  }
`;

export default Index;
