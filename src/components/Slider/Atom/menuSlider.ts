import styled from '@emotion/styled';

export const BaseSlider = styled.input`
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 1rem;
  background: #d3d3d3;
  outline: none;

  &::-webkit-slider-thumb,
  &::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #04aa6d;
    cursor: pointer;
  }
`;
