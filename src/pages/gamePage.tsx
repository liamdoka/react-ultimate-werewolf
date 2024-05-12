import { Socket } from "socket.io-client";
import Chatbox from "../components/chatbox/chatbox";
import RoomCode from "../components/roomcode/roomcode";
import LobbyMenu from "../components/lobby/lobby";
import GameSetup from "../components/game/gameSetup";

export default function GamePage(props: {
  socket: Socket;
  roomCode: string;
  nickname: string;
}) {
  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col items-center gap-4">
        <RoomCode code={props.roomCode} />
        <LobbyMenu socket={props.socket} />
      </div>
      <GameSetup />
      <Chatbox
        socket={props.socket}
        nickname={props.nickname}
        roomCode={props.roomCode}
      />
    </div>
  );
}
