import { Socket } from "socket.io-client";
import Chatbox from "../components/chatbox/chatbox";
import RoomCode from "../components/roomcode/roomcode";
import LobbyMenu from "../components/lobby/lobby";
import GameSetup from "../components/game/gameSetup";
import { useEffect, useState } from "react";
import { GameState, Lobby, Player, ServerAction } from "../lib/types";
import { COUNTDOWN_TIME } from "../lib/constants";

export default function GamePage(props: { socket: Socket; roomCode: string }) {
  const [lobby, setLobby] = useState<Lobby>();
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [timeToStart, setTimeToStart] = useState<number>(10);
  const [timeoutId, setTimeoutId] = useState<Timer>();
  const [self, setSelf] = useState<Player>();
  const isAdmin = self?.socketId == lobby?.admin;

  useEffect(() => {
    setSelf(
      lobby?.players.find((player) => player.socketId === props.socket.id),
    );
  });

  useEffect(() => {
    props.socket.on(ServerAction.SyncLobby, (payload: Lobby) => {
      setLobby(payload);
      setIsStarting(payload.state == GameState.Starting);

      if (isAdmin) {
        checkStartGame(payload);
      }

      if (payload.state == GameState.Running) {
        console.log("THE GAME IS RUNNING DAYMN");
      }
    });

    // requests the lobby once upon joining
    props.socket.emit(ServerAction.SyncLobby);

    return () => {
      props.socket.off(ServerAction.SyncLobby);
    };
  }, []);

  //TODO: THis effect doesnt work and i want to switch to useReducer
  // useEffect(() => {
  //   if (isStarting) {
  //     console.log("49: starting game");
  //     console.log(lobby);

  //     if (timeoutId !== undefined) return;

  //     const newTimeoutId = setInterval(() => {
  //       console.log("53: starting countdown");

  //       if (lobby?.state !== GameState.Starting) {
  //         clearInterval(newTimeoutId);
  //         return;
  //       }

  //       console.log(`61: countdown at ${timeToStart}`);
  //       setTimeToStart((prevTime) => prevTime - 1);

  //       if (timeToStart < 1) clearInterval(newTimeoutId);
  //       if (isAdmin == false) return;

  //       // get the admin to check if all players are still ready
  //       if (allPlayersReady(lobby!) == false) {
  //         const waitingLobby: Lobby = {
  //           ...lobby!,
  //           state: GameState.Waiting,
  //         };

  //         props.socket.emit(ServerAction.UpdateLobby, waitingLobby);
  //         clearInterval(newTimeoutId);
  //         return;
  //       }

  //       if (timeToStart < 1) {
  //         handleStartGame();
  //       }
  //     }, 1000);

  //     setTimeoutId(newTimeoutId);
  //   } else {
  //     setTimeToStart(COUNTDOWN_TIME);
  //     setTimeoutId(undefined);
  //   }
  // }, [lobby?.state]);

  const allPlayersReady = (_lobby: Lobby): boolean => {
    const playersReady: number = _lobby.players
      .map((player: Player): number => (player.isReady ? 1 : 0))
      .reduce((a, b) => a + b);

    return playersReady == _lobby.players.length;
  };

  const checkStartGame = (_lobby: Lobby) => {
    const arePlayersReady = allPlayersReady(_lobby);

    // if all players are ready, start the game
    if (arePlayersReady) {
      initiateStartGame(_lobby);
    } else {
      // if the players are no longer ready, change the state
      if (isStarting) {
        const newLobby: Lobby = {
          ..._lobby,
          state: GameState.Waiting,
        };
        props.socket.emit(ServerAction.UpdateLobby, newLobby);
      }
    }
  };

  const initiateStartGame = (_lobby: Lobby) => {
    if (_lobby.state !== GameState.Waiting) return;
    if (_lobby.players.length < 2) return;

    const newLobby: Lobby = {
      ..._lobby,
      state: GameState.Starting,
    };

    props.socket.emit(ServerAction.UpdateLobby, newLobby);
    setIsStarting(true);
  };

  const handleStartGame = () => {
    if (lobby?.state !== GameState.Starting) return;
    if (isStarting == false) return;

    const newLobby: Lobby = {
      ...lobby,
      state: GameState.Running,
    };

    props.socket.emit(ServerAction.UpdateLobby, newLobby);
  };

  return (
    <div className="flex flex-row gap-4">
      {lobby && (
        <>
          <div className="flex flex-col items-center gap-4">
            <RoomCode code={props.roomCode} />
            <LobbyMenu socket={props.socket} lobby={lobby} />
          </div>

          <GameSetup socket={props.socket} lobby={lobby} />
          <Chatbox
            socket={props.socket}
            nickname={self?.nickname ?? "_"}
            roomCode={props.roomCode}
          />
        </>
      )}
    </div>
  );
}
