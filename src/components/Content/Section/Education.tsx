import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { genMedia } from 'styles/theme';
import SectionFrame from '../SectionFrame';

function Index() {
  const educationData = [
    {
      title: 'Wanted pre-onboarding',
      term: '2022.02 - 2022.04',
      description: [
        '매주 기업에서 요청하는 과제를 팀 프로젝트 단위로 협업하여 달성하였습니다',
        '1개의 기업과제 개인수행 프로젝트를 통해 실제 업무 수행을 경험할 기회를 가졌습니다',
        '매주 1회 대면 기술면접을 통해 개발지식을 습득하고 이를 말로 표현하는 능력을 길렀습니다',
      ],
    },
    {
      title: (
        <>
          코드스테이츠 <br className="codestates-titleBr" /> Software
          Engineering 코스
        </>
      ),
      term: '2021.07 - 2021.12',
      description: [
        'HTML, CSS, Javascript의 기본 개념을 학습하고 React를 이용한 프로젝트 제작을 경험하였습니다',
        '네트워크, 데이터베이스, 배포자동화와 같은 백엔드 워크플로우를 경험하고 Express 서버를 구현 및 운용하는 방법을 경험하였습니다',
        '4주 팀 단위 협업 프로젝트를 통해 커뮤니케이션 및 에러 대처능력을 훈련하였습니다',
        '매일마다 Greedy, DFS와 같은 대표 알고리즘의 학습 및 코딩 테스트를 위한 문제풀이를 진행하였습니다',
      ],
    },
    {
      title: '연세대학교',
      term: '2011.03 - 2015.02',
      description: [
        '재활작업치료학을 4년 전공하였고 3.93/4.5 의 학점으로 졸업하였습니다',
        '2011년 2학기 학업 우수생을 수상하였습니다',
        '2014년 2학기 학업 우등생을 수상하였습니다',
        '최종졸업 학업 우수자 상장을 수상하였습니다',
      ],
    },
  ];

  return (
    <SectionFrame title="Education" Section={EducationSection}>
      <div className="education">
        <ul className="education-list mainList">
          {educationData.map(data => (
            <li className="hide-style">
              <h5 className="animate">
                {data.title}
                <span className="pointColor">.</span>
              </h5>
              <div className="animate term">({data.term})</div>

              <ul className="education-description subList">
                {data.description.map((description, idx) => (
                  <li key={idx} className="animate">
                    {description}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </SectionFrame>
  );
}

const EducationSection = styled.section`
  & h5 {
    font-size: 1.8rem;
    ${genMedia(
      'web(1024px)',
      css`
        font-size: 2.2rem;
      `,
    )}
  }

  & .education {
    font-size: 1.5rem;
    ${genMedia(
      'web(1024px)',
      css`
        font-size: 2rem;
      `,
    )}

    & .education-list {
      display: flex;
      flex-direction: column;
    }

    & .education-description {
      display: flex;
      flex-direction: column;
      margin-top: 0.9rem;
      transform: translateX(1.5rem);
    }

    & .codestates-titleBr {
      ${genMedia(
        'tablet(768px)',
        css`
          display: none;
        `,
      )}
    }
  }
`;

export default Index;
