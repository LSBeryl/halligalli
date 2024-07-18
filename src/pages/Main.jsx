import styled from "styled-components";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import Bell from "../components/Bell";
import { Link } from "react-router-dom";
import { SquareArrowOutUpRight } from "lucide-react";

export default function Main() {
  const [player, setPlayer] = useState(2);
  return (
    <Wrapper>
      <Container>
        <Title>할리갈리</Title>
        <Box>
          <div>플레이어 수를 선택해주세요</div>
          <div>
            <Link
              to="https://maze-gate-ac3.notion.site/f25dd3de31eb452582f79eee308c8e7e"
              target="_blank"
            >
              게임 설명 보기 <SquareArrowOutUpRight />
            </Link>
          </div>
          <div>
            <Player
              style={{
                background: player == 2 ? "#eee" : "#ddd",
                color: player == 2 ? "#111" : "#aaa",
              }}
              onClick={() => {
                setPlayer(2);
              }}
            >
              2명
            </Player>
            <Player
              style={{
                background: player == 3 ? "#eee" : "#ddd",
                color: player == 3 ? "#111" : "#aaa",
              }}
              onClick={() => {
                setPlayer(3);
              }}
            >
              3명
            </Player>
            <Player
              style={{
                background: player == 4 ? "#eee" : "#ddd",
                color: player == 4 ? "#111" : "#aaa",
              }}
              onClick={() => {
                setPlayer(4);
              }}
            >
              4명
            </Player>
          </div>
        </Box>
        <Start to={`/play?player=${player}`}>시작!</Start>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  @font-face {
    font-family: "pop";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/ONE-Mobile-POP.woff")
      format("woff");
  }
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: linear-gradient(to right bottom, #89b940, #4d6924); */
  background: linear-gradient(#3a5a8f, #67a4a3);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.div`
  font-family: "pop";
  text-shadow: -1px 0px #000, 0px 1px #000, 1px 0px #000, 0px -1px #000;
  color: #fae82e;
  font-size: 3rem;
`;

const Box = styled.div`
  &,
  & * {
    font-family: "pop";
  }
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 2px #555;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  & > div:nth-child(1) {
    font-size: 1.2rem;
  }
  & > div:nth-child(2) {
    display: flex;
    font-size: 0.9rem;
    justify-content: center;
    & > a {
      color: #000;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.1rem;
      & > svg {
        height: 0.9rem;
      }
    }
  }
  & > div:nth-child(3) {
    display: flex;
  }
`;

const Player = styled.div`
  padding: 1rem 1.3rem;
  user-select: none;
  transition: all 0.2s ease;
  cursor: pointer;
  &:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const Start = styled(Link)`
  font-family: "pop";
  border-radius: 10px;
  padding: 0.5rem 1.5rem;
  background: #eee;
  color: #111;
  position: relative;
  bottom: 2rem;
  border: 1px solid #ddd;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
`;
