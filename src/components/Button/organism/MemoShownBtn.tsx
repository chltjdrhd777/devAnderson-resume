import React from 'react';
import Option from '../Molecule/Option';
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { actions, useDispatch, useSelector } from 'redux/store';
import { useRecoilValue } from 'recoil';
import { memoCanvasAtom } from 'recoil/memo';
import { css } from '@emotion/react';
import { genMedia } from 'styles/theme';

function MemoShownBtn() {
  const dispatch = useDispatch();
  const isMemoShown = useSelector((state) => state.user.memo.isMemoShown);
  const isCanvasOpen = useRecoilValue(memoCanvasAtom).isCanvasOpen;

  const onOptionClick = () => {
    if (isCanvasOpen) return;
    dispatch(actions.toggleMemoShown());
  };

  return (
    <Option additialCSS={additonalCSS(isMemoShown)} onClick={onOptionClick}>
      {isMemoShown ? <AiFillEye /> : <AiOutlineEye />}
    </Option>
  );
}

const additonalCSS = (isMemoShown: boolean) =>
  isMemoShown &&
  css`
    opacity: 1;
  `;

export default MemoShownBtn;
