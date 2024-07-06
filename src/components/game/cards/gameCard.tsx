import { useAnimation, motion } from "framer-motion";
import { useEffect } from "react";
import { allCards } from "../../../lib/allCards";
import {
  CARD_ROTATION_FACTOR,
  CARD_ROTATION_DURATION,
} from "../../../lib/constants";
import { CardDetails } from "../../../lib/types";

export default function GameCard(props: {
  deckSize: number;
  index: number;
  x: number;
  y: number;
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
        rotate: Math.floor(props.deckSize / 4) * -CARD_ROTATION_FACTOR,
        transition: { duration: CARD_ROTATION_DURATION },
      });
      await controls.start({
        translateX: -props.x,
        translateY: -props.y,
        transition: { duration: 0.3, delay: props.index / 16 },
      });
      controls.set({
        rotate: 0,
      });
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
