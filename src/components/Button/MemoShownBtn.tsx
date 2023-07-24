import React from 'react';
import Option from './Molecule/Option';
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { actions, useDispatch, useSelector } from 'redux/store';

function MemoShownBtn() {
  const dispatch = useDispatch();
  const isMemoShown = useSelector((state) => state.user.memo.isMemoShown);

  const onOptionClick = () => {
    dispatch(actions.toggleMemoShown());
  };

  return <Option onClick={onOptionClick}>{isMemoShown ? <AiFillEye /> : <AiOutlineEye />}</Option>;
}

export default MemoShownBtn;
