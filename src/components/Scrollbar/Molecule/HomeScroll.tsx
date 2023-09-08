import React, { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { colors } from 'styles/theme';
import { useRecoilValue } from 'recoil';
import { memoCanvasAtom } from 'recoil/memo';
import { checkMobile } from 'helper/checkMobile';
import BaseScrollBar from './BaseScrollBar';

function HomeScroll() {
  const isCanvasOpen = useRecoilValue(memoCanvasAtom).isCanvasOpen;
  const isMobile = checkMobile();

  const [{ innerHeight, scrollHeight }, setDemensionInfo] = useState<{ innerHeight: number; scrollHeight: number }>({
    innerHeight: 0,
    scrollHeight: 0,
  });

  const CUSTOM_SCROLL_HEIGHT = innerHeight * 0.3;
  const CUSTOM_SCROLLTHUMB_HEIGHT = (innerHeight * CUSTOM_SCROLL_HEIGHT) / scrollHeight;

  const [isBarPressed, setIsBarPressed] = useState(false);
  const [thumbOffsetY, setThumbOffsetY] = useState(0);
  const ScrollRef = useRef<HTMLDivElement | null>(null);
  const scrollRect = useRef<Partial<DOMRect>>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const setScrollRectRef = () => {
    const rect = ScrollRef.current?.getBoundingClientRect();
    rect && (scrollRect.current = rect);
  };

  const limitThumbMovementRange = (clientY: number, callback?: (...args: any) => any) => {
    const isTopExceeded = clientY - scrollRect.current.top <= 0;
    if (isTopExceeded) {
      return setThumbOffsetY(0);
    }

    const isBottomExceeded = clientY + CUSTOM_SCROLLTHUMB_HEIGHT >= scrollRect.current.bottom;
    if (isBottomExceeded) {
      return setThumbOffsetY(scrollRect.current.bottom - scrollRect.current.top - CUSTOM_SCROLLTHUMB_HEIGHT);
    }

    callback && callback();
  };

  // 초기 스크롤 Dimension 저장
  useEffect(() => {
    setDemensionInfo({
      innerHeight: window.innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
    });
  }, []);

  // 초기 스크롤 rect 정보 저장
  useEffect(() => {
    setScrollRectRef();
  }, [isCanvasOpen]);

  // thumb 움직일 때마다 실제 스크롤 반응하여 움직이기
  useEffect(() => {
    window.scrollTo({
      top: scrollHeight * (thumbOffsetY / CUSTOM_SCROLL_HEIGHT),
      behavior: 'instant',
    });
  }, [thumbOffsetY]);

  const handlers: HTMLAttributes<HTMLDivElement> = {
    onPointerDown: (e) => {
      setIsBarPressed(true);
      limitThumbMovementRange(e.clientY, () => {
        setThumbOffsetY(e.clientY - scrollRect.current.top);
      });
    },
    onPointerMove: (e) => {
      if (isBarPressed) {
        limitThumbMovementRange(e.clientY, () => {
          setThumbOffsetY(e.clientY - scrollRect.current.top);
        });
      }
    },
    onPointerUp: () => {
      setIsBarPressed(false);
    },
    onPointerLeave: () => {
      setIsBarPressed(false);
    },
  };

  return (
    <BaseScrollBar
      additialCSS={additionalCSS({
        isShown: isCanvasOpen && isMobile,
        scrollHeight: CUSTOM_SCROLL_HEIGHT,
        thumbHeight: CUSTOM_SCROLLTHUMB_HEIGHT,
        thumbOffsetY,
      })}
      ref={ScrollRef}
      {...handlers}
    />
  );
}

const additionalCSS = ({
  isShown,
  scrollHeight,
  thumbHeight,
  thumbOffsetY,
}: {
  isShown: boolean;
  scrollHeight: number;
  thumbHeight: number;
  thumbOffsetY: number;
}) => css`
  width: 1rem;
  height: ${scrollHeight}px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease-in;
  left: 0.5rem;
  z-index: var(--zIndex-1st);
  touch-action: none;
  border: 0.1rem solid ${colors.black};
  border-radius: 10px;
  overflow: hidden;

  ${isShown &&
  css`
    visibility: visible;
    opacity: 1;
  `}

  & .scroll-track {
    background-color: ${colors.white};
  }

  & .scroll-thumb {
    background-color: ${colors.pointColorBlue};
    height: ${thumbHeight}px;
    position: absolute;
    top: ${thumbOffsetY}px;
  }
`;

export default HomeScroll;
