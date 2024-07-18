import styled from "styled-components";

export default function Card({ type, num }) {
  return (
    <Wrapper>
      <img src={`/image/cards/${type}/${num}.png`} alt="card" />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  & > img {
    border-radius: 15px;
    /* border: 3px solid #000; */
    height: 17rem;
    @media (max-width: 1000px) {
      height: 14rem;
    }
    @media (max-width: 768px) {
      height: 10rem;
    }
  }
`;
