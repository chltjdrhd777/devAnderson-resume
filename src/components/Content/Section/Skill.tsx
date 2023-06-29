import React from 'react';
import SectionFrame from '../SectionFrame';
import styled from '@emotion/styled';
import { colors, genMedia } from 'styles/theme';
import { css } from '@emotion/react';

function Index() {
  // const SkillData = [
  //   {
  //     title: '프론트엔드',
  //     description: [
  //       'Next.js로 웹 개발을 하였습니다. 코드의 복잡성을 피하기 위해서 표현되야 할 컴포넌트를 UI적 단위로 묶어 공용 컴포넌트 관리하고, 함수를 로직별로 구분해 Custom Hook을 만들어 관리하는 일에 익숙합니다.',
  //       'React-Query 및 GraphQL을 활용하여 최적화된 네트워크 요청 및 항상 View를 최신 서버 데이터와 동기화하려 노력합니다.',
  //       'Typescript를 이용하여 Javascript의 타입 추론으로 발생할 수 있는 에러들을 최소화합니다',
  //       'ES2015 이상의 Javascript 문법에 익숙하며, 가독성 및 코드 설명력에 따라 필요에 맞게 사용할 수 있습니다',
  //       '',
  //     ],
  //   },
  //   { title: '백엔드', description: [] },
  //   { title: '그 외', description: [] },
  // ];

  const skillData = [
    {
      key: 'Frontend',
      description: [],
      stackList: [
        'Javascript',
        'Typescript',
        'React',
        'React-Native',
        'Next.js',
        'Redux',
        'Redux-toolkit',
        'ContextAPI',
        'React-Query',
        'GraphQL',
        'Apollo-Client',
      ],
    },
    {
      key: 'Backend',
      description: [],
      stackList: ['Node.js', 'Express', 'Apollo-Server', 'Prisma'],
    },
    {
      key: 'Others',
      description: [],
      stackList: ['Github', 'Notion', 'Slack', 'AWS', 'Socket.io'],
    },
  ];

  return (
    <SectionFrame title="Skill" Section={SkillSection}>
      {
        <ul className="skillList mainList">
          {skillData.map(skill => (
            <li key={skill.key} className="skillItem hide-style">
              <h4 className="animate">{skill.key}</h4>
              {
                <ul className="stackList">
                  {skill.stackList.map(stack => (
                    <li className="animate stackItem fill-style">{stack}</li>
                  ))}
                </ul>
              }
            </li>
          ))}
        </ul>
      }
    </SectionFrame>
  );
}

const SkillSection = styled.section`
  & .skillList {
    display: flex;
    flex-direction: column;

    & .skillItem {
      display: flex;
      column-gap: 1rem;

      ${genMedia(
        'web(1024px)',
        css`
          column-gap: 5rem;
        `,
      )}

      & h4 {
        color: ${({ theme }) => theme.subPointColor};
        min-width: 10rem;
        margin-right: 1rem;
      }

      & .stackList {
        font-size: 1.7rem;
        font-weight: 500;
        transform: translateY(0.15rem);

        @media screen and (min-width: 500px) {
          display: flex;
          row-gap: 0.8rem;
          column-gap: 2.7rem;
          flex-wrap: wrap;
        }

        ${genMedia(
          'web(1024px)',
          css`
            font-size: 2rem;
          `,
        )}

        & .stackItem {
          &::before {
            width: 0.25rem;
            height: 0.25rem;
            top: 1rem;

            ${genMedia(
              'tablet(768px)',
              css`
                left: -1rem;
              `,
            )}

            ${genMedia(
              'web(1024px)',
              css`
                top: 1.2rem;
              `,
            )}
          }
        }
      }
    }
  }
`;

export default Index;
