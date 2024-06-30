import { useLobby } from "../../context/lobbyContext";
import { allCards } from "../../lib/allCards";
import {
  CardDetails,
  CardType,
  GameAction,
  ServerAction,
} from "../../lib/types";
import { useClient } from "../../context/clientContext";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  GamePayload,
  useGameDispatch,
  useGamePlayer,
} from "../../context/gameContext";
import { useEffect, useState } from "react";
import {
  CARD_ROTATION_DURATION,
  CARD_ROTATION_FACTOR,
} from "../../lib/constants";

export default function Dealer() {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const controls = useAnimation();

  const lobby = useLobby();
  const client = useClient();

  const gameDispatch = useGameDispatch();

  const deckSize = lobby.deck.length;
  const radius = 25 * (deckSize ?? 5);

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        rotate: deckSize * CARD_ROTATION_FACTOR,
        transition: { duration: CARD_ROTATION_DURATION },
      });
    };

    sequence();
  }, [controls]);

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
    <div className="relative grid place-items-center">
      <motion.div
        className="relative grid h-[640px] w-[640px] place-items-center overflow-hidden"
        animate={controls}
      >
        <AnimatePresence>
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
                callback={
                  index == deckSize - 1 ? () => setIsCompleted(true) : () => {}
                }
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
      {isCompleted && (
        <>
          <TempCard />
          <PlayerCard />
        </>
      )}
    </div>
  );
}

function PlayerCard() {
  const player = useGamePlayer();
  const cardDetails = allCards[player.initialCard];
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        transition: {
          delay: 0.8,
        },
      });
      controls.start({
        opacity: 1,
        transition: { duration: 0.5 },
      });
      controls.start({
        y: [800, 200],
        transition: {
          duration: 1.2,
          ease: "easeOut",
        },
      });
    };

    sequence();
  }, [controls]);

  return (
    <motion.div
      className="absolute flex max-w-72 cursor-pointer select-none flex-col items-stretch rounded-2xl border-2 border-transparent bg-slate-700 p-2 opacity-0 shadow-lg hover:border-slate-50"
      animate={controls}
    >
      <img
        src={`/cards/${cardDetails.img}`}
        alt={cardDetails.name}
        className="rounded-lg object-fill"
        draggable={false}
      />
      <div className="p-2">
        <p className="text-center font-bold">{cardDetails.name}</p>
        <p className="py-2 text-left text-sm">{cardDetails.utility}</p>
      </div>
    </motion.div>
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
          duration: 0.7,
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

function GameCard(props: {
  deckSize: number;
  index: number;
  x: number;
  y: number;
  callback: () => void;
}) {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      controls.start({
        scale: [0.1, 1],
        opacity: [0, 1],
        transition: { duration: 0.5, delay: props.index / 8 },
      });
      await controls.start({
        rotate: props.deckSize * -CARD_ROTATION_FACTOR,
        transition: { duration: CARD_ROTATION_DURATION },
      });
      await controls.start({
        translateX: -props.x,
        translateY: -props.y,
        transition: { duration: 0.3, delay: props.index / 16 },
      });

      props.callback();
    };

    sequence();
  }, [controls]);

  const cardDetails: CardDetails = allCards[0];

  return (
    <motion.div
      className={`absolute flex select-none flex-col gap-1 rounded-md bg-slate-700 p-1 shadow-md`}
      animate={controls}
      style={{
        x: props.x,
        y: props.y,
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
