import styled from "styled-components";

export default function Bell() {
  return <BellImg src="/image/bell.png" alt="bell.png" />;
}

const BellImg = styled.img`
  height: 150px;
  @media (max-width: 768px) {
    height: 80px;
  }
`;
