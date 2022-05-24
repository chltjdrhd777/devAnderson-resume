import React from 'react';
import styled from '@emotion/styled';
import { AiFillFilePdf } from 'react-icons/ai';
import { GrInProgress } from 'react-icons/gr';
import { colors } from 'styles/theme';
import axios from 'axios';
import { useProcess } from 'hooks/useProcess';
import RoundLoading from 'components/Loading/Round';

function PdfBtn() {
  const { process, startProcessing, setLoadingIndicator } = useProcess([
    handlePDFRequest,
  ]);

  console.log(process);

  async function handlePDFRequest() {
    try {
      const res = await axios.get('api/pdf', {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/pdf',
          Accept: 'application/pdf',
        },
        onDownloadProgress: progressEvent => {
          const { loaded, total } = progressEvent;
          const progressPercentage = Math.floor((loaded / total) * 100);
          setLoadingIndicator(progressPercentage);
        },
      });

      downloadPDF(res.data, 'test');
    } catch (err) {
      console.log(err, '님아 제발 그러지마오...');
    }
  }

  function downloadPDF(buffer: Buffer, filename: string) {
    const a = document.createElement('a');
    const blobURL = URL.createObjectURL(
      new Blob([buffer], { type: 'application/pdf' }),
    );
    a.href = blobURL;
    a.download = filename + '.pdf';
    a.click();

    URL.revokeObjectURL(blobURL);
  }

  return (
    <Button
      id="pdf-btn"
      type="button"
      onClick={() => {
        startProcessing(100);
      }}
    >
      <div className="btn-container">
        {process.isLoading ? (
          <RoundLoading txt={<GrInProgress />} />
        ) : (
          <AiFillFilePdf />
        )}
      </div>
    </Button>
  );
}

const Button = styled.button`
  width: 6rem;
  height: 6rem;
  border-radius: 100%;
  background-color: ${colors.grayOne};
  border: 1px solid ${colors.grayTwo};
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  overflow: hidden;

  ${({ theme }) => theme.middle};

  & > .btn-container {
    display: inline-block;
    width: 90%;
    height: 90%;
    border-radius: 100%;
    background-color: white;
    border: 1px solid ${colors.footerColor};
    font-size: 2rem;
    color: ${colors.footerColor};

    ${({ theme }) => theme.middle};
  }
`;

export default PdfBtn;
