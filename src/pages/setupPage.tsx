import Chatbox from "../components/chatbox/chatbox";
import RoomCode from "../components/roomCode/roomCode";
import LobbyMenu from "../components/lobby/lobby";
import Setup from "../components/setup/setup";
import { useEffect, useState } from "react";
import { LobbyState, Lobby, LobbyAction, ServerAction } from "../lib/types";
import {
  LobbyPayload,
  useLobby,
  useLobbyDispatch,
} from "../context/lobbyContext";
import { useClient } from "../context/clientContext";
import { COUNTDOWN_TIME } from "../lib/constants";
import { useInterval, useMediaQuery } from "../lib/utils";

export default function SetupPage() {
  const [timeToStart, setTimeToStart] = useState<number>(COUNTDOWN_TIME);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const lobby = useLobby();
  const lobbyDispatch = useLobbyDispatch();

  const client = useClient();

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
    }

    // requests the lobby once upon joining
    client.socket?.emit(ServerAction.SyncLobby);

    return () => {
      client.socket?.off(ServerAction.SyncLobby, handleSyncLobby);
    };
  }, [client.socket, isAdmin]);

  // set the admin every time the lobby changes
  useEffect(() => {
    setIsAdmin(client.socket?.id == lobby?.admin);
  }, [lobby, client]);

  // start countdown timer on LobbyState change
  useEffect(() => {
    if (isStarting === false && lobby.state === LobbyState.Starting) {
      setIsStarting(true);
    } else {
      setIsStarting(false);
      setTimeToStart(COUNTDOWN_TIME);
    }
  }, [lobby]);

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
      initiateCountdown(_lobby);
    } else {
      // if the players are no longer ready, change the state
      if (_lobby.state === LobbyState.Starting) {
        const newLobby: Lobby = {
          ..._lobby,
          state: LobbyState.Waiting,
        };
        client.socket?.emit(ServerAction.UpdateLobby, newLobby);
      }
    }
  };

  const initiateCountdown = (_lobby: Lobby) => {
    if (_lobby.state !== LobbyState.Waiting) return;
    // if (_lobby.players.length < 2) return;

    const newLobby: Lobby = {
      ..._lobby,
      state: LobbyState.Starting,
    };

    client.socket?.emit(ServerAction.UpdateLobby, newLobby);
  };

  const handleStartGame = () => {
    if (lobby?.state !== LobbyState.Starting) throw TypeError();

    const newLobby: Lobby = {
      ...lobby,
      state: LobbyState.Running,
    };

    client.socket?.emit(ServerAction.StartGame, newLobby);
  };

  return (
    <>
      {lobby && (
        <div className="flex flex-col items-center gap-4 p-4 md:flex-row">
          {isDesktop ? (
            <>
              <div className="flex flex-col items-center gap-4">
                <RoomCode code={client.roomCode} />
                <LobbyMenu />
              </div>

              <Setup timeToStart={timeToStart} isAdmin={isAdmin} />
              <Chatbox />
            </>
          ) : (
            <>
              <RoomCode code={client.roomCode} />
              <Setup timeToStart={timeToStart} isAdmin={isAdmin} />
              <LobbyMenu />
            </>
          )}
        </div>
      )}
    </>
  );
}
