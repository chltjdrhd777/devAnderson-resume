import React from 'react';
import styled from '@emotion/styled';
import { colors, genMedia, gradients } from 'styles/theme';
import useFadeInAnimation from 'hooks/useFadeInAnimation';

import TitleSection from 'components/Content/Section/Title';
import ChannelSection from 'components/Content/Section/Channel';
import WorkExperienceSection from 'components/Content/Section/WorkExperience';
import { css } from '@emotion/react';

function Content() {
  useFadeInAnimation();

  return (
    <Container>
      <TitleSection />

      <Divider className="animate" />

      <ChannelSection />

      <Divider className="animate" />

      <WorkExperienceSection />
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
    animation-timing-function: cubic-bezier(0, 0.95, 0.48, 0.94);
    animation-fill-mode: both;
  }

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
`;

const Divider = styled.div`
  width: 100%;
  height: 0.1rem;
  margin: 3rem 0;
  ${gradients.pointGraidentBlue};
`;

const Skills = styled.section``;
export default Content;
