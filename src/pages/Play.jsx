import styled, { css, keyframes } from "styled-components";
import Card from "../components/Card";
import { useEffect, useRef, useState } from "react";
import Bell from "../components/Bell";
import { useNavigate, useSearchParams } from "react-router-dom";
import CardBack from "../components/CardBack";
import * as takeAnimations from "../components/GivingAnimations";
import * as BellCardAnimations from "../components/BellCardAnimations";

export default function Play() {
  const wrapperRef = useRef(null);
  const readyRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [isStarted, setIsStarted] = useState(false);

  const [player, setPlayer] = useState("0");
  const [turn, setTurn] = useState(["turn", "", "", ""]);
  const [out, setOut] = useState(["save", "save", "save", "save"]);
  const [isBellPos, setIsBellPos] = useState(false); // 종이 눌려도 되는지 확인 > 5개 과일 있는지 확인
  const [isBellTermPos, setIsBellTermPos] = useState(true); // 종 누른 후 텀 주기 위한 상태

  // 첫번째 deck, 두번째 played
  const [oneCard, setOneCard] = useState([[], []]);
  const [twoCard, setTwoCard] = useState([[], []]);
  const [threeCard, setThreeCard] = useState([[], []]);
  const [fourCard, setFourCard] = useState([[], []]);

  const [takeData, setTakeData] = useState({ taker: null, player: null }); // 과일 5개 맞춰서 종 쳤을 시 누가 쳤는지(taker), 플레이어는 몇 명인지(player) 결정

  const [isEnd, setIsEnd] = useState(false);

  const navigate = useNavigate();

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    // 플레이어 몇 명인지 결정
    setPlayer(searchParams.get("player"));
  }, []);

  useEffect(() => {
    // 게임 끝나면 첫 화면으로
    if (isEnd) navigate("/");
  }, [isEnd]);

  useEffect(() => {
    if (player == "2" || player == "3" || player == "4") {
      // 초기 카드 설정 > 56장
      const initCards = []; // 전체 카드 덱 생성
      const selectedCardIdxs = []; // 개인 덱에 들어간 카드의 initCards에서의 인덱스 저장 > 중복 방지
      for (let i = 0; i < 4; i++) {
        let tempType =
          i == 0 ? "banana" : i == 1 ? "berry" : i == 2 ? "grape" : "green";
        for (let j = 0; j < 5; j++) {
          // 과일 1개 카드 5장
          initCards.push({
            type: tempType,
            num: 1,
          });
        }
        for (let j = 0; j < 3; j++) {
          // 2개 카드 3장
          initCards.push({
            type: tempType,
            num: 2,
          });
        }
        for (let j = 0; j < 3; j++) {
          // 3개 카드 3장
          initCards.push({
            type: tempType,
            num: 3,
          });
        }
        for (let j = 0; j < 2; j++) {
          // 4개 카드 2장
          initCards.push({
            type: tempType,
            num: 4,
          });
        }
        // 5개 카드 1장
        initCards.push({
          type: tempType,
          num: 5,
        });
      }

      function setDeck(setSomeDeck) {
        const tempDeck = [];
        const deckNum = player == "2" ? 28 : player == "3" ? 18 : 14;
        for (let i = 0; i < deckNum; i++) {
          // 2인플 > 28장씩, 3인플 > 18장씩, 4인플 > 14장씩
          let rndIdx = rand(0, initCards.length - 1);
          while (selectedCardIdxs.indexOf(rndIdx) != -1)
            rndIdx = rand(0, initCards.length - 1);
          selectedCardIdxs.push(rndIdx);
          tempDeck.push(initCards[rndIdx]);
        }
        setSomeDeck([[...tempDeck], []]);
      }

      setDeck(setOneCard);
      setDeck(setTwoCard);
      if (Number(player) > 2) {
        setDeck(setThreeCard);
        if (Number(player) > 3) setDeck(setFourCard);
      }
    }
  }, [player]);

  useEffect(() => {
    // 게임 시작 DOM 관련 useEffect
    if (wrapperRef.current) {
      wrapperRef.current.focus();
    }

    if (readyRef.current) {
      const elem = readyRef.current;
      async function changeReady() {
        setIsStarted(false);
        await wait(1.5);
        elem.innerHTML = "Start!";
        await wait(0.5);
        elem.style.display = "none";
        setIsStarted(true);
      }
      changeReady();
    }
  }, [player]);

  useEffect(() => {
    // 카드 낼 때마다 종 가능한지 확인하는 useEffect
    let nums = [0, 0, 0, 0]; // 각 과일 별 개수, 순서대로 바나나/딸기/보라색/초록색
    let tempIsBellPos = false; // 종 치는 거 가능한지 임시로 저장

    function setNum(card) {
      if (card) {
        if (card.type == "banana") nums[0] += Number(card.num);
        else if (card.type == "berry") nums[1] += Number(card.num);
        else if (card.type == "grape") nums[2] += Number(card.num);
        else if (card.type == "green") nums[3] += Number(card.num);

        if (nums.filter((v) => v == 5).length > 0) tempIsBellPos = true;
        else tempIsBellPos = false;
      }
    }

    if (oneCard[0]) setNum(oneCard[1][oneCard[1].length - 1]);
    if (twoCard[0]) setNum(twoCard[1][twoCard[1].length - 1]);
    if (threeCard[0]) setNum(threeCard[1][threeCard[1].length - 1]);
    if (fourCard[0]) setNum(fourCard[1][fourCard[1].length - 1]);

    tempIsBellPos ? setIsBellPos(true) : setIsBellPos(false); // 각 카드들 검사 후 tempIsBellPos의 최종 값을 할당
  }, [oneCard, twoCard, threeCard, fourCard]);

  async function wait(s) {
    return new Promise((res) => setTimeout(res, s * 1000));
  }

  function takeCardB(taker, setTaker, giveCard, setGiver, giver) {
    giveCard[1].forEach((card) => {
      if (giveCard[1].length > 0) {
        if (taker == 1)
          setOut((prev) => {
            const tempOut = [...prev];
            tempOut[0] = "save";
            return tempOut;
          });
        else if (taker == 2)
          setOut((prev) => {
            const tempOut = [...prev];
            tempOut[1] = "save";
            return tempOut;
          });
        else if (taker == 3)
          setOut((prev) => {
            const tempOut = [...prev];
            tempOut[2] = "save";
            return tempOut;
          });
        else if (taker == 4)
          setOut((prev) => {
            const tempOut = [...prev];
            tempOut[3] = "save";
            return tempOut;
          });
      }
      setTaker((prev) => [[...prev[0], card], [...prev[1]]]);
    });
    setGiver((prev) => {
      if (prev[0][prev[0].length - 1]) {
        return [
          prev[0].filter((_, idx) => idx != prev[0].length - 1),
          [prev[0][prev[0].length - 1]],
        ];
      } else {
        if (prev[0][prev[0].length - 2]) return [[...prev[0]], []];
        else {
          if (giver == 1)
            setOut((prev) => {
              const tempOut = [...prev];
              tempOut[0] = "out";
              return tempOut;
            });
          else if (giver == 2)
            setOut((prev) => {
              const tempOut = [...prev];
              tempOut[1] = "out";
              return tempOut;
            });
          else if (giver == 3)
            setOut((prev) => {
              const tempOut = [...prev];
              tempOut[2] = "out";
              return tempOut;
            });
          else if (giver == 4)
            setOut((prev) => {
              const tempOut = [...prev];
              tempOut[3] = "out";
              return tempOut;
            });
        }
        return [[...prev[0]], []];
      }
    });
  }

  function takeCardA(taker) {
    if (taker == 1) {
      takeCardB(taker, setOneCard, twoCard, setTwoCard, 2);
      takeCardB(taker, setOneCard, threeCard, setThreeCard, 3);
      takeCardB(taker, setOneCard, fourCard, setFourCard, 4);
    } else if (taker == 2) {
      takeCardB(taker, setTwoCard, oneCard, setOneCard, 1);
      takeCardB(taker, setTwoCard, threeCard, setThreeCard, 3);
      takeCardB(taker, setTwoCard, fourCard, setFourCard, 4);
    } else if (taker == 3) {
      takeCardB(taker, setThreeCard, oneCard, setOneCard, 1);
      takeCardB(taker, setThreeCard, twoCard, setTwoCard, 2);
      takeCardB(taker, setThreeCard, fourCard, setFourCard, 4);
    } else if (taker == 4) {
      takeCardB(taker, setFourCard, oneCard, setOneCard, 1);
      takeCardB(taker, setFourCard, twoCard, setTwoCard, 2);
      takeCardB(taker, setFourCard, threeCard, setThreeCard, 3);
    }
  }

  async function pressBell(who) {
    setTakeData({ taker: who, player: player });
    setIsBellTermPos(false);
    await wait(0.5);
    takeCardA(who);
    setIsBellTermPos(true);
    setTakeData({ taker: null, player: player });
  }

  return (
    <Wrapper
      ref={wrapperRef}
      onKeyDown={(e) => {
        function playerAct() {
          const keys = ["q", "z", "p", "m", "ㅂ", "ㅋ", "ㅔ", "ㅡ"];
          const bellKeys = ["w", "x", "o", "n", "ㅈ", "ㅌ", "ㅐ", "ㅜ"];
          if (keys.indexOf(e.key) != -1 && isStarted && isBellTermPos) {
            if ((e.key == "q" || e.key == "ㅂ") && turn[0]) {
              setTurn((prev) => {
                const tempTurn = ["", "", "", ""];
                let idx = (prev.indexOf("turn") + 1) % Number(player);
                while (out[idx] == "out") {
                  idx = (idx + 1) % Number(player);
                }
                tempTurn[idx] = "turn";
                return tempTurn;
              });
              setOneCard((prev) => {
                const yeahOneDeck = prev[0];
                const yeahOnePlayed = prev[1];

                if (yeahOneDeck.length > 0) {
                  if (yeahOneDeck.length == 1) {
                    setOut((prev) => {
                      const tempOut = [...prev];
                      tempOut[0] = "out";
                      if (
                        tempOut.filter((msg) => msg == "out").length >=
                        Number(player) - 1
                      ) {
                        alert(`플레이어 ${tempOut.indexOf("save") + 1} 우승!`);
                        setIsEnd(true);
                      }
                      return tempOut;
                    });
                  }
                  yeahOnePlayed.push(yeahOneDeck.pop());
                } else {
                  console.log("카드 남은거 없는데 ㅋ");
                }

                return [[...yeahOneDeck], [...yeahOnePlayed]];
              });
            } else if ((e.key == "p" || e.key == "ㅔ") && turn[1]) {
              if (player != "2") {
                setTurn((prev) => {
                  const tempTurn = ["", "", "", ""];
                  let idx = (prev.indexOf("turn") + 1) % Number(player);
                  while (out[idx] == "out") {
                    idx = (idx + 1) % Number(player);
                  }
                  tempTurn[idx] = "turn";
                  console.log(tempTurn);
                  return tempTurn;
                });
                setTwoCard((prev) => {
                  const yeahTwoDeck = prev[0];
                  const yeahTwoPlayed = prev[1];

                  if (yeahTwoDeck.length > 0) {
                    if (yeahTwoDeck.length == 1) {
                      setOut((prev) => {
                        const tempOut = [...prev];
                        tempOut[1] = "out";
                        if (
                          tempOut.filter((msg) => msg == "out").length >=
                          Number(player) - 1
                        ) {
                          alert(
                            `플레이어 ${tempOut.indexOf("save") + 1} 우승!`
                          );
                          setIsEnd(true);
                        }
                        return tempOut;
                      });
                    }
                    yeahTwoPlayed.push(yeahTwoDeck.pop());
                  } else {
                    console.log("카드 남은거 없는데 ㅋ");
                  }

                  return [[...yeahTwoDeck], [...yeahTwoPlayed]];
                });
              }
            } else if ((e.key == "z" || e.key == "ㅋ") && turn[2]) {
              if (player != "2") {
                setTurn((prev) => {
                  const tempTurn = ["", "", "", ""];
                  let idx = (prev.indexOf("turn") + 1) % Number(player);
                  while (out[idx] == "out") {
                    idx = (idx + 1) % Number(player);
                  }
                  tempTurn[idx] = "turn";
                  return tempTurn;
                });
                setThreeCard((prev) => {
                  const yeahThreeDeck = prev[0];
                  const yeahThreePlayed = prev[1];

                  if (yeahThreeDeck.length > 0) {
                    if (yeahThreeDeck.length == 1) {
                      setOut((prev) => {
                        const tempOut = [...prev];
                        tempOut[2] = "out";
                        if (
                          tempOut.filter((msg) => msg == "out").length >=
                          Number(player) - 1
                        ) {
                          alert(
                            `플레이어 ${tempOut.indexOf("save") + 1} 우승!`
                          );
                          setIsEnd(true);
                        }
                        return tempOut;
                      });
                    }
                    yeahThreePlayed.push(yeahThreeDeck.pop());
                  } else {
                    console.log("카드 남은거 없는데 ㅋ");
                  }

                  return [[...yeahThreeDeck], [...yeahThreePlayed]];
                });
              }
            } else if (e.key == "m" || e.key == "ㅡ") {
              if ((player == "2" && turn[1]) || (player == "4" && turn[3])) {
                if (player == "2") {
                  setTurn((prev) => {
                    const tempTurn = ["", "", "", ""];
                    let idx = (prev.indexOf("turn") + 1) % Number(player);
                    while (out[idx] == "out") {
                      idx = (idx + 1) % Number(player);
                    }
                    tempTurn[idx] = "turn";
                    return tempTurn;
                  });
                  setTwoCard((prev) => {
                    const yeahTwoDeck = prev[0];
                    const yeahTwoPlayed = prev[1];

                    if (yeahTwoDeck.length > 0) {
                      if (yeahTwoDeck.length == 1) {
                        setOut((prev) => {
                          const tempOut = [...prev];
                          tempOut[1] = "out";
                          if (
                            tempOut.filter((msg) => msg == "out").length >=
                            Number(player) - 1
                          ) {
                            alert(
                              `플레이어 ${tempOut.indexOf("save") + 1} 우승!`
                            );
                            setIsEnd(true);
                          }
                          return tempOut;
                        });
                      }
                      yeahTwoPlayed.push(yeahTwoDeck.pop());
                    } else {
                      console.log("카드 남은거 없는데 ㅋ");
                    }

                    return [[...yeahTwoDeck], [...yeahTwoPlayed]];
                  });
                } else if (player == "4") {
                  setTurn((prev) => {
                    const tempTurn = ["", "", "", ""];
                    let idx = (prev.indexOf("turn") + 1) % Number(player);
                    while (out[idx] == "out") {
                      idx = (idx + 1) % Number(player);
                    }
                    tempTurn[idx] = "turn";
                    return tempTurn;
                  });
                  setFourCard((prev) => {
                    const yeahFourDeck = prev[0];
                    const yeahFourPlayed = prev[1];

                    if (yeahFourDeck.length > 0) {
                      if (yeahFourDeck.length == 1) {
                        setOut((prev) => {
                          const tempOut = [...prev];
                          tempOut[3] = "out";
                          if (
                            tempOut.filter((msg) => msg == "out").length >=
                            Number(player) - 1
                          ) {
                            alert(
                              `플레이어 ${tempOut.indexOf("save") + 1} 우승!`
                            );
                            setIsEnd(true);
                          }
                          return tempOut;
                        });
                      }
                      yeahFourPlayed.push(yeahFourDeck.pop());
                    } else {
                      console.log("카드 남은거 없는데 ㅋ");
                    }

                    return [[...yeahFourDeck], [...yeahFourPlayed]];
                  });
                }
              }
            }
          }

          if (bellKeys.indexOf(e.key) != -1 && isStarted) {
            if (isBellPos && isBellTermPos) {
              const bellSound = new Audio("/audio/bell.mp3");
              bellSound.play();
              if (e.key == "w" || e.key == "ㅈ") {
                pressBell(1);
              } else if (e.key == "x" || e.key == "ㅌ") {
                if (player != "2") {
                  pressBell(3);
                }
              } else if (e.key == "o" || e.key == "ㅐ") {
                if (player != "2") {
                  pressBell(2);
                }
              } else if (e.key == "n" || e.key == "ㅜ") {
                if (player == "2") {
                  pressBell(2);
                } else if (player == "4") {
                  pressBell(4);
                }
              }
            } else {
              console.log(
                "누가 잘못 눌렀는지, 잘못 누르고 벨 밑으로 카드 이동, 벨 밑 카드까지 이동 아직 미구현이니 이거 보시면 만드셈~~"
              );
            }
          }
        }
        playerAct();
      }}
      tabIndex="0"
    >
      <BoxCon takedata={takeData}>
        <div>
          <Box turn={turn[0]} out={out[0] == "out" ? "out" : ""}>
            <div>
              <CardBack />
            </div>
            {oneCard[1].map((data, idx) => (
              <CardContainer key={idx}>
                <Card type={data.type} num={data.num} />
                <CardBack />
              </CardContainer>
            ))}
            <Stat player={player}>
              <span>남은 카드 {oneCard[0].length}장</span>
            </Stat>
          </Box>
          <Box
            style={{ display: player == "2" ? "none" : "" }}
            turn={player == "3" || player == "4" ? turn[1] : null}
            out={out[1] == "out" ? "out" : ""}
          >
            <div>
              <CardBack />
            </div>
            {player != "2" &&
              twoCard[1].map((data, idx) => (
                <CardContainer key={idx}>
                  <Card type={data.type} num={data.num} />
                  <CardBack />
                </CardContainer>
              ))}
            <Stat player={player}>
              <span>남은 카드 {twoCard[0].length}장</span>
            </Stat>
          </Box>
        </div>
        <div>
          <Box
            style={{ display: player == "2" ? "none" : "" }}
            turn={player == "3" || player == "4" ? turn[2] : null}
            out={out[2] == "out" ? "out" : ""}
          >
            <div>
              <CardBack />
            </div>
            {threeCard[1].map((data, idx) => (
              <CardContainer key={idx}>
                <Card type={data.type} num={data.num} />
                <CardBack />
              </CardContainer>
            ))}
            <Stat player={player}>
              <span>남은 카드 {threeCard[0].length}장</span>
            </Stat>
          </Box>
          <Box
            style={{ display: player == "3" ? "none" : "" }}
            turn={player == "2" ? turn[1] : player == "4" ? turn[3] : null}
            out={
              player == "2"
                ? out[1] == "out"
                  ? "out"
                  : ""
                : out[3] == "out"
                ? "out"
                : ""
            }
          >
            <div>
              <CardBack />
            </div>
            {player == "2"
              ? twoCard[1].map((data, idx) => (
                  <CardContainer key={idx}>
                    <Card type={data.type} num={data.num} />
                    <CardBack />
                  </CardContainer>
                ))
              : player == "4"
              ? fourCard[1].map((data, idx) => (
                  <CardContainer key={idx}>
                    <Card type={data.type} num={data.num} />
                    <CardBack />
                  </CardContainer>
                ))
              : null}
            <Stat player={player}>
              <span>
                남은 카드{" "}
                {player == "2" ? twoCard[0].length : fourCard[0].length}장
              </span>
            </Stat>
          </Box>
        </div>
      </BoxCon>
      <BellCon>
        <Bell />
      </BellCon>
      <ReadyContainer ref={readyRef}>Ready...</ReadyContainer>
    </Wrapper>
  );
}

const cardSpin = keyframes`
  0% {
    transform: translateY(50vh) rotateX(0deg);
  }
  100% {
    transform: translateY(0) rotateX(180deg);
  }
`;

const upCardSpin = keyframes`
  0% {
    transform: translateY(-50vh) rotateX(0deg);
  }
  100% {
    transform: translateY(0) rotateX(-180deg);
  }
`;

const initiationUp = keyframes`
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(0);
  }
  60% {
    transform: translateY(0);
  }
  80% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-200vh);
  }
`;

const initiationDown = keyframes`
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(0);
  }
  60% {
    transform: translateY(0);
  }
  80% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(200vh);
  }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(#67a4a3, #3a5a8f);
  overflow: hidden;
`;

const BoxCon = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  & > div {
    flex-grow: 1;
    display: flex;
    gap: 2rem;
    margin: 1rem;
    justify-content: center;
    &:nth-child(1) {
      & > div {
        & > div:nth-child(1) {
          animation: ${initiationUp} 2s forwards;
        }
        & > div:not(:nth-child(1)) {
          position: absolute;
          animation: ${upCardSpin} 0.5s forwards;
        }
        // 각 플레이어 <Box /> css
        &:nth-child(1) {
          & > div:not(:nth-child(1)) {
            // 2명, 3명, 4명 기준 플레이어 1
            ${(props) => {
              const player = props.takedata.player; // 현재 플레이어 수
              const taker = props.takedata.taker; // 종 친 사람
              if (player == "2") {
                if (taker == 1) {
                  return css`
                    animation: ${takeAnimations.up} 0.5s forwards;
                  `;
                } else if (taker == 2)
                  return css`
                    animation: ${takeAnimations.down} 0.5s forwards;
                  `;
              } else if (player == "3") {
                if (taker == 1) {
                  return css`
                    animation: ${takeAnimations.up} 0.5s forwards;
                  `;
                } else if (taker == 2)
                  return css`
                    animation: ${takeAnimations.rightUp} 0.5s forwards;
                  `;
                else if (taker == 3)
                  return css`
                    animation: ${takeAnimations.leftDownMid} 0.5s forwards;
                  `;
              } else if (player == "4") {
                if (taker == 1) {
                  return css`
                    animation: ${takeAnimations.up} 0.5s forwards;
                  `;
                } else if (taker == 2)
                  return css`
                    animation: ${takeAnimations.rightUp} 0.5s forwards;
                  `;
                else if (taker == 3)
                  return css`
                    animation: ${takeAnimations.down} 0.5s forwards;
                  `;
                else if (taker == 4)
                  return css`
                    animation: ${takeAnimations.rightDown} 0.5s forwards;
                  `;
              }
            }}
          }
        }
        &:nth-child(2) {
          & > div:not(:nth-child(1)) {
            // 2명 X
            // 3명, 4명 기준 플레이어 2
            ${(props) => {
              const player = props.takedata.player;
              const taker = props.takedata.taker;
              if (player == "3") {
                if (taker == 1)
                  return css`
                    animation: ${takeAnimations.leftUp} 0.5s forwards;
                  `;
                else if (taker == 2)
                  return css`
                    animation: ${takeAnimations.up} 0.5s forwards;
                  `;
                else if (taker == 3)
                  return css`
                    animation: ${takeAnimations.rightDownMid} 0.5s forwards;
                  `;
              } else if (player == "4") {
                if (taker == 1)
                  return css`
                    animation: ${takeAnimations.leftUp} 0.5s forwards;
                  `;
                else if (taker == 2)
                  return css`
                    animation: ${takeAnimations.up} 0.5s forwards;
                  `;
                else if (taker == 3)
                  return css`
                    animation: ${takeAnimations.leftDown} 0.5s forwards;
                  `;
                else if (taker == 4)
                  return css`
                    animation: ${takeAnimations.down} 0.5s forwards;
                  `;
              }
            }}
          }
        }
      }
    }
    &:nth-child(2) {
      & > div {
        & > div:nth-child(1) {
          animation: ${initiationDown} 2s forwards;
        }
        & > div:not(:nth-child(1)) {
          animation: ${cardSpin} 0.5s forwards;
        }
        // 각 플레이어 <Box /> css
        &:nth-child(1) {
          & > div:not(:nth-child(1)) {
            // 2명 X
            // 3명, 4명 기준 플레이어 3
            ${(props) => {
              const player = props.takedata.player;
              const taker = props.takedata.taker;
              if (player == "3") {
                if (taker == 1)
                  return css`
                    animation: ${takeAnimations.midUpLeft} 0.5s forwards;
                  `;
                else if (taker == 2)
                  return css`
                    animation: ${takeAnimations.midUpRight} 0.5s forwards;
                  `;
                else if (taker == 3)
                  return css`
                    animation: ${takeAnimations.down} 0.5s forwards;
                  `;
              } else if (player == "4") {
                if (taker == 1)
                  return css`
                    animation: ${takeAnimations.up} 0.5s forwards;
                  `;
                else if (taker == 2)
                  return css`
                    animation: ${takeAnimations.rightUp} 0.5s forwards;
                  `;
                else if (taker == 3)
                  return css`
                    animation: ${takeAnimations.down} 0.5s forwards;
                  `;
                else if (taker == 4)
                  return css`
                    animation: ${takeAnimations.rightDown} 0.5s forwards;
                  `;
              }
            }}
          }
        }
        &:nth-child(2) {
          & > div:not(:nth-child(1)) {
            // 2명 기준 플레이어 2
            // 3명 X
            // 4명 기준 플레이어 4
            ${(props) => {
              const player = props.takedata.player;
              const taker = props.takedata.taker;
              if (player == "2") {
                if (taker == 1)
                  return css`
                    animation: ${takeAnimations.up} 0.5s forwards;
                  `;
                else if (taker == 2)
                  return css`
                    animation: ${takeAnimations.down} 0.5s forwards;
                  `;
              } else if (player == "4") {
                if (taker == 1)
                  return css`
                    animation: ${takeAnimations.leftUp} 0.5s forwards;
                  `;
                else if (taker == 2)
                  return css`
                    animation: ${takeAnimations.up} 0.5s forwards;
                  `;
                else if (taker == 3)
                  return css`
                    animation: ${takeAnimations.leftDown} 0.5s forwards;
                  `;
                else if (taker == 4)
                  return css`
                    animation: ${takeAnimations.down} 0.5s forwards;
                  `;
              }
            }}
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    height: 70%;
  }
  @media (max-width: 550px) {
    height: 50%;
  }
`;

const Box = styled.div`
  width: 50%;
  height: 100%;
  // #04ff0031 turn bg
  // #cdcdcd31 normal bg
  // #ff000014 out bg
  background: ${(props) =>
    props.out ? "#ff000047" : props.turn ? "#04ff0031" : "#cdcdcd31"};
  // #3fff5f8f turn bd
  // #ffffff8f normal bd
  // #ff4545a7 out bd
  border: 1px solid
    ${(props) =>
      props.out ? "#ff0000a7" : props.turn ? "#3fff5f8f" : "#ffffff8f"};
  transition: all 0.2s ease;
  box-sizing: border-box;
  border-radius: 10px;
  position: relative;
  perspective: 1000px;
  display: flex;
  justify-content: center;
  & > div:nth-child(1) {
    display: flex;
    align-items: center;
  }
`;

const BellCon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const CardContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  transform-style: preserve-3d;
  transition: 0.3s ease;
  & > div {
    position: absolute;
    backface-visibility: hidden;
    &:nth-child(1) {
      // 뒷면
      transform: rotateX(180deg);
    }
    &:nth-child(2) {
      // 앞면
    }
  }
`;

const ReadyContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #00000074;
  color: #eee;
  font-weight: 800;
  font-size: 3rem;
  transition: all 0.3s ease;
`;

const Stat = styled.div`
  position: absolute;
  width: 100%;
  height: 3rem;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0.3rem 1rem;
  transform: rotateX(0deg) !important;
  display: flex;
  align-items: center;
  ${(props) =>
    Number(props.player) > 3
      ? css`
          justify-content: center;
        `
      : null}
  color: #dedede;
  font-size: 0.9rem;
  font-weight: 100;
  & > span {
    border-radius: 5px;
    border: 1px solid #ffffff8f;
    padding: 0.2rem 0.5rem;
  }
`;
