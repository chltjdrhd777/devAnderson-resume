import { css } from '@emotion/react';
import styled from '@emotion/styled';
import useMediaQuery from 'hooks/useMediaQuery';
import React from 'react';
import { genMedia } from 'styles/theme';
import SectionFrame from '../SectionFrame';
import { workExperienceData } from 'components/Content/Data';

function Index() {
  const isWeb = useMediaQuery('web(1024px)');

  return (
    <SectionFrame title="Work Experience" Section={WorkExperienceSection}>
      <div className="company">
        <div className="animate company-title">
          <img src="/img/alockIcon.png" alt="에이락 아이콘" />
          <h3>(주)에이락</h3>
        </div>

        <div className="animate company-info">
          <div className="role">
            <em>Frontend Developer [개발 선임]</em>
            <em className="time">
              <span className="time">
                (<time dateTime="2022-05">2022-05</time> ~ <time dateTime="2023-07">2023-07</time>)
              </span>
            </em>
          </div>

          <p className="info">
            <span className="bold pointColor">블록체인 기반 전자지갑 서비스를 제공하는 스타트업</span>
            으로 Blockchain Global과 협약하여 토큰 증권 플랫폼 사업 개발을 하였습니다.
          </p>
        </div>

        <div className="experience">
          <ul className="experience-list mainList">
            {workExperienceData.map((data) => (
              <li key={data.term} className="hide-style">
                <div className="title-term">
                  <h5 className="animate">
                    {data.title}
                    <span className="pointColor">.</span>
                  </h5>
                  <div className="animate term">{isWeb ? data.term : `(${data.term})`}</div>
                </div>

                <ul className="experience-description subList">
                  <h5 className="animate">{data.title}</h5>

                  {data.workList.map((work, idx) => (
                    <li key={idx} className="animate">
                      {work}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionFrame>
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
        flex-direction: column;
        ${genMedia(
          'tablet(768px)',
          css`
            flex-direction: row;
            gap: 0.5rem;
          `,
        )}

        & em {
          color: ${({ theme }) => theme.subPointColor};

          &:first-of-type {
            font-weight: 700;
          }
        }
      }

      & .info {
        margin-top: 0.7rem;
        ${genMedia(
          'web(1024px)',
          css`
            margin-top: 1rem;
          `,
        )}
      }
    }

    & .experience {
      display: flex;
      flex-direction: column;
      margin-top: 2.5rem;
      ${genMedia(
        'web(1024px)',
        css`
          margin-top: 4rem;
        `,
      )}

      & .experience-list {
        display: flex;
        flex-direction: column;

        & a {
          color: ${({ theme }) => theme.linkColor};
        }

        & .postscript {
          word-break: keep-all;
        }

        & > li {
          ${genMedia(
            'web(1024px)',
            css`
              display: flex;
              width: 100%;
            `,
          )}
        }

        & .title-term {
          ${genMedia(
            'web(1024px)',
            css`
              min-width: 21.5rem;
              & h5 {
                display: none;
              }
            `,
          )}
        }

        & .experience-description {
          display: flex;
          flex-direction: column;
          margin-top: 0.9rem;
          list-style-type: none;
          transform: translateX(1.5rem);

          ${genMedia(
            'web(1024px)',
            css`
              margin-top: 0;
            `,
          )}

          & h5 {
            visibility: hidden;
            position: absolute;

            ${genMedia(
              'web(1024px)',
              css`
                visibility: visible;
                position: initial;
              `,
            )}
          }
        }
      }
    }
  }
`;

export default Index;
