import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { genMedia } from 'styles/theme';
import SectionFrame from '../SectionFrame';
import { educationData } from 'components/Content/Data';

function Index() {
  return (
    <SectionFrame title="Education" Section={EducationSection}>
      <div className="education">
        <ul className="education-list mainList">
          {educationData.map((data) => (
            <li key={data.term} className="hide-style">
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
