import { useAnimation, motion } from "framer-motion";
import { useEffect } from "react";
import { useGamePlayer } from "../../../context/gameContext";
import { allCards } from "../../../lib/allCards";

export default function PlayerCard() {
  const controls = useAnimation();
  const player = useGamePlayer();
  const cardDetails = allCards[player.initialCard];

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 1, ease: "anticipate" },
      });
      await controls.start({
        y: "25vh",
        transition: {
          delay: 1,
        },
      });
    };

    sequence();
  }, [controls]);

  return (
    <motion.div
      className="absolute flex w-full max-w-72 cursor-pointer select-none flex-col items-stretch rounded-2xl border-2 border-transparent bg-slate-700 p-2 shadow-lg hover:border-slate-50"
      initial={{
        y: "100vh",
        opacity: 0,
      }}
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
