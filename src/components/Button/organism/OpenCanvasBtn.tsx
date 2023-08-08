import React from 'react';
import Option from '../Molecule/Option';
import { memoCanvasAtom } from 'recoil/memo';
import useRecoilImmerState from 'hooks/useImmerState';
import { GoPencil } from 'react-icons/go';
import { AiOutlineCheck } from 'react-icons/ai';
import styled from '@emotion/styled';
import EraserBtn from './EraserBtn';
import { css } from '@emotion/react';
import { genMedia } from 'styles/theme';
import ClearBtn from './ClearBtn';

function OpenCanvasBtn() {
  const [canvasConfig, setCanvasConfig] = useRecoilImmerState(memoCanvasAtom);

  const onOptionClick = () => {
    setCanvasConfig((draft) => {
      draft.isCanvasOpen = !draft.isCanvasOpen;
      return draft;
    });
  };

  return (
    <Wrapper>
      <ClearTools>
        <EraserBtn />
        <ClearBtn />
      </ClearTools>
      <Option onClick={onOptionClick} additialCSS={additionalCSS(canvasConfig.isCanvasOpen)}>
        {!canvasConfig.isCanvasOpen ? <GoPencil /> : <AiOutlineCheck />}
      </Option>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;
const ClearTools = styled.div`
  position: absolute;
  transform: translateX(-95%);
  ${genMedia(
    'web(1024px)',
    css`
      transform: translateX(-125%);
    `,
  )}

  width: 5rem;
  height: 5rem;
`;

const additionalCSS = (isCanvasOpen: boolean) => css`
  opacity: ${isCanvasOpen && 1};
`;

export default OpenCanvasBtn;
