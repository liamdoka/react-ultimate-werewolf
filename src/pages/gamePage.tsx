import { Socket } from "socket.io-client";
import Chatbox from "../components/chatbox/chatbox";
import RoomCode from "../components/roomcode/roomcode";
import LobbyMenu from "../components/lobby/lobby";
import GameSetup from "../components/game/gameSetup";
import { useEffect, useState } from "react";
import { Lobby, Player, ServerAction } from "../lib/types";

export default function GamePage(props: { socket: Socket; roomCode: string }) {
  const [lobby, setLobby] = useState<Lobby>();
  const [self, setSelf] = useState<Player>();

  useEffect(() => {
    setSelf(
      lobby?.players.find((player) => player.socketId === props.socket.id),
    );
  }, [lobby]);

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
            nickname={self?.nickname ?? "_"}
            roomCode={props.roomCode}
          />
        </>
      )}
    </div>
  );
}
