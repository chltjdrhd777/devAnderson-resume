import React, { forwardRef } from 'react';
import { BaseScrollBar, BaseScrollThumb, BaseScrollTrack } from '../Atom/BaseStyle';
import styled from '@emotion/styled';
import { MoleculeProps } from 'types';

type ScrollBarRefType = HTMLDivElement | null;
type Props = MoleculeProps<HTMLDivElement>;

const Index = forwardRef<ScrollBarRefType, Props>(({ additialCSS, ...rest }: Props, ref) => {
  return (
    <ScrollBar ref={ref} className="scroll-bar" additialCSS={additialCSS} {...rest}>
      <BaseScrollTrack className="scroll-track">
        <BaseScrollThumb className="scroll-thumb" />
      </BaseScrollTrack>
    </ScrollBar>
  );
});

const ScrollBar = styled(BaseScrollBar)<Props>`
  ${({ additialCSS }) => additialCSS && additialCSS};
`;

export default Index;
