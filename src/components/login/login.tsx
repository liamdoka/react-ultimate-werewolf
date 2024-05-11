import { Done } from "@mui/icons-material";
import { RoomRequest, ServerAction, StatusCallback } from "../../lib/types";
import { generateRoomCode } from "../../lib/utils";
import { useRef } from "react";
import { Socket } from "socket.io-client";

export default function Login(props: {
  socket: Socket;
  setLoggedIn: Function;
  setNickname: Function;
  setRoomCode: Function;
}) {
  props.socket.on(ServerAction.JoinRoomCallback, (res: StatusCallback) => {
    if (res.status == "success") {
      props.setLoggedIn(true);
    }
  });

  const nicknameRef = useRef<HTMLInputElement>(null);
  const roomCodeRef = useRef<HTMLInputElement>(null);

  const handleJoinButton = () => {
    // do somethign
  };

  const handleCreateButton = () => {
    // do somethign esle;
    const nickname = nicknameRef.current?.value;

    if (!nickname || nickname.trim() == "") {
      throw Error("nickname empty");
    }

    const newRoomCode = generateRoomCode();

    const roomRequest: RoomRequest = {
      nickname: nickname,
      roomCode: newRoomCode,
    };

    props.setNickname(nickname);
    props.setRoomCode(newRoomCode);

    props.socket.emit(ServerAction.CreateRoom, roomRequest);
    props.socket.emit(ServerAction.JoinRoom, roomRequest);
  };

  return (
    <div className="flex min-w-96 flex-col items-center justify-between gap-8 rounded-lg bg-slate-700 p-8 shadow-xl">
      <p className=" text-center font-bold">JOIN A ROOM</p>
      <div className="flex flex-grow flex-col flex-nowrap gap-4">
        {/* user nickname */}
        <input
          className="rounded-md bg-slate-800 p-2 "
          ref={nicknameRef}
          type="text"
          placeholder="nickname"
        />

        <div className="flex flex-row flex-nowrap">
          {/* room code */}
          <input
            className="shrink rounded-s-md bg-slate-800 p-2"
            ref={roomCodeRef}
            type="text"
            placeholder="join room"
          />
          {/* join room */}
          <button
            className="rounded-e-md bg-blue-700 p-2 hover:bg-blue-600"
            onClick={handleJoinButton}
          >
            <Done />
          </button>
        </div>

        <p className="text-center leading-3 text-slate-400">- or -</p>

        {/* create room */}
        <button
          className="rounded-md bg-blue-700 p-2 font-bold text-blue-50 hover:bg-blue-600"
          onClick={handleCreateButton}
        >
          Create Game
        </button>
      </div>
    </div>
  );
}
