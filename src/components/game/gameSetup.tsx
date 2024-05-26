import { Lobby, ServerAction } from "../../lib/types";
import GameCard from "./gameCard";
import { Socket } from "socket.io-client";
import { defaultDeck } from "../../lib/allCards";

export default function GameSetup(props: { socket: Socket; lobby: Lobby }) {
  const isAdmin = true;
  const numCards = props.lobby.deck.length;
  const totalCards = props.lobby.players.length + 3;
  const isReady = numCards >= totalCards;

  const toggleCardEnabled = (cardId: number) => {
    if (!isAdmin) return;

    console.log(props.socket.id);

    let newDeck;
    if (props.lobby.deck.includes(cardId) == false) {
      // append card to deck - immutably ;)
      newDeck = [...props.lobby.deck, cardId];
    } else {
      // remove card from deck - immutably :)
      newDeck = [...props.lobby.deck].filter((id) => id != cardId);
    }

    const newLobby: Lobby = {
      ...props.lobby,
      deck: newDeck,
    };

    props.socket.emit(ServerAction.UpdateLobby, newLobby);
  };

  return (
    <div className="flex w-[680px] flex-grow flex-col items-stretch gap-2 rounded-lg bg-slate-700 p-2 shadow-xl">
      <div className="width-full flex flex-row flex-nowrap items-center justify-between px-2">
        <div className="select-none opacity-0">
          {numCards} / {totalCards} cards
        </div>
        <div className="font-bold">Setup</div>
        <div className="text-slate-400">
          {numCards} / {totalCards} cards
        </div>
      </div>
      <div className="flex flex-grow flex-wrap items-center justify-center gap-1 rounded-md bg-slate-800 p-2">
        {defaultDeck.map((card, i) => (
          <GameCard
            cardType={card}
            enabled={props.lobby.deck.includes(i)}
            toggleEnabled={() => toggleCardEnabled(i)}
            key={`${card}_${i}`}
          />
        ))}
      </div>
      <div className="flex flex-row flex-nowrap items-center justify-between gap-2">
        <button className="basis-full rounded-md bg-slate-800 p-2">Time</button>
        <button className="basis-full rounded-md bg-slate-800 p-2">
          {isReady ? "Ready" : "Waiting"}
        </button>
      </div>
    </div>
  );
}
