import { Lobby, ServerAction } from "../../lib/types";
import GameCard from "./gameCard";
import { Socket } from "socket.io-client";
import { defaultDeck } from "../../lib/allCards";
import { useEffect, useRef } from "react";
import { Add, Remove } from "@mui/icons-material";
import {
  DISCUSSION_TIME_STEP_SIZE,
  MAX_DISCUSSION_TIME,
  MIN_DISCUSSION_TIME,
} from "../../lib/constants";

export default function GameSetup(props: { socket: Socket; lobby: Lobby }) {
  const numCards = props.lobby.deck.length;
  const totalCards = props.lobby.players.length + 3;

  const isReady = numCards >= totalCards;
  const isAdmin = props.socket.id === props.lobby.players[0].socketId;

  const discussionTimeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (discussionTimeRef.current) {
      discussionTimeRef.current.value = `${props.lobby.discussionTime}`;
    }
  }, [props.lobby.discussionTime]);

  const toggleCardEnabled = (cardId: number) => {
    if (!isAdmin) return;

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

  const changeDiscussionTime = (difference: number) => {
    if (!isAdmin) return;

    const newTime = props.lobby.discussionTime + difference;

    if (newTime < MIN_DISCUSSION_TIME || newTime > MAX_DISCUSSION_TIME) return;

    const newLobby: Lobby = {
      ...props.lobby,
      discussionTime: newTime,
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
        <div className="flex basis-full flex-row flex-nowrap items-center justify-center gap-2 rounded-md bg-slate-800 p-2">
          <div>Discussion time:</div>
          <div className="flex flex-row flex-nowrap items-stretch justify-center gap-1">
            {isAdmin && (
              <div
                className={`${props.lobby.discussionTime > MIN_DISCUSSION_TIME ? "cursor-pointer" : "cursor-not-allowed"} rounded-s-md bg-slate-700 px-1 text-slate-400 hover:text-slate-50`}
                onMouseDown={() =>
                  changeDiscussionTime(-DISCUSSION_TIME_STEP_SIZE)
                }
              >
                <Remove />
              </div>
            )}
            <div
              className={`${!isAdmin && "rounded-md"} bg-slate-700 px-2 font-mono text-lg font-bold`}
              ref={discussionTimeRef}
            >
              <div className="min-w-[3ch] text-center">
                {props.lobby.discussionTime}
              </div>
            </div>
            {isAdmin && (
              <div
                className={`${props.lobby.discussionTime < MAX_DISCUSSION_TIME ? "cursor-pointer" : "cursor-not-allowed"} cursor-pointer rounded-e-md bg-slate-700 px-1 text-slate-400 hover:text-slate-50`}
                onMouseDown={() =>
                  changeDiscussionTime(DISCUSSION_TIME_STEP_SIZE)
                }
              >
                <Add />
              </div>
            )}
          </div>
          <div>secs</div>
        </div>
        {isReady ? (
          <div className="basis-full rounded-md bg-slate-800 p-2 text-center font-bold">
            Ready
          </div>
        ) : (
          <div className="basis-full rounded-md p-2 text-center">
            Waiting...
          </div>
        )}
      </div>
    </div>
  );
}
