import { ArrowBack } from "@mui/icons-material";
import { useLobby } from "../../context/lobbyContext";
import { allCards, defaultDeck } from "../../lib/allCards";
import {
  CardDetails,
  CardType,
  GameState,
  ServerAction,
} from "../../lib/types";
import { useClient } from "../../context/clientContext";
import { easeOut, motion, useTime, useTransform } from "framer-motion";

export default function Dealer() {
  const lobby = useLobby();
  const client = useClient();
  
  const deckSize = lobby.deck.length
  const radius = 25 * (deckSize ?? 2);


  const time = useTime()
  const rotate = useTransform(
    time,
    [0, deckSize * 4000],
    [0, 360],
    { clamp: false}
  )


  return (
    <>
      <div
        onClick={() => {
          console.log(client.socket);
          client.socket?.emit(ServerAction.UpdateLobby, {
            ...lobby,
            state: GameState.Waiting,
          });
        }}
      >
        <ArrowBack />
      </div>
      <motion.div 
        className="relative grid h-[640px] w-[640px] place-items-center"
        style={{ rotate }}
      >
        {lobby.deck.map((deckIndex: number, index: number) => {
          const angle = (index / deckSize) * 2 * Math.PI
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          const cardType: CardType = defaultDeck[deckIndex];
          return (
            <GameCard
              cardType={cardType}
              deckSize={deckSize}
              x={x}
              y={y}
              key={`dealerCard_${index}`}
            />
          );
        })}
      </motion.div>
    </>
  );
}

function GameCard(props: { cardType: CardType; deckSize: number, x: number; y: number }) {
  const cardDetails: CardDetails = allCards[0] ;

  const time = useTime()
  const rotate = useTransform(
    time,
    [0, props.deckSize * 4000],
    [360, 0],
    { clamp: false}
  )

  return (
    <motion.div
      className={`absolute flex select-none flex-col gap-1 rounded-md bg-slate-700 p-1 shadow-md`}
      animate={{
        x: props.x,
        y: props.y,
        transition: {
          duration: 0.5, ease: easeOut, delay: 0.2
        }
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "rgba(255, 255, 255, 0.74) 0px 0px 12px"
      }}
      style={{
        transform: `translate(${props.x}px, ${props.y}px)`,
        rotate
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
