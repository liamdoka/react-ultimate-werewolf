import Chatbox from "../components/chatbox/chatbox";
import RoomCode from "../components/roomCode/roomCode";
import LobbyMenu from "../components/lobby/lobby";
import Setup from "../components/setup/setup";
import { useEffect, useState } from "react";
import {
  LobbyState,
  Lobby,
  LobbyAction,
  ServerAction,
  Player,
} from "../lib/types";
import {
  LobbyPayload,
  useLobby,
  useLobbyDispatch,
} from "../context/lobbyContext";
import { useClient } from "../context/clientContext";
import { COUNTDOWN_TIME } from "../lib/constants";
import { useInterval, useMobile } from "../lib/hooks";
import { allPlayersReady } from "../lib/utils";

export default function SetupPage() {
  const [timeToStart, setTimeToStart] = useState<number>(COUNTDOWN_TIME);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const isMobile = useMobile();

  const lobby = useLobby();
  const lobbyDispatch = useLobbyDispatch();

  const client = useClient();
  const isReady: boolean =
    lobby.players.find(
      (player: Player) => player.socketId === client.socket?.id,
    )?.isReady ?? false;
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
  }, [lobby.admin, client.socket]);

  // start countdown timer on LobbyState change
  useEffect(() => {
    if (lobby.state === LobbyState.Starting) {
      if (isStarting == false) setIsStarting(true);
    } else {
      if (isStarting == true) setIsStarting(false);
      setTimeToStart(COUNTDOWN_TIME);
    }
  }, [lobby, isStarting]);

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
        const adminIndex = newLobby.players.findIndex(
          (player: Player) => player.socketId === lobby.admin,
        );
        if (adminIndex < 0 || adminIndex > newLobby.players.length)
          throw RangeError();

        newLobby.players[adminIndex].isReady = false;

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
          {isMobile ? (
            <>
              <RoomCode code={client.roomCode} />
              <Setup
                timeToStart={timeToStart}
                isAdmin={isAdmin}
                isReady={isReady}
              />
              <LobbyMenu />
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4">
                <RoomCode code={client.roomCode} />
                <LobbyMenu />
              </div>

              <Setup
                timeToStart={timeToStart}
                isAdmin={isAdmin}
                isReady={isReady}
              />
              <Chatbox />
            </>
          )}
        </div>
      )}
    </>
  );
}
