import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { genMedia } from 'styles/theme';

function Index() {
  const channelItemData = [
    {
      icon: '📞',
      text: '010-4696-0919',
      channel: '010-4696-0919',
      isLink: false,
    },
    {
      icon: '✉️',
      text: 'chltjdrhd777@gmail.com',
      channel: 'mailto:chltjdrhd777@gmail.com',
      isLink: true,
    },
    {
      icon: '🖋️',
      text: 'Blog',
      channel: 'https://velog.io/@chltjdrhd777',
      isLink: true,
    },
    {
      icon: '🐱',
      text: 'Github',
      channel: 'https://github.com/chltjdrhd777',
      isLink: true,
    },
    {
      icon: '🐱',
      text: 'Git-Project',
      channel: 'https://github.com/chltjdrhd777/TIL/projects/3',
      isLink: true,
    },
  ];

  return (
    <ChannelSection>
      <h2 className="animate">
        Channel<span className="pointColor">.</span>
      </h2>
      <ul className="channelList">
        {channelItemData.map(data => (
          <li className="animate contactItem">
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
    </ChannelSection>
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
