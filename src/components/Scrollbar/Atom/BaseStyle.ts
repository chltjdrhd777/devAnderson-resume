import styled from '@emotion/styled';

export const BaseScrollBar = styled.div`
  width: 300px;
  height: 300px;
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
`;

export const BaseScrollTrack = styled.div`
  width: 100%;
  height: 100%;
  background-color: gray;
  position: relative;
  display: flex;
  justify-content: center;
`;

export const BaseScrollThumb = styled.div`
  width: 0.8rem;
  height: 1rem;
  border-radius: 10px;
`;
