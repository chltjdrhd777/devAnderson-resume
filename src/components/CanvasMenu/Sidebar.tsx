import styled from '@emotion/styled';
import { SmallIconContainer } from 'components/Button/Atom/round';
import useRecoilImmerState from 'hooks/useImmerState';
import React from 'react';
import { pickerCircleAtom } from 'recoil/memo';
import { colors } from 'styles/theme';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { css } from '@emotion/react';
import useAddUndoRedo from 'hooks/useAddUndoRedo';

function Sidebar() {
  const [pickerCircle] = useRecoilImmerState(pickerCircleAtom);
  const { goBackwardPath, goForwardPath } = useAddUndoRedo();

  return (
    <Wrapper>
      <SelectedColor background={pickerCircle.selectedColor} />
      <SmallIcon onClick={goBackwardPath}>
        <RiArrowGoBackFill />
      </SmallIcon>
      <SmallIcon reverse={true} onClick={goForwardPath}>
        <RiArrowGoBackFill />
      </SmallIcon>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-0.5rem);

  & > *:not(:first-of-type, :nth-of-type(2)) {
    margin-top: 2.3rem;
  }
`;

const SelectedColor = styled.div<{ background: string }>`
  width: 2.7rem;
  height: 2.7rem;
  border: 1px solid ${colors.black};
  border-radius: 100%;
  background-color: ${({ background }) => background};
  margin-bottom: 1rem;
`;

const SmallIcon = styled(SmallIconContainer)<{ reverse?: boolean; active?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  font-weight: bold;
  font-size: 2rem;
  transform: opacity 0.5s ease-in;
  cursor: pointer;
  position: relative;

  &:before {
    content: ${({ reverse }) => (reverse ? '"이후 메모"' : '"이전 메모"')};
    width: 4rem;
    height: 1.5rem;
    position: absolute;
    bottom: -75%;
    left: -25%;
    z-index: 100;
    font-size: 1rem;
    opacity: 1;
    font-weight: 500;
  }

  ${({ reverse, active }) => {
    if (reverse) {
      return css`
        & > * {
          transform: scaleX(-1);
        }
      `;
    }

    if (active) {
      return css`
        opacity: 1;
      `;
    }

    return ``;
  }}
`;

export default Sidebar;
