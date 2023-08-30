import React, { useEffect, useRef } from 'react';
import BaseModal from '../Molecule/BaseModal';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import useRecoilImmerState from 'hooks/useImmerState';
import { isClearMemoNoticeModalOpenAtom } from 'recoil/memo';
import { colors } from 'styles/theme';
import { FaExclamation } from 'react-icons/fa';
import { BaseButton } from 'components/Button/Atom/round';

interface ClearMemoNoticeModalProps {
  onDelete: () => void;
  onIgnorePopup: () => void;
}
function ClearMemoNoticeModal({ onDelete, onIgnorePopup }: ClearMemoNoticeModalProps) {
  const [isClearNoticeModalOpen, setIsClearNoticeModalOpen] = useRecoilImmerState(isClearMemoNoticeModalOpenAtom);
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  const onClose = () => {
    setIsClearNoticeModalOpen(false);
  };

  useEffect(() => {
    const checkboxCurrent = checkboxRef.current;
    return () => {
      if (checkboxCurrent?.checked) {
        onIgnorePopup();
      }
    };
  }, []);
  return (
    <BaseModal additialCSS={additionalCSS} onClose={onClose}>
      <ModalContentWrapper>
        <WarningIcon>
          <FaExclamation />
        </WarningIcon>

        <Title>메모를 삭제하시겠습니까?</Title>
        <Description>메모를 삭제하시면 더 이상 복구하실 수 없습니다.</Description>

        <Buttons>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <ConfirmButton
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            확인
          </ConfirmButton>
        </Buttons>

        <IgnoreCheckbox>
          <span>7일동안 팝업 뜨지 않기</span>
          <input ref={checkboxRef} type="checkbox" />
        </IgnoreCheckbox>
      </ModalContentWrapper>
    </BaseModal>
  );
}

const additionalCSS = css``;
const ModalContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;

  align-items: center;
`;
const WarningIcon = styled.div`
  width: 5rem;
  height: 5rem;
  background-color: ${colors.beigeRed};
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1.7rem;
  color: ${colors.pointColorCarrot};
  margin-top: 3.5rem;
`;

const Title = styled.h2`
  font-weight: bold;
  white-space: nowrap;
  color: ${colors.black};
  margin-top: 3.5rem;
`;

const Description = styled.p`
  margin-top: 2.2rem;
  font-size: 2rem;
  text-align: center;
  word-break: keep-all;
`;

const Buttons = styled.div`
  margin-top: 2.5rem;
  display: flex;
  gap: 1.1rem;
`;
const CancelButton = styled(BaseButton)`
  border-radius: 0.5rem;
  width: 7rem;
  font-size: 1.7rem;
  font-weight: 600;
`;
const ConfirmButton = styled(CancelButton)`
  background-color: ${colors.pointColorBlue};
  color: ${colors.white};
`;

const IgnoreCheckbox = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  & input {
    transform: translateY(0.05rem);
  }
`;

export default ClearMemoNoticeModal;
