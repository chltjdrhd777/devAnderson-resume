import styled from '@emotion/styled';
import React from 'react';

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
      <h2 className="animate">Channel</h2>
      <ul className="contactList">
        {channelItemData.map(data => (
          <li className="animate contactItem">
            <span className="icon">{data.icon}</span>
            <span className="link">
              {data.isLink ? (
                <a className="underline" href={data.channel}>
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
  & .contactList {
    display: flex;
    flex-direction: column;
    font-weight: 500;
    color: ${({ theme }) => theme.fontColor};

    & li {
      & .icon {
        margin-right: 1rem;
      }

      & a {
        color: ${({ theme }) => theme.linkColor};
      }
    }
  }
`;

export default Index;
