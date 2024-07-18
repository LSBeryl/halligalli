import { keyframes } from "styled-components";

export const leftTop = keyframes`
  // 왼쪽 위 카드가 벨로
  from {
    transform: translate(0, 0)
  }
  to {
    transform: translate(20vw, 40vh);
  }
`;

export const midTop = keyframes`
  from {
    transform: translate(0, 0)
  }
  to {
    transform: translate(0, 40vh);
  }
`;

export const rightTop = keyframes`
  from {
    transform: translate(0, 0)
  }
  to {
    transform: translate(-20vw, 40vh)
  }
`;

export const leftBottom = keyframes`
  // 왼쪽 위 카드가 벨로
  from {
    transform: translate(0, 0)
  }
  to {
    transform: translate(20vw, -40vh);
  }
`;

export const midBottom = keyframes`
  from {
    transform: translate(0, 0)
  }
  to {
    transform: translate(0, -40vh);
  }
`;

export const rightBottom = keyframes`
  from {
    transform: translate(0, 0)
  }
  to {
    transform: translate(-20vw, -40vh)
  }
`;
