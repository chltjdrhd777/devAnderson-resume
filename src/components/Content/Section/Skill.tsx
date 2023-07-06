import React from 'react';
import styled from '@emotion/styled';
import { genMedia } from 'styles/theme';
import { css } from '@emotion/react';
import SectionFrame from '../SectionFrame';
import { skillData } from 'components/Content/Data';

function Index() {
  return (
    <SectionFrame title="Skill" Section={SkillSection}>
      {
        <ul className="skillList mainList">
          {skillData.map((skill) => (
            <li key={skill.key} className="skillItem hide-style">
              <h4 className="animate">{skill.key}</h4>
              {
                <ul className="stackList">
                  {skill.stackList.map((stack) => (
                    <li key={stack} className="animate stackItem fill-style">
                      {stack}
                    </li>
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
