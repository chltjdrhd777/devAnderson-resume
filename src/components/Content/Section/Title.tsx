import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { genMedia, gradients } from 'styles/theme';

function Index() {
  return (
    <TitleSection>
      <div className="profile-title">
        <div className="profile animate">
          <div className="profileImage" />
        </div>

        <h1 className="title animate">
          개발새싹에 물주는 앤더손씨
          <span className="pointColor">.</span>
        </h1>
      </div>

      <p className="description">
        <span className="animate">
          안녕하세요. 어제의 나에게 뒤쳐지고 싶지 않아 매일같이 한걸음을 내딛는 개발자{' '}
          <span className="bold pointColor">최우철</span>입니다.
        </span>

        <span className="animate">
          블록체인 스타트업에서 1년 2개월차 프론트엔드 개발자로&nbsp;
          <span className="bold pointColor">Next.js, React-native, Node.js 등을 사용</span>
          하여 웹 및 앱 서비스를 기획하고 개발하는 업무를 하였으며 기존 코드를 리펙토링하고 성능을 개선 및 버그 수정
          업무를 병행하였습니다.
        </span>

        <span className="animate">
          <span className="bold pointColor">휴먼 에러를 걷어내는 개선</span>을 좋아합니다. 환경 변수 관리가 비효율적으로
          이루어지는 불확실성을 해결하기 위해 직접 사내 개발자용 모듈을 제작 및 배포하여 운영중인 서비스의 개발 환경에
          적용한 경험이 있습니다.
        </span>

        <span className="animate">
          모든 협업과 에러 핸들링은 개발자라는 나무를 키우는 양분이 된다는 마인드를 모토로 삼고 있습니다. 그 과정에서
          깨닫거나 습득하는 경험의 흔적을 남기는 것을 중요하게 생각하여{' '}
          <span className="bold pointColor">Git Project와 Velog를 활용해 기록하는 습관</span>을 유지하려 노력합니다.
        </span>
      </p>
    </TitleSection>
  );
}

const TitleSection = styled.section`
  & .profile-title {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    margin-bottom: 1.5rem;
    gap: 2.5rem;

    ${genMedia(
      'web(1024px)',
      css`
        flex-direction: initial;
        align-items: center;
        margin-top: 2.5rem;
        margin-bottom: 2rem;
      `,
    )}
  }

  & .profile {
    min-width: 30rem;
    height: 30rem;
    border-radius: 50%;
    align-self: center;
    ${({ theme }) => theme.middle};
    ${gradients.pointGraidentBlue};

    & .profileImage {
      width: 98.5%;
      height: 98.5%;
      border-radius: 50%;

      background-image: url('/img/profile.jpg');
      background-position: center;
      background-size: 110%;
    }
  }

  & .title {
    font-size: 3rem;
    font-weight: bold;
    word-break: keep-all;

    ${genMedia(
      'web(1024px)',
      css`
        font-size: 5rem;
      `,
    )}
  }

  & .description {
    font-size: 1.5rem;

    ${({ theme }) => theme.centerCol};
    align-items: initial;
    gap: 1rem;
    word-break: keep-all;

    ${genMedia(
      'web(1024px)',
      css`
        font-size: 2rem;
      `,
    )}
  }
`;

export default Index;
