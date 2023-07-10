import React from 'react';
import Option from './Molecule/Option';
import { memoCanvasConfig } from 'recoil/memo';
import useRecoilImmerState from 'recoil/useImmerState';
import { GoPencil } from 'react-icons/go';
import { AiOutlineCheck } from 'react-icons/ai';
import { css } from '@emotion/css';

function OpenCanvasBtn() {
  const [canvasConfig, setCanvasConfig] = useRecoilImmerState(memoCanvasConfig);

  const onOptionClick = () => {
    setCanvasConfig((draft) => {
      draft.isCanvasOpen = !draft.isCanvasOpen;
      return draft;
    });
  };

  return <Option onClick={onOptionClick}>{!canvasConfig.isCanvasOpen ? <GoPencil /> : <AiOutlineCheck />}</Option>;
}

const additialCSS = css``;

export default OpenCanvasBtn;
