import { Socket } from "socket.io-client";
import Chatbox from "../components/chatbox/chatbox";
import RoomCode from "../components/roomcode/roomcode";
import LobbyMenu from "../components/lobby/lobby";
import GameSetup from "../components/game/gameSetup";
import { useEffect, useState } from "react";
import { Lobby, ServerAction } from "../lib/types";

export default function GamePage(props: {
  socket: Socket;
  roomCode: string;
  nickname: string;
}) {
  const [lobby, setLobby] = useState<Lobby>();

  useEffect(() => {
    props.socket.on(ServerAction.SyncLobby, (payload: Lobby) => {
      setLobby(payload);
    });

    // requests the lobby once upon joining
    props.socket.emit(ServerAction.SyncLobby);

    return () => {
      props.socket.off(ServerAction.SyncLobby);
    };
  }, []);

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
            nickname={props.nickname}
            roomCode={props.roomCode}
          />
        </>
      )}
    </div>
  );
}
