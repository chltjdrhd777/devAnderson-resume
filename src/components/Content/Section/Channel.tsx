import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { genMedia } from 'styles/theme';
import SectionFrame from '../SectionFrame';
import { channelItemData } from 'components/Content/Data';

function Index() {
  return (
    <SectionFrame title="Channel" Section={ChannelSection}>
      <ul className="channelList">
        {channelItemData.map((data) => (
          <li key={data.channel} className="animate contactItem hide-style">
            <span className="icon">{data.icon}</span>
            <span className="link">
              {data.isLink ? (
                <a target="_blank" className="underline" href={data.channel}>
                  {data.text}
                </a>
              ) : (
                <span>{data.text}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}

const ChannelSection = styled.section`
  & .channelList {
    display: flex;
    flex-direction: column;
    font-weight: 500;
    color: ${({ theme }) => theme.fontColor};

    & li {
      user-select: text;
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      -o-user-select: text;

      & .icon {
        margin-right: 1rem;
      }

      & a {
        color: ${({ theme }) => theme.linkColor};
      }
    }

    ${genMedia(
      'web(1024px)',
      css`
        font-size: 1.85rem;
      `,
    )}
  }
`;

export default Index;
