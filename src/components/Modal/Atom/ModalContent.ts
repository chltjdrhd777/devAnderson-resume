import styled from '@emotion/styled';
import { colors } from 'styles/theme';

export const BaseModalContent = styled.div`
  width: 80%;
  height: 90%;

  max-width: 40rem;
  max-height: 45rem;

  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 0 10px;
  position: absolute;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: calc(var(--zIndex-0st) + 100);
`;
