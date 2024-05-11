import { Socket } from "socket.io-client";
import Chatbox from "../components/chatbox/chatbox";
import RoomCode from "../components/roomcode/roomcode";

export default function GamePage(props: {
  socket: Socket;
  roomCode: string;
  nickname: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4">
      <RoomCode code={props.roomCode} />
      <Chatbox
        socket={props.socket}
        nickname={props.nickname}
        roomCode={props.roomCode}
      />
    </div>
  );
}
