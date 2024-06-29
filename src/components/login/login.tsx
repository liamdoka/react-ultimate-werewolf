import { Done } from "@mui/icons-material";
import { ClientAction, LoginRequest, ServerAction } from "../../lib/types";
import { generateRoomCode } from "../../lib/utils";
import { useRef } from "react";
import {
  ClientPayload,
  useClient,
  useClientDispatch,
} from "../../context/clientContext";
import { ValueEmptyError } from "../../lib/errors";

export default function Login() {
  const client = useClient();
  const clientDispatch = useClientDispatch();

  const nicknameRef = useRef<HTMLInputElement>(null);
  const roomCodeRef = useRef<HTMLInputElement>(null);

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

    if (!nickname || nickname.trim() == "") throw ValueEmptyError("nickname");
    if (!roomCode || roomCode.trim() == "") throw ValueEmptyError("roomCode");

    const loginRequest: LoginRequest = {
      nickname: nickname,
      roomCode: roomCode,
    };

    joinRoom(loginRequest);
  };

  const handleCreateButton = () => {
    const nickname = nicknameRef.current?.value;

    if (!nickname || nickname.trim() == "") throw ValueEmptyError("nickname");

    const newRoomCode = generateRoomCode();
    const loginRequest: LoginRequest = {
      nickname: nickname,
      roomCode: newRoomCode,
    };
    createRoom(loginRequest);
  };

  const createRoom = (loginRequest: LoginRequest) => {
    client.socket?.emit(
      ServerAction.CreateRoom,
      loginRequest,
      (success: boolean) => {
        if (success) {
          joinRoom(loginRequest);
        } else {
          //TODO: represent this in the ui somehow
          console.log("failed to create room");
        }
      },
    );
  };

  const joinRoom = (loginRequest: LoginRequest) => {
    client.socket?.emit(
      ServerAction.JoinRoom,
      loginRequest,
      (success: boolean) => {
        if (success) {
          clientDispatch({
            action: ClientAction.JoinRoom,
            payload: loginRequest,
          } satisfies ClientPayload);
        } else {
          //TODO: represent this in the UI somhow
          console.log("failed to join room");
        }
      },
    );
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

        {/* divider */}
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
