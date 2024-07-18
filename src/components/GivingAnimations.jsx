import { keyframes } from "styled-components";

export const down = keyframes`
  // 2인 플레이 중 P1이 P2에게 주는 경우
  // 4인 플레이 중 P1, P2가 P3, P4에게 주는 경우
  from {
    transform: translateY(0)
  }
  to {
    transform: translateY(100vh);
  }
`;

export const up = keyframes`
  // 2인 플레이 중 P2가 P1에게 주는 경우
  // 4인플레이 중 P3, P4가 P1, P2에게 주는 경우
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100vh);
  }
`;

export const leftUp = keyframes`
  // 4인 플레이 중 P4가 P1에게 주는 경우, P2가 P1에게 주는 경우
  // 3인 플레이 중 P2가 P1에게 주는 경우
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-50vw, -100vh);
  }
`;

export const rightUp = keyframes`
  // 4인 플레이 중 P3이 P2에게 주는 경우, P1이 P2에게 주는 경우
  // 3인 플레이 중 P1이 P2에게 주는 경우
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(50vw, -100vh);
  }
`;

export const leftDown = keyframes`
  // 4인 플레이 중 P2이 P3에게 주는 경우
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-50vw, 100vh);
  }
`;

export const rightDown = keyframes`
  // 4인 플레이 중 P1이 P4에게 주는 경우
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(50vw, 100vh);
  }
`;

export const leftDownMid = keyframes`
  // 3인 플레이 중 P1이 P3에게 주는 경우
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(20vw, 100vh);
  }
`;

export const rightDownMid = keyframes`
  // 3인 플레이 중 P2가 P3에게 주는 경우
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-20vw, 100vh);
  }
`;

export const midUpLeft = keyframes`
  // 3인 플레이 중 P3이 P1에게 주는 경우
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-20vw, -100vh);
  }
`;

export const midUpRight = keyframes`
  // 3인 플레이 중 P3이 P2에게 주는 경우
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(20vw, -100vh);
  }
`;
