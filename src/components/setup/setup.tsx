import { Lobby, Player, ServerAction } from "../../lib/types";
import SetupCard from "./setupCard";
import { defaultDeck } from "../../lib/allCards";
import { useEffect, useRef, useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import {
  COUNTDOWN_TIME,
  DISCUSSION_TIME_STEP_SIZE,
  MAX_DISCUSSION_TIME,
  MIN_DISCUSSION_TIME,
} from "../../lib/constants";
import CannotRemoveCardToast from "../toasts/cannotRemoveCardToast";
import { toast } from "react-toastify";
import { useLobby } from "../../context/lobbyContext";
import { useClient } from "../../context/clientContext";

export default function Setup(props: { timeToStart: number }) {
  const [isReady, setIsReady] = useState<boolean>(false);

  const lobby = useLobby();
  const client = useClient();

  const numCards = lobby.deck.length;
  const totalCards = lobby.players.length + 3;

  const isLobbyReady = numCards >= totalCards;
  const isAdmin = client.socket?.id === lobby.admin;

  const discussionTimeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    client.socket?.emit(ServerAction.SyncLobby);
  }, [])

  useEffect(() => {
    if (discussionTimeRef.current) {
      discussionTimeRef.current.value = `${lobby.discussionTime}`;
    }
  }, [lobby.discussionTime]);

  const toggleCardEnabled = (cardId: number) => {
    if (!isAdmin) return;

    if (cardId === 0) {
      toast(<CannotRemoveCardToast />, {
        hideProgressBar: true,
        autoClose: 2000,
      });

      return;
    }

    let newDeck;
    if (lobby.deck.includes(cardId) == false) {
      // append card to deck - immutably ;)
      newDeck = [...lobby.deck, cardId];
    } else {
      // remove card from deck - immutably :)
      newDeck = [...lobby.deck].filter((id) => id != cardId);
    }

    const newLobby: Lobby = {
      ...lobby,
      deck: newDeck,
    };

    client.socket?.emit(ServerAction.UpdateLobby, newLobby);
  };

  const toggleReady = () => {
    const newLobby = { ...lobby };
    const playerIndex = newLobby.players.findIndex(
      (player: Player) => player.socketId === client.socket?.id,
    );

    newLobby.players[playerIndex].isReady = !isReady;
    setIsReady(!isReady);
    client.socket?.emit(ServerAction.UpdateLobby, newLobby);
  };

  const changeDiscussionTime = (difference: number) => {
    if (!isAdmin) return;

    const newTime = lobby.discussionTime + difference;

    if (newTime < MIN_DISCUSSION_TIME || newTime > MAX_DISCUSSION_TIME) return;

    const newLobby: Lobby = {
      ...lobby,
      discussionTime: newTime,
    };
    client.socket?.emit(ServerAction.UpdateLobby, newLobby);
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
          <SetupCard
            cardType={card}
            enabled={lobby.deck.includes(i)}
            toggleEnabled={() => toggleCardEnabled(i)}
            selectable={i !== 0 ? isAdmin : false}
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
                className={`${lobby.discussionTime > MIN_DISCUSSION_TIME ? "cursor-pointer" : "cursor-not-allowed"} rounded-s-md bg-slate-700 px-1 text-slate-400 hover:text-slate-50`}
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
                {lobby.discussionTime}
              </div>
            </div>
            {isAdmin && (
              <div
                className={`${lobby.discussionTime < MAX_DISCUSSION_TIME ? "cursor-pointer" : "cursor-not-allowed"} rounded-e-md bg-slate-700 px-1 text-slate-400 hover:text-slate-50`}
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
        {isLobbyReady ? (
          <div
            className={`basis-full cursor-pointer rounded-md ${isReady ? "bg-emerald-800" : "bg-slate-800"} p-2 text-center font-bold`}
            onClick={toggleReady}
          >
            {props.timeToStart === COUNTDOWN_TIME ? "Ready" : props.timeToStart}
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
