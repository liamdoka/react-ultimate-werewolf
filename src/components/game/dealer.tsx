import { useLobby } from "../../context/lobbyContext";
import { allCards } from "../../lib/allCards";
import {
  CardDetails,
  CardType,
  GameAction,
  ServerAction,
} from "../../lib/types";
import { useClient } from "../../context/clientContext";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  GamePayload,
  useGameDispatch,
  useGamePlayer,
} from "../../context/gameContext";
import { MouseEvent, useEffect, useRef, useState } from "react";
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
    <div className="relative grid h-full w-full place-items-center">
      <motion.div
        className="absolute grid h-full max-h-[640px] w-full max-w-[640px] place-items-center overflow-hidden"
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

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

function PlayerCard() {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const player = useGamePlayer();
  const cardDetails = allCards[player.initialCard];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute flex w-full max-w-72 cursor-pointer select-none flex-col items-stretch rounded-2xl border-2 border-transparent bg-slate-700 p-2 shadow-lg hover:border-slate-50"
      style={{
        transform,
        transformStyle: "preserve-3d",
      }}
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
