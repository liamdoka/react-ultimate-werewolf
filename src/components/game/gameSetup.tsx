import { useState } from "react";
import { CardType, ServerAction } from "../../lib/types";
import GameCard from "./gameCard";
import { Socket } from "socket.io-client";

export default function GameSetup(props: { socket: Socket }) {
  const deck: CardType[] = [
    CardType.BluSpy,
    CardType.BluSpy,
    CardType.BluSpy,
    CardType.Soldier,
    CardType.Soldier,
    CardType.Soldier,
    CardType.Scout,
    CardType.Pyro,
    CardType.Engineer,
    CardType.Demoman,
    CardType.Medic,
    CardType.Medic,
    CardType.Sniper,
    CardType.Heavy,
    CardType.Spy,
  ];

  const [activeCards, setActiveCards] = useState<number[]>([0, 3]);

  const toggleCardEnabled = (cardId: number) => {
    if (!activeCards.includes(cardId)) {
      setActiveCards((prev) => [...prev, cardId]);
    } else {
      //const cardIndex = activeCards.indexOf(cardId);
      const newArray = [...activeCards].filter((id) => id != cardId);
      setActiveCards(newArray);
    }

    props.socket.emit(ServerAction.UpdateSetup, activeCards);
  };

  return (
    <div className="flex w-[680px]  flex-grow flex-col items-stretch gap-2 rounded-lg bg-slate-700 p-2 shadow-xl">
      <p className="text-center font-bold">Setup</p>
      <div className="flex flex-grow flex-wrap items-center justify-center gap-1 rounded-md bg-slate-800 p-2">
        {deck.map((card, i) => (
          <GameCard
            cardType={card}
            enabled={activeCards.includes(i)}
            toggleEnabled={() => toggleCardEnabled(i)}
            key={`${card}_${i}`}
          />
        ))}
      </div>
      <div className="flex flex-row flex-nowrap items-center justify-between gap-4">
        <button className="flex-grow rounded-md bg-slate-800 p-2">Time</button>
        <button className="flex-grow rounded-md bg-slate-800 p-2">Ready</button>
      </div>
    </div>
  );
}
