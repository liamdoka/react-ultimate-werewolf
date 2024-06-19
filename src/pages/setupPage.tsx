import Chatbox from "../components/chatbox/chatbox";
import RoomCode from "../components/roomCode/roomCode";
import LobbyMenu from "../components/lobby/lobby";
import Setup from "../components/setup/setup";
import { useEffect, useState } from "react";
import { GameState, Lobby, LobbyAction, ServerAction } from "../lib/types";
import {
  LobbyPayload,
  useLobby,
  useLobbyDispatch,
} from "../context/lobbyContext";
import { useClient } from "../context/clientContext";
import { COUNTDOWN_TIME } from "../lib/constants";
import { useInterval } from "../lib/utils";

export default function GamePage() {
  const [timeToStart, setTimeToStart] = useState<number>(COUNTDOWN_TIME);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  const lobby = useLobby();
  const lobbyDispatch = useLobbyDispatch();

  const client = useClient();
  const isAdmin = client.socket?.id == lobby?.admin;

  // update lobby on server action
  useEffect(() => {
    client.socket?.on(ServerAction.SyncLobby, handleSyncLobby);

    function handleSyncLobby(payload: Lobby) {
      lobbyDispatch({
        action: LobbyAction.SyncLobby,
        socketId: client.socket?.id ?? "",
        payload: payload,
      } satisfies LobbyPayload);

      if (isAdmin) {
        checkStartGame(payload);
      }

      if (payload.state == GameState.Running) {
        console.log("THE GAME IS RUNNING DAYMN");
      }
    }

    console.log("oneitme");

    // requests the lobby once upon joining
    client.socket?.emit(ServerAction.SyncLobby);

    return () => {
      client.socket?.off(ServerAction.SyncLobby, handleSyncLobby);
    };
  }, [client.socket]);

  // start countdown timer on gamestate change
  useEffect(() => {
    if (isStarting === false && lobby.state === GameState.Starting) {
      setIsStarting(true);
    } else {
      setIsStarting(false);
      setTimeToStart(COUNTDOWN_TIME);
    }
  }, [lobby.state]);

  useInterval(
    () => {
      setTimeToStart((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      if (timeToStart === 0) {
        setIsStarting(false);
        if (isAdmin) {
          handleStartGame();
        }
      }
    },
    isStarting ? 1000 : null,
  );

  const allPlayersReady = (_lobby: Lobby): boolean => {
    for (const player of _lobby.players) {
      if (player.isReady == false) return false;
    }
    return true;
  };

  const checkStartGame = (_lobby: Lobby) => {
    const arePlayersReady = allPlayersReady(_lobby);

    // if all players are ready, start the game
    if (arePlayersReady) {
      initiateStartGame(_lobby);
    } else {
      // if the players are no longer ready, change the state
      if (_lobby.state === GameState.Starting) {
        const newLobby: Lobby = {
          ..._lobby,
          state: GameState.Waiting,
        };
        client.socket?.emit(ServerAction.UpdateLobby, newLobby);
      }
    }

    console.log("check start game");
  };

  const initiateStartGame = (_lobby: Lobby) => {
    if (_lobby.state !== GameState.Waiting) return;
    // if (_lobby.players.length < 2) return;

    const newLobby: Lobby = {
      ..._lobby,
      state: GameState.Starting,
    };

    console.log("initiate start game");
    client.socket?.emit(ServerAction.UpdateLobby, newLobby);
  };

  const handleStartGame = () => {
    console.log("handling start game");
    console.log(lobby);
    if (lobby?.state !== GameState.Starting) return;

    const newLobby: Lobby = {
      ...lobby,
      state: GameState.Running,
    };

    client.socket?.emit(ServerAction.UpdateLobby, newLobby);
  };

  return (
    <>
      {lobby && (
        <div className="flex flex-row gap-4">
          <div className="flex flex-col items-center gap-4">
            <RoomCode code={client.roomCode} />
            <LobbyMenu />
          </div>

          <Setup timeToStart={timeToStart} />
          <Chatbox />
        </div>
      )}
    </>
  );
}
