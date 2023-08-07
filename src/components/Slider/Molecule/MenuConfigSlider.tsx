import React from 'react';
import { BaseSlider } from '../Atom/menuSlider';
import styled from '@emotion/styled';
import { MoleculeProps } from 'types';
import { IconType } from 'react-icons';
import { colors } from 'styles/theme';

interface MenuConfigRangeProps {
  SliderIcon: IconType | ((...args: any) => JSX.Element);
  labelText: string;
}
function MenuConfigSlider({
  SliderIcon,
  labelText,
  additialCSS,
  ...props
}: MenuConfigRangeProps & MoleculeProps<HTMLInputElement>) {
  return (
    <Wrapper>
      <Label>{labelText}</Label>

      <SliderArea>
        <SliderIconBox>
          <SliderIcon />
        </SliderIconBox>

        <Slider type="range" additialCSS={additialCSS} {...props} />
      </SliderArea>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const SliderIconBox = styled.div`
  width: 2rem;
  height: 2rem;
  padding: 0.4rem;
  border-radius: 100%;
  border: 1px solid ${colors.footerColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SliderArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1.3rem;
  color: ${colors.grayFour};
  margin-left: 2.5rem;
`;

const Slider = styled(BaseSlider)<MoleculeProps<HTMLInputElement>>`
  ${({ additialCSS }) => additialCSS && additialCSS}
`;

export default MenuConfigSlider;
