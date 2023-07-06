import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { GrInProgress as TimerIcon, GrDocumentDownload as DownloadIcon } from 'react-icons/gr';
import { colors, genMedia } from 'styles/theme';
import { useProcess } from 'hooks/useProcess';
import RoundLoading from 'components/Loading/Round';
import useScrollAnimation from 'hooks/useScrollAnimation';
import { css } from '@emotion/react';

function PdfBtn() {
  const RADIUS = 54; // 반지름
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // 원 둘레 공식
  const DELAY = 2300; // 로딩 프로세스 시간

  async function downloadPDF() {
    const downloadLink = document.createElement('a');
    const fileName = '프론트엔드_최우철';
    downloadLink.href = `/pdf/${fileName}.pdf`;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  function genDashOffset(percentage: number) {
    const progress = percentage / DELAY; //진척률
    return CIRCUMFERENCE * (1 - progress); //Bar 이동범위
  }

  const { process, startProcessing } = useProcess(downloadPDF);
  const { scroll } = useScrollAnimation();

  function onHandleClick() {
    startProcessing(DELAY);
  }

  return (
    <Button id="pdf-btn" onClick={onHandleClick} isScrolled={scroll} isLoading={process.isLoading}>
      <ButtonIconContainer>
        {process.isLoading ? <RoundLoading txt={<TimerIcon />} /> : <DownloadIcon />}
      </ButtonIconContainer>

      <CircleSVG
        viewBox="0 0 120 120"
        CIRCUMFERENCE={CIRCUMFERENCE}
        dashoffset={genDashOffset(process.loadingIndicator)}
      >
        <circle className="frame" cx="60" cy="60" r={RADIUS} />
        <circle className="bar" cx="60" cy="60" r={RADIUS} />
      </CircleSVG>
    </Button>
  );
}

interface ButtonProps {
  isScrolled: boolean;
  isLoading: boolean;
}
const Button = styled.button<ButtonProps>`
  width: 5rem;
  height: 5rem;
  border-radius: 100%;
  border: 1px solid ${colors.grayTwo};
  overflow: hidden;

  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  ${({ isScrolled, isLoading }) =>
    isScrolled || isLoading
      ? css`
          transform: scale(1);
          opacity: 1;
        `
      : css`
          transform: scale(0.85);
          opacity: 0.5;
        `}

  ${({ isScrolled, isLoading }) =>
    genMedia(
      'web(1024px)',
      isScrolled || isLoading
        ? css`
            transform: scale(1.3);
          `
        : css`
            transform: scale(1.1);
          `,
    )}


  ${({ theme }) => theme.middle};
`;

const ButtonIconContainer = styled.div`
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

interface CircleSVGProps {
  CIRCUMFERENCE: number;
  dashoffset: number;
}
const CircleSVG = styled.svg<CircleSVGProps>`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;

  & .frame,
  & .bar {
    fill: none;
    stroke-width: 7;
  }

  & .frame {
    stroke: #e6e6e6;
  }

  & .bar {
    stroke: #57eb99;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.5s ease;
    stroke-dasharray: ${({ CIRCUMFERENCE }) => CIRCUMFERENCE};
    stroke-dashoffset: ${({ dashoffset }) => dashoffset};
  }
`;

export default PdfBtn;
