import React from 'react';
import styled from '@emotion/styled';
import { genMedia, gradients } from 'styles/theme';
import useFadeInAnimation from 'hooks/useFadeInAnimation';

import TitleSection from 'components/Content/Section/Title';
import ChannelSection from 'components/Content/Section/Channel';
import WorkExperienceSection from 'components/Content/Section/WorkExperience';
import EducationSection from 'components/Content/Section/Education';
import SkillSection from 'components/Content/Section/Skill';
import { css } from '@emotion/react';

function Content() {
  useFadeInAnimation();

  return (
    <Container>
      <TitleSection />
      <Divider className="devider animate" />
      <ChannelSection />
      <Divider className="devider animate" />
      <WorkExperienceSection />
      <Divider className="devider animate" />
      <SkillSection />
      <Divider className="devider animate" />
      <EducationSection />
      //개인프로젝트 부분 //article 부분 (블로그 강조할 부분 나타내기)
    </Container>
  );
}

const Container = styled.div`
  width: 80%;
  height: 100%;
  max-width: 70rem;
  ${genMedia(
    'web(1024px)',
    css`
      max-width: 90rem;
    `,
  )}

  & h2 {
    font-size: 2.5rem;
    font-weight: bold;
    word-break: keep-all;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.fontColor};

    ${genMedia(
      'web(1024px)',
      css`
        font-size: 3.8rem;
        margin-bottom: 3rem;
      `,
    )}
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

  & h4 {
    font-size: 1.8rem;
    ${genMedia(
      'web(1024px)',
      css`
        font-size: 2.5rem;
      `,
    )}
  }

  & h5 {
    font-size: 1.6rem;

    ${genMedia(
      'web(1024px)',
      css`
        font-size: 2rem;
      `,
    )}
  }

  & ul.mainList {
    gap: 3.5rem;
    ${genMedia(
      'web(1024px)',
      css`
        gap: 4rem;
      `,
    )}
  }

  & ul.subList {
    gap: 0.8rem;
    ${genMedia(
      'web(1024px)',
      css`
        gap: 1.2rem;
      `,
    )}
  }

  & li {
    position: relative;
    &::before {
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      border: 1px solid ${({ theme }) => theme.pointColor};
      position: absolute;
      left: -1.27rem;
      top: 0.77rem;

      ${genMedia(
        'web(1024px)',
        css`
          left: -1.65rem;
          top: 1.1rem;
        `,
      )}
    }

    &.fill-style {
      &::before {
        background-color: ${({ theme }) => theme.pointColor};
      }
    }

    &.hide-style {
      &::before {
        display: none;
      }
    }
  }

  & .pointColor {
    transition: color 0.1s ease-in;
    color: ${({ theme }) => theme.pointColor};
  }

  & .bold {
    font-weight: 500;
  }

  & .underline {
    text-decoration: underline;
  }

  & .animate {
    opacity: 0;
    transform: translateY(3rem);
  }

  & .fadeIn {
    animation-name: ${({ theme }) => theme.animations.fadeIn};
    animation-duration: 2.5s;
    animation-delay: 0.22s;
    animation-timing-function: cubic-bezier(0, 0.95, 0.48, 0.94);
    animation-fill-mode: both;
  }

  & .term {
    color: ${({ theme }) => theme.subPointColor};
    font-weight: 500;
    font-size: 1.5rem;
    ${genMedia(
      'web(1024px)',
      css`
        font-size: 2rem;
      `,
    )}
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 0.1rem;
  margin: 3rem 0;
  ${gradients.pointGraidentBlue};
`;

const Skills = styled.section``;
export default Content;
