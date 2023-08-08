import React from 'react';
import Option from '../Molecule/Option';
import { memoCanvasAtom, menuConfigAtom } from 'recoil/memo';
import useRecoilImmerState from 'hooks/useImmerState';
import { GrClearOption } from 'react-icons/gr';
import { css } from '@emotion/react';
import { genMedia } from 'styles/theme';

function ClearBtn() {
  const [canvasConfig, setCanvasConfig] = useRecoilImmerState(memoCanvasAtom);
  const [menuConfig, setMenuConfig] = useRecoilImmerState(menuConfigAtom);

  const onOptionClick = () => {
    setMenuConfig((draft) => {
      draft.currentTool = draft.currentTool === 'pen' ? 'eraser' : 'pen';
      return draft;
    });
  };

  return (
    <Option onClick={onOptionClick} additialCSS={additonalCSS(canvasConfig.isCanvasOpen)}>
      <GrClearOption />
    </Option>
  );
}

const additonalCSS = (isCanvasOpen: boolean) => css`
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
        opacity: 1;
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
