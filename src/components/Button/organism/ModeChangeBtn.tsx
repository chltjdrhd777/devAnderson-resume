import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { TbHandFinger } from 'react-icons/tb';
import { SlPencil } from 'react-icons/sl';
import { colors } from 'styles/theme';
import { IconType } from 'react-icons';
import { css } from '@emotion/react';
import useRecoilImmerState from 'hooks/useImmerState';
import { menuConfigAtom } from 'recoil/memo';

function ModeChangeBtn() {
  const initialState = [
    {
      id: 1,
      icon: TbHandFinger,
      drawType: 'touch',
      text: '터치 모드',
    },
    {
      id: 2,
      icon: SlPencil,
      drawType: 'pen',
      text: '펜 모드',
    },
  ] as const;
  const [memoConfig, setMemoConfig] = useRecoilImmerState(menuConfigAtom);

  useEffect(() => {
    console.log(memoConfig);
  });

  return (
    <Wrapper>
      {initialState.map((state) => (
        <Template
          Icon={state.icon}
          text={state.text}
          active={memoConfig.drawType === state.drawType}
          onClick={() => {
            setMemoConfig((draft) => {
              draft.drawType = state.drawType;
              return draft;
            });
          }}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  border-radius: 1.5rem;
  overflow: hidden;
  margin-top: 1rem;
  border: 1px solid ${colors.black};
  display: flex;
  align-items: center;
  position: relative;

  &::before {
    content: '';
    width: 0.1rem;
    height: 100%;
    background-color: ${colors.black};
    position: absolute;
    top: 0;
    left: 50%;
  }
`;

const ModeContainer = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0.5;
  justify-content: center;

  cursor: pointer;
  position: relative;

  & span {
    font-size: 1rem;
    font-weight: bold;
  }

  transition: all 0.1s ease-in;

  ${({ active }) =>
    active &&
    css`
      background-color: ${colors.mainColor};
      color: white;
    `}
`;

interface TemplateProps {
  Icon: IconType;
  text: string;
  onClick: (...args: any) => any;
  active: boolean;
}
const Template = ({ Icon, text, onClick, active }: TemplateProps) => (
  <ModeContainer onClick={onClick} active={active}>
    <Icon />
    <span>{text}</span>
  </ModeContainer>
);

export default ModeChangeBtn;
