import styled from "styled-components";

export default function CardBack() {
  return (
    <Wrapper>
      <img
        src="/image/cards/cardBack.png"
        alt="cardBack.png"
        style={{ transform: "rotate(0.85deg)" }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  & > img {
    height: 17rem;
    @media (max-width: 1000px) {
      height: 14rem;
    }
    @media (max-width: 768px) {
      height: 10rem;
    }
  }
`;
