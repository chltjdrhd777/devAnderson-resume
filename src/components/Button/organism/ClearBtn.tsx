import React, { useState } from 'react';
import Option from '../Molecule/Option';
import { isClearMemoNoticeModalOpenAtom, isClearMemoTriggeredAtom, memoCanvasAtom, memoLengthAtom } from 'recoil/memo';
import useRecoilImmerState from 'hooks/useImmerState';
import { GrClearOption } from 'react-icons/gr';
import { css } from '@emotion/react';
import { genMedia } from 'styles/theme';
import { useRecoilValue } from 'recoil';
import useIndexedDB from 'hooks/useIndexedDB';
import Portal from 'components/Portal';
import ClearMemoNoticeModal from 'components/Modal/organism/ClearMemoNoticeModal';
import { indexing, tableEnum } from 'indexedDB/versionManager';

function ClearBtn() {
  const ONEWEEK = 7 * 24 * 60 * 60 * 1000;
  const IGNORETIME_KEY = 'noticeIgnoreTime';
  const memoCanvas = useRecoilValue(memoCanvasAtom);
  const [isClearNoticeModalOpen, setIsClearNoticeModalOpen] = useRecoilImmerState(isClearMemoNoticeModalOpenAtom);
  const [isClearMemoTriggered, setIsClearMemoTriggered] = useRecoilImmerState(isClearMemoTriggeredAtom);
  const memoLength = useRecoilValue(memoLengthAtom);

  const { getValue, saveValue, deleteValue } = useIndexedDB({});

  const onDelete = () =>
    deleteValue({
      tableName: tableEnum.memo,
      key: indexing.memo,
      onSuccess: () => {
        setIsClearMemoTriggered(true);
      },
    });

  const onIgnorePopup = () => {
    saveValue({ tableName: tableEnum.userConfig, key: IGNORETIME_KEY, value: Date.now(), type: 'put' });
  };

  const onOptionClick = async () => {
    if (!memoLength) return;

    const noticeIgnoreTime = await getValue<number | undefined>({
      tableName: tableEnum.userConfig,
      key: IGNORETIME_KEY,
    });

    if (!noticeIgnoreTime || Date.now() - noticeIgnoreTime >= ONEWEEK) {
      setIsClearNoticeModalOpen(true);
    } else {
      onDelete();
    }
  };

  return (
    <>
      <Option onClick={onOptionClick} additialCSS={additonalCSS(memoCanvas.isCanvasOpen, memoLength)}>
        <GrClearOption />
      </Option>

      {isClearNoticeModalOpen && (
        <Portal>
          <ClearMemoNoticeModal onDelete={onDelete} onIgnorePopup={onIgnorePopup} />
        </Portal>
      )}
    </>
  );
}

const additonalCSS = (isCanvasOpen: boolean, memoLength: number) => css`
  position: absolute;
  transition: all 0.2s ease-out;

  top: 0;
  right: 0;
  opacity: 0.5;
  visibility: hidden;
  transform: scale(0);

  ${isCanvasOpen
    ? css`
        top: 50%;
        right: 0;
        visibility: visible;
        opacity: ${memoLength > 0 ? 1 : 0.5};
        transform: scale(0.85);
      `
    : css`
        top: 0;
        right: -100%;
        visibility: hidden;
        opacity: 0.5;
        transform: scale(0);
      `}

  ${genMedia(
    'web(1024px)',
    css`
      transform: scale(0);
      ${isCanvasOpen &&
      css`
        transform: scale(1.1);
        top: 70%;
      `}
    `,
  )}
`;

export default ClearBtn;
