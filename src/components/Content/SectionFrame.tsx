import { Theme } from '@emotion/react';
import { StyledComponent } from '@emotion/styled';
import React, { PropsWithChildren } from 'react';

interface Props {
  title: string;
  Section: StyledComponent<
    {
      theme?: Theme;
      as?: React.ElementType<any>;
    },
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
    {}
  >;
}
function SectionFrame({ title, Section, children }: PropsWithChildren<Props>) {
  return (
    <Section>
      <h2 className="animate">
        {title}
        <span className="pointColor">.</span>
      </h2>

      {children}
    </Section>
  );
}

export default SectionFrame;
