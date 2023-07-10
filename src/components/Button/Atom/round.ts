import styled from '@emotion/styled';
import { colors } from 'styles/theme';

export const BaseButton = styled.button`
  width: 5rem;
  height: 5rem;
  border-radius: 100%;
  border: 1px solid ${colors.grayTwo};
  overflow: hidden;
  ${({ theme }) => theme.middle};
`;

export const BaseButtonIconContainer = styled.div`
  display: inline-block;
  width: 90%;
  height: 90%;
  border-radius: 100%;
  background-color: white;
  border: 1px solid ${colors.footerColor};
  font-size: 2rem;
  color: ${colors.footerColor};
  position: absolute;

  ${({ theme }) => theme.middle};
`;
