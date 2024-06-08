import { Done } from "@mui/icons-material";
import { RoomRequest, ServerAction, StatusCallback } from "../../lib/types";
import { generateRoomCode } from "../../lib/utils";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

export default function Login(props: {
  socket: Socket;
  setLoggedIn: Function;
  setRoomCode: Function;
}) {
  const nicknameRef = useRef<HTMLInputElement>(null);
  const roomCodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    props.socket.on(ServerAction.JoinRoomCallback, handleJoinRoomCallback);

    return () => {
      props.socket.off(ServerAction.JoinRoomCallback);
    };
  }, [props.socket]);

  const handleJoinRoomCallback = (res: StatusCallback & RoomRequest) => {
    if (res.status == "success") {
      props.setRoomCode(res.roomCode);
      props.setLoggedIn(true);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key == "Enter") {
      ev.preventDefault();
      const nickname = nicknameRef.current?.value;
      const roomCode = roomCodeRef.current?.value;

      if (nickname?.trim() != "") {
        if (roomCode?.trim() != "") {
          handleJoinButton();
        } else {
          handleCreateButton();
        }
      }
    }
  };

  const handleJoinButton = () => {
    const nickname = nicknameRef.current?.value;
    const roomCode = roomCodeRef.current?.value;

    if (!nickname || nickname.trim() == "") {
      throw Error("nickname empty");
    }

    if (!roomCode || roomCode.trim() == "") {
      throw Error("roomCode empty");
    }

    const roomRequest: RoomRequest = {
      nickname: nickname,
      roomCode: roomCode,
    };

    props.socket.emit(ServerAction.JoinRoom, roomRequest);
  };

  const handleCreateButton = () => {
    const nickname = nicknameRef.current?.value;

    if (!nickname || nickname.trim() == "") {
      throw Error("nickname empty");
    }

    const newRoomCode = generateRoomCode();

    const roomRequest: RoomRequest = {
      nickname: nickname,
      roomCode: newRoomCode,
    };

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
          onKeyDown={handleKeyDown}
        />

        <div className="flex flex-row flex-nowrap">
          {/* room code */}
          <input
            className="shrink rounded-s-md bg-slate-800 p-2"
            ref={roomCodeRef}
            type="text"
            placeholder="join room"
            onKeyDown={handleKeyDown}
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
