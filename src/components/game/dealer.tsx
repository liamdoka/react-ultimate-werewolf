import { useLobby } from "../../context/lobbyContext";
import { allCards } from "../../lib/allCards";
import { CardType, GameAction, ServerAction } from "../../lib/types";
import { useClient } from "../../context/clientContext";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { GamePayload, useGameDispatch } from "../../context/gameContext";
import { useEffect, useState } from "react";
import {
  CARD_ROTATION_DURATION,
  CARD_ROTATION_FACTOR,
} from "../../lib/constants";
import { useTimeout } from "../../lib/utils";
import PlayerCard from "./cards/playerCard";
import GameCard from "./cards/gameCard";

export default function Dealer() {
  const [tempCardVisible, setTempCardVisible] = useState<boolean>(false);
  const [PlayerCardVisible, setPlayerCardVisible] = useState<boolean>(false);
  const controls = useAnimation();

  const lobby = useLobby();
  const client = useClient();

  const gameDispatch = useGameDispatch();

  const deckSize = lobby.deck.length;
  const radius = 25 * (deckSize ?? 5);

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        rotate: Math.floor(deckSize / 4) * CARD_ROTATION_FACTOR,
        transition: { duration: CARD_ROTATION_DURATION },
      });
      // prettier-ignore
      controls.start({
        scale: 1.001,
        transition: { duration: 0.5 },
      })
      .then(() => {
        setTempCardVisible(true);
      });
    };

    sequence();
  }, [controls]);

  useTimeout(
    () => {
      setPlayerCardVisible(true);
      setTempCardVisible(false);
    },
    tempCardVisible ? 500 : null,
  );

  useEffect(() => {
    client.socket?.on(ServerAction.SetCard, handleSetCard);
    client.socket?.on(ServerAction.CheckCard, handleCheckCard);

    function handleSetCard(payload: CardType) {
      gameDispatch({
        action: GameAction.SetCard,
        payload: payload,
      } as GamePayload);
    }

    function handleCheckCard(payload: CardType) {
      gameDispatch({
        action: GameAction.CheckCard,
        payload: payload,
      } as GamePayload);
    }

    client.socket?.emit(ServerAction.SetCard);

    () => {
      client.socket?.off(ServerAction.SetCard, handleSetCard);
      client.socket?.off(ServerAction.CheckCard, handleCheckCard);
    };
  }, [client.socket]);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <motion.div
        className="grid h-full w-full place-items-center"
        animate={controls}
      >
        {lobby.deck.map((_, index: number) => {
          const angle = (index / deckSize - 1) * 2 * Math.PI;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <GameCard
              deckSize={deckSize}
              index={index}
              x={x}
              y={y}
              key={`dealerCard_${index}`}
            />
          );
        })}
      </motion.div>

      <div className="absolute grid h-full w-full place-items-center items-center overflow-hidden">
        <AnimatePresence>
          {tempCardVisible && <TempCard />}
          {PlayerCardVisible && <PlayerCard />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TempCard() {
  const cardDetails = allCards[0];

  return (
    <motion.div
      className={`absolute flex cursor-pointer select-none flex-col gap-1 rounded-md border-white bg-slate-700 p-1 shadow-md hover:border`}
      animate={{
        y: 800,
        transition: {
          duration: 0.8,
        },
      }}
    >
      <div className="w-24 overflow-clip rounded-sm">
        <img
          className="bg-cover"
          draggable={false}
          src={`/cards/${cardDetails.img}`}
          alt={cardDetails.name}
        />
      </div>
      <p className="text-center font-bold">{cardDetails.name}</p>
    </motion.div>
  );
}
