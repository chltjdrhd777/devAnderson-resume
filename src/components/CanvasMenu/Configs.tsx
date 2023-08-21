import styled from '@emotion/styled';
import React from 'react';
import MenuToolSizeSlider from '../Slider/Molecule/MenuToolSize';
import { GoPencil } from 'react-icons/go';
import useRecoilImmerState from 'hooks/useImmerState';
import { menuConfigAtom } from 'recoil/memo';
import { BsFillEraserFill } from 'react-icons/bs';
import ModeChangeBtn from 'components/Button/organism/ModeChangeBtn';
function Configs() {
  const [menuConfig, setMenuConfig] = useRecoilImmerState(menuConfigAtom);

  const onChangeSize = (e: React.ChangeEvent<HTMLInputElement>, tool: 'pen' | 'eraser') => {
    setMenuConfig((draft) => {
      const value = +e.target.value;
      if (tool === 'pen') {
        draft.penSize = value;
      }

      if (tool === 'eraser') {
        draft.eraserSize = value;
      }

      return draft;
    });
  };
  return (
    <Wrapper>
      <MenuToolSizeSlider
        SliderIcon={GoPencil}
        labelText="펜 크기"
        min={1}
        max={5}
        value={menuConfig.penSize}
        onChange={(e) => onChangeSize(e, 'pen')}
        step={0.0001}
      />

      <MenuToolSizeSlider
        SliderIcon={BsFillEraserFill}
        labelText="지우개 크기"
        min={7}
        max={30}
        value={menuConfig.eraserSize}
        onChange={(e) => onChangeSize(e, 'eraser')}
        step={0.0001}
      />

      <ModeChangeBtn />
    </Wrapper>
  );
}

const Wrapper = styled.div``;

export default Configs;
